/**
 * POST /api/admin/push/register
 * Registra o actualiza un token FCM para el usuario autenticado.
 * Se llama tras el login desde la app Flutter.
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { pushRegisterSchema } from '@/lib/validations'

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { userId } = auth.payload

  try {
    const body = await req.json().catch(() => null)
    const parsed = pushRegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { token, platform } = parsed.data

    // Upsert: crea o actualiza el token para este usuario/dispositivo.
    await prisma.pushToken.upsert({
      where: { token },
      create: {
        userId,
        token,
        platform,
        isActive: true,
        lastSeen: new Date(),
      },
      update: {
        userId,
        platform,
        isActive: true,
        lastSeen: new Date(),
      },
    })

    logger.info('[push-register] Token FCM registrado', {
      userId,
      platform,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('[push-register] Error al registrar token FCM', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
