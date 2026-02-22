/**
 * POST /api/admin/auth/logout
 * Revoca el refresh token del dispositivo actual.
 * Requiere access token válido en el header Authorization.
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

// ── Schema ────────────────────────────────────────────────────────────────────

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
  /** Si true, revoca todos los dispositivos del usuario */
  everywhere: z.boolean().optional().default(false),
})

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // Verificar JWT del access token
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const body = await req.json().catch(() => null)
    const parsed = logoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Datos inválidos' }, { status: 400 })
    }

    const { refreshToken, everywhere } = parsed.data
    const { userId } = auth.payload

    if (everywhere) {
      // Revocar todos los refresh tokens del usuario
      await prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      // Desactivar todos los push tokens del usuario
      await prisma.pushToken.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      })

      logger.info(`[admin-logout] Usuario ${userId} cerró sesión en todos los dispositivos`)
    } else {
      // Revocar solo el refresh token de este dispositivo
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      logger.info(`[admin-logout] Usuario ${userId} cerró sesión en un dispositivo`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('[admin-logout] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
