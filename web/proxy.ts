import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger, getRequestId } from '@/lib/logger'

/**
 * Middleware con autenticación, rate limiting y request logging.
 *
 * Rate limiting: in-memory por IP (para escalar usar Upstash Redis)
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

// Cap del store para evitar crecimiento sin límite en instancias longevas
// (M14). setInterval no es fiable en entornos serverless/Edge (Vercel), así
// que la limpieza es perezosa: solo se dispara al alcanzar el cap.
const MAX_RATE_LIMIT_ENTRIES = 10_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (entry && entry.resetAt >= now) {
    // Límite alcanzado
    if (entry.count >= RATE_LIMIT_REQUESTS) return false

    entry.count++
    // Mover al final (más reciente) para que la eviction por cap no la elija (M15)
    rateLimitStore.delete(ip)
    rateLimitStore.set(ip, entry)
    return true
  }

  // Ventana expirada o primera vez: si llegamos al cap, limpiar entradas
  // vencidas y, si no alcanza, la menos recientemente usada (M14).
  if (rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES) {
    for (const [key, value] of rateLimitStore) {
      if (value.resetAt < now) rateLimitStore.delete(key)
    }
    if (rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES) {
      const lruKey = rateLimitStore.keys().next().value
      if (lruKey) rateLimitStore.delete(lruKey)
    }
  }

  rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
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

// ─── Middleware ──────────────────────────────────────────────────────────────

export default withAuth(
  function proxy(req: NextRequest) {
    const ip = getClientIp(req)
    const { pathname } = req.nextUrl
    const { method } = req
    const requestId = getRequestId(req.headers)
    const startedAt = Date.now()

    // ── 1. Rate limiting ──────────────────────────────────────────────────
    if (!checkRateLimit(ip)) return rateLimitedResponse(ip, pathname)

    // ── 2. Request logging ────────────────────────────────────────────────
    const isAsset =
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|avif|woff2?|css|js)$/) !== null

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
