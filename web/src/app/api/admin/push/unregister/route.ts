/**
 * POST /api/admin/push/unregister
 * Desactiva un token FCM (al cerrar sesión o al desinstalar la app).
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { pushUnregisterSchema } from '@/lib/validations'

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { userId } = auth.payload

  try {
    const body = await req.json().catch(() => null)
    const parsed = pushUnregisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { token } = parsed.data

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
