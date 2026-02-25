/**
 * push-service.ts
 *
 * Servicio de envío de notificaciones push via FCM HTTP v1 API.
 *
 * Usa `jose` (ya en dependencies) para firmar el JWT del service account y
 * obtener un access_token de Google OAuth2. No requiere `firebase-admin`.
 *
 * Variables de entorno requeridas:
 *   FIREBASE_PROJECT_ID      — ID del proyecto Firebase
 *   FIREBASE_CLIENT_EMAIL    — email de la cuenta de servicio
 *   FIREBASE_PRIVATE_KEY     — clave privada RSA (PEM) con \n escapados
 *
 * Uso:
 * ```ts
 * import { sendPushToAdmins } from '@/lib/push-service'
 * await sendPushToAdmins({ title: 'Nuevo contacto', body: 'Ana García', type: 'contact', id: 'xxx', screen: 'contacts' })
 * ```
 */

import { importPKCS8, SignJWT } from 'jose'

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

// ── Constantes FCM ────────────────────────────────────────────────────────────

const FCM_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const OAUTH2_TOKEN_URL = 'https://oauth2.googleapis.com/token'

function fcmUrl(projectId: string) {
  return `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`
}

// ── Token cache (process-level) ───────────────────────────────────────────────

let _cachedAccessToken: string | null = null
let _tokenExpiresAt = 0

/**
 * Obtiene (o renueva) el access token OAuth2 para llamar a la FCM HTTP v1 API.
 * El token se reutiliza durante toda su vida útil (1h) menos un buffer de 5 min.
 */
async function getAccessToken(): Promise<string> {
  if (_cachedAccessToken && Date.now() < _tokenExpiresAt) {
    return _cachedAccessToken
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const rawKey = process.env.FIREBASE_PRIVATE_KEY

  if (!clientEmail || !rawKey) {
    throw new Error('FIREBASE_CLIENT_EMAIL o FIREBASE_PRIVATE_KEY no configurados')
  }

  // Vercel almacena la clave con \n literales → los rehidratamos
  const privateKeyPem = rawKey.replace(/\\n/g, '\n')

  const privateKey = await importPKCS8(privateKeyPem, 'RS256')

  const nowSec = Math.floor(Date.now() / 1000)

  // JWT firmado con la service account para intercambio OAuth2
  const assertion = await new SignJWT({ scope: FCM_SCOPE })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience(OAUTH2_TOKEN_URL)
    .setIssuedAt(nowSec)
    .setExpirationTime(nowSec + 3600)
    .sign(privateKey)

  const res = await fetch(OAUTH2_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OAuth2 token exchange failed (${res.status}): ${text}`)
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  _cachedAccessToken = json.access_token
  // Expira en expires_in segundos − 5 min de buffer
  _tokenExpiresAt = Date.now() + (json.expires_in - 300) * 1000

  return _cachedAccessToken
}

// ── Tipos públicos ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'contact'
  | 'booking'
  | 'booking_reminder'
  | 'project'
  | 'service'
  | 'testimonial'
  | 'system'

export interface PushPayload {
  /** Título visible en la bandeja del sistema */
  title: string
  /** Cuerpo del mensaje */
  body: string
  /** Tipo de evento (para deep-link en la app) */
  type: NotificationType
  /** ID de la entidad (para navegar directo al detalle) */
  id?: string
  /** Nombre de la pantalla destino en la app */
  screen?: string
  /** URL de imagen en la notificación (Android 16+ / iOS rich) */
  imageUrl?: string
}

// ── Envío a un token ──────────────────────────────────────────────────────────

interface SendResult {
  tokenId: string
  valid: boolean
}

/**
 * Envía una notificación FCM a un único token.
 * Retorna `{ valid: false }` si el token está expirado/inválido (para limpieza).
 * Lanza error si la falla es inesperada.
 */
async function sendToToken(
  tokenId: string,
  token: string,
  payload: PushPayload,
  projectId: string,
  accessToken: string
): Promise<SendResult> {
  const message = {
    message: {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
        ...(payload.imageUrl ? { image: payload.imageUrl } : {}),
      },
      // data: todos los valores deben ser string
      data: {
        type: payload.type,
        ...(payload.id ? { id: payload.id } : {}),
        ...(payload.screen ? { screen: payload.screen } : {}),
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      // Config Android: alta prioridad + canal dedicado
      android: {
        priority: 'high',
        notification: {
          channel_id: 'admin_high',
          notification_priority: 'PRIORITY_HIGH',
          default_sound: true,
          default_vibrate_timings: true,
          ...(payload.imageUrl ? { image: payload.imageUrl } : {}),
        },
      },
      // Config iOS (APNs)
      apns: {
        headers: { 'apns-priority': '10' },
        payload: {
          aps: {
            alert: { title: payload.title, body: payload.body },
            sound: 'default',
            badge: 1,
          },
        },
      },
    },
  }

  const res = await fetch(fcmUrl(projectId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(message),
  })

  if (res.ok) {
    return { tokenId, valid: true }
  }

  // Error: analizar si el token está expirado
  const errorBody = (await res.json()) as {
    error?: { code?: number; status?: string; message?: string }
  }
  const status = errorBody.error?.status

  if (status === 'NOT_FOUND' || status === 'UNREGISTERED') {
    // Token inválido → marcar para desactivar, no es un error grave
    return { tokenId, valid: false }
  }

  // Error inesperado → propagar para que Promise.allSettled lo capture
  throw new Error(`FCM token ${tokenId} send error (${res.status}): ${JSON.stringify(errorBody)}`)
}

// ── API Pública ───────────────────────────────────────────────────────────────

/**
 * Envía una notificación push a todos los administradores con token FCM activo.
 *
 * - Nunca lanza excepciones al llamador: los errores se loguean y se swallow.
 * - Tokens inválidos (expirados/revocados) se desactivan automáticamente en DB.
 * - Thread-safe para ambientes serverless: el token OAuth2 se cachea en memoria.
 */
export async function sendPushToAdmins(payload: PushPayload): Promise<void> {
  const projectId = process.env.FIREBASE_PROJECT_ID

  if (!projectId) {
    logger.warn('[push] FIREBASE_PROJECT_ID no configurado — omitiendo push')
    return
  }

  if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    logger.warn('[push] Credenciales Firebase no configuradas — omitiendo push')
    return
  }

  try {
    // 1. Obtener tokens activos
    const tokens = await prisma.pushToken.findMany({
      where: { isActive: true },
      select: { id: true, token: true, platform: true },
    })

    if (tokens.length === 0) {
      logger.debug('[push] Sin tokens activos — push omitido')
      return
    }

    // 2. Obtener access token OAuth2 (cacheado)
    const accessToken = await getAccessToken()

    // 3. Enviar en paralelo a todos los tokens
    const results = await Promise.allSettled(
      tokens.map((t) => sendToToken(t.id, t.token, payload, projectId, accessToken))
    )

    // 4. Limpiar tokens inválidos
    const invalidIds = results
      .filter(
        (r): r is PromiseFulfilledResult<SendResult> => r.status === 'fulfilled' && !r.value.valid
      )
      .map((r) => r.value.tokenId)

    if (invalidIds.length > 0) {
      await prisma.pushToken
        .updateMany({
          where: { id: { in: invalidIds } },
          data: { isActive: false },
        })
        .catch((e) => logger.error('[push] Error al desactivar tokens inválidos', { error: e }))
    }

    // 5. Log resumen
    const successes = results.filter((r) => r.status === 'fulfilled' && r.value.valid).length
    const failures = results.filter((r) => r.status === 'rejected').length

    logger.info('[push] Notificaciones enviadas', {
      total: tokens.length,
      ok: successes,
      invalid: invalidIds.length,
      errors: failures,
      type: payload.type,
    })

    // Loguear errores individuales no recuperables
    for (const r of results) {
      if (r.status === 'rejected') {
        logger.error('[push] Error en envío individual', {
          error: r.reason instanceof Error ? r.reason.message : String(r.reason),
        })
      }
    }
  } catch (err) {
    // NUNCA propagar al llamador — push es best-effort
    logger.error('[push] Fallo general al enviar push notifications', {
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
