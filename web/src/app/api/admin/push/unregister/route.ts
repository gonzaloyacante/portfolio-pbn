/**
 * POST /api/admin/push/unregister
 * Desactiva un token FCM (al cerrar sesión o al desinstalar la app).
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { userId } = auth.payload

  try {
    const body = (await req.json()) as { token?: string }
    const { token } = body

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Token FCM requerido' },
        { status: 400 }
      )
    }

    // Solo desactiva — no borra para mantener historial.
    const updated = await prisma.pushToken.updateMany({
      where: { token, userId },
      data: { isActive: false },
    })

    if (updated.count === 0) {
      // Token no encontrado para este usuario — igualmente devuelve OK.
      return NextResponse.json({ success: true })
    }

    logger.info('[push-unregister] Token FCM desactivado', { userId })

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('[push-unregister] Error al desactivar token FCM', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
