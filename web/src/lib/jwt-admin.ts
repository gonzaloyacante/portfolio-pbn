/**
 * JWT custom para la API REST de la app Flutter admin.
 * INDEPENDIENTE de NextAuth — usa jose para firmar y verificar.
 *
 * Estrategia:
 * - Access token:  15 min, firmado con HS256, contiene userId + role
 * - Refresh token: UUID v4 opaco, almacenado en BD (RefreshToken model)
 *   El refresh token en sí NO es un JWT — es un token opaco en BD.
 *
 * Uso:
 *   const { accessToken } = await signAccessToken({ userId, role })
 *   const payload = await verifyAccessToken(token)
 */

import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { env } from './env'
import { createRateLimiter } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit-config'
import { logger } from '@/lib/logger'

// ── Rate limiter para API admin (100 req/min por IP) ──────────────────────────
const adminApiLimiter = createRateLimiter(RATE_LIMITS.API)

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface AdminTokenPayload extends JWTPayload {
  userId: string
  role: string
  type: 'access'
}

export interface SignTokenOptions {
  userId: string
  role: string
}

// ── Constantes ────────────────────────────────────────────────────────────────

const ACCESS_TOKEN_TTL = '15m'
const ISSUER = 'portfolio-pbn-api'
const AUDIENCE = 'portfolio-pbn-flutter-admin'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSecret(): Uint8Array {
  const secret = env.ADMIN_JWT_SECRET
  if (!secret) throw new Error('[jwt-admin] ADMIN_JWT_SECRET no está configurado')
  return new TextEncoder().encode(secret)
}

// ── Sign ──────────────────────────────────────────────────────────────────────

/**
 * Genera un access token JWT (15 min).
 */
export async function signAccessToken(options: SignTokenOptions): Promise<string> {
  const secret = getSecret()
  const now = Math.floor(Date.now() / 1000)

  return new SignJWT({
    userId: options.userId,
    role: options.role,
    type: 'access' as const,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(secret)
}

// ── Verify ────────────────────────────────────────────────────────────────────

/**
 * Verifica un access token y retorna el payload.
 * Lanza `JWTExpired` si expiró, `JWTInvalid` si es inválido.
 */
export async function verifyAccessToken(token: string): Promise<AdminTokenPayload> {
  const secret = getSecret()

  const { payload } = await jwtVerify<AdminTokenPayload>(token, secret, {
    issuer: ISSUER,
    audience: AUDIENCE,
  })

  if (payload.type !== 'access') {
    throw new Error('[jwt-admin] Token type inválido')
  }

  return payload
}

// ── Middleware helper ─────────────────────────────────────────────────────────

/**
 * Extrae y verifica el Bearer token del header Authorization.
 * Para usar en route handlers de la API admin.
 *
 * @example
 * export async function GET(req: Request) {
 *   const auth = await withAdminJwt(req)
 *   if (!auth.ok) return auth.response
 *   const { userId, role } = auth.payload
 *   ...
 * }
 */
export async function withAdminJwt(
  req: Request
): Promise<
  | { ok: true; payload: AdminTokenPayload; response?: never }
  | { ok: false; payload?: never; response: Response }
> {
  // ── Rate limiting por IP ──────────────────────────────────────────────────
  const forwardedFor = req.headers.get('x-forwarded-for')
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown-ip'

  const rateResult = await adminApiLimiter.check(clientIp)
  if (!rateResult.allowed) {
    logger.warn(`[withAdminJwt] Rate limit exceeded for IP: ${clientIp}`)
    adminApiLimiter
      .record(clientIp, { route: req.url })
      .catch((err) => logger.error('[withAdminJwt] Error recording rate limit', { error: err }))

    return {
      ok: false,
      response: new Response(
        JSON.stringify({ success: false, error: `Demasiadas solicitudes. Reset en ${rateResult.resetIn}s` }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateResult.resetIn ?? 60) } }
      ),
    }
  }

  adminApiLimiter
    .record(clientIp, { route: req.url })
    .catch((err) => logger.error('[withAdminJwt] Error recording rate limit', { error: err }))

  // ── JWT verification ──────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    }
  }

  const token = authHeader.slice(7)

  try {
    const payload = await verifyAccessToken(token)
    return { ok: true, payload }
  } catch (err) {
    const isExpired = err instanceof Error && err.message.includes('expired')

    return {
      ok: false,
      response: new Response(
        JSON.stringify({
          success: false,
          error: isExpired ? 'Token expirado' : 'Token inválido',
          code: isExpired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    }
  }
}
