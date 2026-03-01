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

// ── Schema ────────────────────────────────────────────────────────────────────

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
})

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
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

    // 2. Verificar que no esté revocado ni expirado
    if (existing.revokedAt || existing.expiresAt < new Date()) {
      // Posible reutilización de token — revocar TODA la cadena (seguridad)
      if (existing.revokedAt) {
        logger.warn(
          `[admin-refresh] Reutilización de refresh token revocado para userId=${existing.userId}`
        )
        await prisma.refreshToken.updateMany({
          where: { userId: existing.userId, revokedAt: null },
          data: { revokedAt: new Date() },
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: existing.revokedAt ? 'Token revocado' : 'Token expirado',
          code: existing.revokedAt ? 'TOKEN_REVOKED' : 'TOKEN_EXPIRED',
        },
        { status: 401 }
      )
    }

    // 3. Verificar que el usuario sigue activo
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

    // 4. Crear nuevo refresh token (rotación)
    const newRefreshToken = await prisma.refreshToken.create({
      data: {
        token: crypto.randomUUID(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 días para la app
        ipAddress,
        userAgent,
        device: existing.device,
      },
    })

    // 5. Revocar el token antiguo (apunta al nuevo)
    await prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date(), replacedBy: newRefreshToken.id },
    })

    // 6. Generar nuevo access token
    const accessToken = await signAccessToken({ userId: user.id, role: user.role })

    // 7. Actualizar lastUsedAt del nuevo token
    await prisma.refreshToken.update({
      where: { id: newRefreshToken.id },
      data: { lastUsedAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken.token,
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
