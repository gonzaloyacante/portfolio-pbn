import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger, getRequestId } from '@/lib/logger'

/**
 * Middleware con autenticación, rate limiting, CSRF y request logging.
 *
 * Rate limiting: in-memory por IP (para escalar usar Upstash Redis)
 * CSRF: validación de cookie vs header para mutaciones no-GET en /admin
 * Logger: compatible con Edge runtime (usa console.* internamente, sin imports Node.js)
 */

// ─── In-memory Rate Limiter ─────────────────────────────────────────────────

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const RATE_LIMIT_REQUESTS = 120 // peticiones permitidas
const RATE_LIMIT_WINDOW_MS = 60_000 // por minuto
// Umbral para disparar limpieza inline (Edge runtime no soporta setInterval fiablemente)
const RATE_LIMIT_CLEANUP_THRESHOLD = 5_000

function cleanupExpiredEntries(now: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) rateLimitStore.delete(key)
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  // Limpiar entradas expiradas si el store crece demasiado
  if (rateLimitStore.size > RATE_LIMIT_CLEANUP_THRESHOLD) {
    cleanupExpiredEntries(now)
  }

  // Ventana expirada o primera vez: reiniciar contador
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  // Límite alcanzado
  if (entry.count >= RATE_LIMIT_REQUESTS) return false

  entry.count++
  return true
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

// ─── Response Helpers ────────────────────────────────────────────────────────

function rateLimitedResponse(ip: string, pathname: string): NextResponse {
  logger.warn('[middleware] rate_limit_exceeded', { ip, pathname })
  return new NextResponse(
    JSON.stringify({ error: 'Demasiadas peticiones. Intenta de nuevo en un minuto.' }),
    {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
    }
  )
}

function csrfErrorResponse(ip: string, pathname: string): NextResponse {
  logger.warn('[middleware] csrf_invalid', { ip, pathname })
  return new NextResponse(JSON.stringify({ error: 'Token CSRF inválido o ausente.' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  })
}

function isSafeMethod(method: string): boolean {
  return ['GET', 'HEAD', 'OPTIONS'].includes(method)
}

function isValidCsrf(req: NextRequest): boolean {
  const csrfCookie = req.cookies.get('csrf-token')?.value
  const csrfHeader = req.headers.get('x-csrf-token')
  return Boolean(csrfCookie && csrfHeader && csrfCookie === csrfHeader)
}

// ─── Middleware ──────────────────────────────────────────────────────────────

export default withAuth(
  function middleware(req: NextRequest) {
    const ip = getClientIp(req)
    const { pathname } = req.nextUrl
    const { method } = req
    const requestId = getRequestId(req.headers)
    const startedAt = Date.now()

    // ── 1. Rate limiting ──────────────────────────────────────────────────
    if (!checkRateLimit(ip)) return rateLimitedResponse(ip, pathname)

    // ── 2. CSRF protection para mutaciones en rutas admin ─────────────────
    // Los Server Actions de Next.js usan POST con header 'next-action' — se excluyen del CSRF
    // ya que Next.js gestiona su propia protección de origen para Server Actions
    const isServerAction = req.headers.get('next-action') !== null
    if (
      pathname.startsWith('/admin') &&
      !isSafeMethod(req.method) &&
      !isServerAction &&
      !isValidCsrf(req)
    ) {
      return csrfErrorResponse(ip, pathname)
    }

    // ── 3. Request logging ────────────────────────────────────────────────
    const ASSET_PREFIXES = ['/_next', '/favicon']
    const ASSET_EXTENSIONS = new Set([
      '.ico', '.png', '.jpg', '.jpeg', '.svg',
      '.webp', '.avif', '.woff', '.woff2', '.css', '.js',
    ])
    const lastDot = pathname.lastIndexOf('.')
    const ext = lastDot !== -1 ? pathname.slice(lastDot) : ''
    const isAsset =
      ASSET_PREFIXES.some((p) => pathname.startsWith(p)) ||
      ASSET_EXTENSIONS.has(ext)

    if (!isAsset) {
      logger.info('[middleware] request', {
        requestId,
        method,
        pathname,
        ip,
        duration: Date.now() - startedAt,
      })
    }

    const response = NextResponse.next()
    response.headers.set('x-request-id', requestId)
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rutas admin requieren rol ADMIN
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        return true
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico|monitoring).*)'],
}
