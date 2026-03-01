/**
 * GET  /api/admin/auth/me — Retorna el perfil del usuario autenticado.
 * PATCH /api/admin/auth/me — Cambia la contraseña del usuario autenticado.
 * Requiere access token válido en Authorization: Bearer <token>
 */

import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { userId } = auth.payload

    const user = await prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        locale: true,
        timezone: true,
        notifications: true,
        lastLoginAt: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (err) {
    logger.error('[admin-me] Error', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ── PATCH /api/admin/auth/me — Cambio de contraseña ──────────────────────────

export async function PATCH(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { userId } = auth.payload
    const body = (await req.json()) as {
      currentPassword?: string
      newPassword?: string
    }

    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { success: false, error: 'currentPassword y newPassword son requeridos' },
        { status: 400 }
      )
    }

    if (body.newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null },
      select: { password: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(body.currentPassword, user.password ?? '')
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña actual incorrecta' },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(body.newPassword, 12)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })

    logger.info('[admin-me] Password changed', { userId })
    return NextResponse.json({ success: true, message: 'Contraseña actualizada' })
  } catch (err) {
    logger.error('[admin-me PATCH] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
