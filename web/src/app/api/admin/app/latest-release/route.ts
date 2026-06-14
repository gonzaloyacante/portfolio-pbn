/**
 * GET  /api/admin/app/latest-release
 * POST /api/admin/app/latest-release
 *
 * GET  — PÚBLICO (sin autenticación). Devuelve la última release publicada de
 *         la app Flutter. La app la consulta al arrancar para saber si hay
 *         actualización disponible.
 *
 * POST — Protegido con X-Deploy-Token (secreto del script de distribución).
 *         Crea una nueva release y dispara un push FCM silencioso a todos los
 *         dispositivos admin registrados para que muestren el diálogo in-app.
 *
 * Variables de entorno requeridas:
 *   DEPLOY_SECRET_TOKEN  — token secreto para el script de distribución
 *   FIREBASE_PROJECT_ID  — para enviar el push FCM
 */

import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendPushToAdmins } from '@/lib/push-service'
import { appReleaseApiSchema } from '@/lib/validations'
import { CACHE_DURATIONS, CACHE_TAGS } from '@/lib/cache-tags'

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Valida el token de despliegue incluido como header X-Deploy-Token.
 * Comparación constante en tiempo (resistente a timing attacks).
 */
function validateDeployToken(req: Request): boolean {
  const secret = process.env.DEPLOY_SECRET_TOKEN
  if (!secret || secret.trim().length === 0) {
    logger.warn('DEPLOY_SECRET_TOKEN no configurado — rechazando POST de release')
    return false
  }
  const token = req.headers.get('X-Deploy-Token') ?? ''
  if (token.length !== secret.length) return false

  // Comparación byte a byte (resistente a timing Attack)
  let mismatch = 0
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ secret.charCodeAt(i)
  }
  return mismatch === 0
}

/**
 * Compara dos versiones semver (ej. "1.2.0" vs "1.1.0").
 * Soporta sufijos de prerelease/build ("1.2.0-beta.1", "1.2.0+45"): se compara
 * primero la parte numérica "X.Y.Z"; si es igual, una versión CON sufijo es
 * MENOR que la misma versión sin sufijo (semver: prerelease < release).
 * Retorna:  1 si a > b
 *          -1 si a < b
 *           0 si iguales
 */
function compareSemver(a: string, b: string): number {
  const parse = (v: string) => {
    const core = v.split(/[-+]/, 1)[0]
    return { parts: core.split('.').map((n) => Number(n) || 0), hasSuffix: core.length < v.length }
  }
  const pa = parse(a)
  const pb = parse(b)
  const len = Math.max(pa.parts.length, pb.parts.length)
  for (let i = 0; i < len; i++) {
    const diff = (pa.parts[i] ?? 0) - (pb.parts[i] ?? 0)
    if (diff !== 0) return diff > 0 ? 1 : -1
  }
  if (pa.hasSuffix !== pb.hasSuffix) return pa.hasSuffix ? -1 : 1
  return 0
}

async function urlIsReachable(u: string) {
  try {
    const head = await fetch(u, { method: 'HEAD', cache: 'no-store' })
    if (head.ok) return true
    const r = await fetch(u, {
      method: 'GET',
      cache: 'no-store',
      headers: { Range: 'bytes=0-0' },
    })
    return r.ok
  } catch {
    return false
  }
}

const getReachableLatestRelease = unstable_cache(
  async () => {
    const release = await prisma.appRelease.findFirst({
      orderBy: { publishedAt: 'desc' },
      select: {
        version: true,
        versionCode: true,
        releaseNotes: true,
        downloadUrl: true,
        checksumSha256: true,
        mandatory: true,
        minVersion: true,
        fileSizeBytes: true,
        publishedAt: true,
      },
    })

    if (!release) return null

    if (!(await urlIsReachable(release.downloadUrl))) {
      logger.warn('GET /api/admin/app/latest-release: release oculta — downloadUrl no alcanzable', {
        downloadUrl: release.downloadUrl,
      })
      return null
    }

    return release
  },
  ['admin-app-latest-release-v1'],
  { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.appReleases] }
)

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    // Leer query params opcionales para incluir info de si hay update disponible
    const url = new URL(req.url)
    const currentVersion = url.searchParams.get('version') ?? ''
    const currentVersionCode = parseInt(url.searchParams.get('versionCode') ?? '0', 10)

    const release = await getReachableLatestRelease()

    if (!release) {
      return NextResponse.json(
        { success: true, data: null, updateAvailable: false },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=900, stale-while-revalidate=3600',
          },
        }
      )
    }

    // Calcular si hay actualización disponible (para incluirlo en la respuesta)
    let updateAvailable = false
    let forceUpdate = false

    if (currentVersion && currentVersionCode > 0) {
      updateAvailable = release.versionCode > currentVersionCode
      // mandatory sin minVersion fuerza para todos los que tienen update
      // disponible; con minVersion, solo fuerza por debajo de ese umbral (M17).
      forceUpdate =
        updateAvailable &&
        release.mandatory === true &&
        (!release.minVersion || compareSemver(currentVersion, release.minVersion) < 0)
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...release,
          publishedAt: release.publishedAt.toISOString(),
        },
        updateAvailable,
        forceUpdate,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=900, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    logger.error('GET /api/admin/app/latest-release error', { error: String(error) })
    return NextResponse.json(
      { success: false, error: 'Error al obtener información de versión' },
      { status: 500 }
    )
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // 1. Validar token de despliegue
  if (!validateDeployToken(req)) {
    logger.warn('POST /api/admin/app/latest-release: token inválido o ausente')
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
  }

  // 2. Parsear y validar body
  const body = await req.json().catch(() => null)
  const parsed = appReleaseApiSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const {
    version,
    versionCode,
    releaseNotes,
    downloadUrl,
    checksumSha256,
    mandatory,
    minVersion,
    fileSizeBytes,
  } = parsed.data

  // 3. Crear la release en la base de datos
  let release
  try {
    if (!(await urlIsReachable(downloadUrl))) {
      logger.warn('POST /api/admin/app/latest-release: downloadUrl no alcanzable', { downloadUrl })
      return NextResponse.json(
        { success: false, error: 'downloadUrl no alcanzable' },
        { status: 400 }
      )
    }

    release = await prisma.appRelease.create({
      data: {
        version,
        versionCode,
        releaseNotes,
        downloadUrl,
        checksumSha256: (checksumSha256 as string | undefined) ?? null,
        mandatory: mandatory === true,
        minVersion: (minVersion as string | undefined) ?? null,
        fileSizeBytes: typeof fileSizeBytes === 'number' ? fileSizeBytes : null,
        publishedAt: new Date(),
      },
    })
    logger.info(`AppRelease creada: v${version} (build ${versionCode}) — ${release.id}`)
  } catch (error) {
    logger.error('POST /api/admin/app/latest-release: error al crear release', {
      error: String(error),
    })
    return NextResponse.json(
      { success: false, error: 'Error al guardar la release' },
      { status: 500 }
    )
  }

  // 4. Enviar push FCM silencioso a todos los dispositivos admin
  //    Solo si hay tokens registrados; si no, simplemente omitimos.
  try {
    await sendPushToAdmins({
      title: `📱 Nueva versión disponible: ${version}`,
      body: releaseNotes.split('\n')[0] ?? `Actualización a la versión ${version}`,
      type: 'app_update',
      screen: 'update',
      id: release.id,
      // data extra que la app Flutter usará para mostrar el diálogo
      extra: {
        version,
        versionCode: String(versionCode),
        downloadUrl,
        checksumSha256: checksumSha256 ?? '',
        mandatory: mandatory ? 'true' : 'false',
        fileSizeBytes: fileSizeBytes ? String(fileSizeBytes) : '',
        releaseNotes,
      },
    })
    logger.info(`AppRelease: push FCM enviado para v${version}`)
  } catch (error) {
    // El push no es crítico — la release ya fue creada.
    logger.warn('AppRelease: error al enviar push FCM (no crítico)', { error: String(error) })
  }

  // 5. Revalidar la ruta pública para que la CDN/dev preview sirva la release nueva
  try {
    // Forzar revalidación del path para invalidar cached GET responses
    revalidatePath('/api/admin/app/latest-release')
    revalidateTag(CACHE_TAGS.appReleases, 'max')
    logger.info('Revalidated /api/admin/app/latest-release via revalidatePath')
  } catch (err) {
    logger.warn('No se pudo revalidatePath /api/admin/app/latest-release', { error: String(err) })
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        id: release.id,
        version: release.version,
        versionCode: release.versionCode,
        publishedAt: release.publishedAt.toISOString(),
      },
      message: `Release v${version} (build ${versionCode}) publicada correctamente`,
    },
    { status: 201 }
  )
}
