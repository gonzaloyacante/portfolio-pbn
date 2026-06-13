/**
 * POST /api/admin/auth/refresh
 * Rota el refresh token y genera un nuevo access token.
 * El refresh token antiguo queda revocado (replacedBy = nuevo token ID).
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/db'
import { signAccessToken } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { createRateLimiter } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit-config'

// ── Schema ────────────────────────────────────────────────────────────────────

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
})

// ── Rate limiter para refresh (10 req/min por IP) ─────────────────────────────
const refreshLimiter = createRateLimiter({
  ...RATE_LIMITS.API,
  id: 'auth_refresh',
  limit: 10,
  errorMessage: 'Demasiadas solicitudes de refresh. Intenta de nuevo más tarde.',
})

// Ventana de gracia: si dos refresh concurrentes usan el mismo token, el que
// "pierde" la rotación recibe el token ganador en vez de disparar la
// detección de reuso (que revocaría toda la cadena).
const GRACE_PERIOD_MS = 60_000

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Token ya revocado (al leerlo, o porque perdimos la carrera de rotación).
 * Si la revocación es reciente y tiene reemplazo válido, devuelve ESE
 * reemplazo (grace period). Si no, asume reuso real y revoca toda la cadena.
 */
async function reissueOrRevokeChain(existing: { id: string; userId: string }) {
  const current = await prisma.refreshToken.findUnique({ where: { id: existing.id } })

  if (current?.revokedAt && current.replacedBy) {
    const withinGrace = Date.now() - current.revokedAt.getTime() < GRACE_PERIOD_MS
    if (withinGrace) {
      const replacement = await prisma.refreshToken.findUnique({
        where: { id: current.replacedBy },
      })
      if (replacement && !replacement.revokedAt && replacement.expiresAt > new Date()) {
        const user = await prisma.user.findFirst({
          where: { id: existing.userId, isActive: true, deletedAt: null },
          select: { id: true, role: true, email: true },
        })
        if (user) {
          const accessToken = await signAccessToken({
            userId: user.id,
            role: user.role,
            email: user.email,
          })
          return NextResponse.json({
            success: true,
            data: { accessToken, refreshToken: replacement.token },
          })
        }
      }
    }
  }

  // Reuso real de un token revocado (fuera de la ventana de gracia, o sin
  // reemplazo válido) — posible robo de token, revocar toda la cadena.
  logger.warn(
    `[admin-refresh] Reutilización de refresh token revocado para userId=${existing.userId}`
  )
  await prisma.refreshToken.updateMany({
    where: { userId: existing.userId, revokedAt: null },
    data: { revokedAt: new Date() },
  })

  return NextResponse.json(
    { success: false, error: 'Token revocado', code: 'TOKEN_REVOKED' },
    { status: 401 }
  )
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    // Rate limiting por IP
    const forwardedFor = req.headers.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown-ip'
    const rateResult = await refreshLimiter.check(clientIp)
    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateResult.resetIn
            ? `Demasiadas solicitudes. Reset en ${rateResult.resetIn}s`
            : 'Demasiadas solicitudes',
        },
        { status: 429, headers: { 'Retry-After': String(rateResult.resetIn ?? 60) } }
      )
    }
    refreshLimiter.record(clientIp).catch(() => {})

    const body = await req.json().catch(() => null)
    const parsed = refreshSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Datos inválidos' }, { status: 400 })
    }

    const { refreshToken } = parsed.data
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? undefined
    const userAgent = req.headers.get('user-agent') ?? undefined

    // 1. Buscar el refresh token en BD
    const existing = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Refresh token inválido', code: 'TOKEN_INVALID' },
        { status: 401 }
      )
    }

    // 2. Verificar expiración (hard fail, sin grace period: un token vencido
    // hace tiempo no es señal de carrera, es simplemente viejo)
    if (existing.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Token expirado', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      )
    }

    // 3. Si ya estaba revocado al leerlo, otra request ya lo rotó antes
    // (carrera ganada por otra petición concurrente, o reuso real).
    if (existing.revokedAt) {
      return reissueOrRevokeChain(existing)
    }

    // 4. Verificar que el usuario sigue activo
    const user = await prisma.user.findFirst({
      where: { id: existing.userId, isActive: true, deletedAt: null },
      select: { id: true, role: true, email: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado o inactivo' },
        { status: 401 }
      )
    }

    // 5. Rotación atómica: el UPDATE solo afecta la fila si revokedAt sigue
    // siendo null en ese momento (lock optimista). Si otra request concurrente
    // ya rotó este mismo token entre nuestro SELECT y este UPDATE, count === 0
    // y "perdimos" la carrera → grace period / reuso real (paso 6).
    const newTokenValue = crypto.randomUUID()
    const now = new Date()

    const result = await prisma.$transaction(async (tx) => {
      const rotated = await tx.refreshToken.updateMany({
        where: { id: existing.id, revokedAt: null },
        data: { revokedAt: now },
      })

      if (rotated.count === 0) {
        return { won: false as const }
      }

      const created = await tx.refreshToken.create({
        data: {
          token: newTokenValue,
          userId: user.id,
          expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 días
          ipAddress,
          userAgent,
          device: existing.device,
          lastUsedAt: now,
        },
      })

      await tx.refreshToken.update({
        where: { id: existing.id },
        data: { replacedBy: created.id },
      })

      return { won: true as const, created }
    })

    // 6. Perdimos la carrera de rotación → grace period / reuso real.
    if (!result.won) {
      return reissueOrRevokeChain(existing)
    }

    // 7. Generar nuevo access token y devolver el nuevo par de tokens.
    const accessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    })

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
        refreshToken: result.created.token,
      },
    })
  } catch (err) {
    logger.error('[admin-refresh] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
