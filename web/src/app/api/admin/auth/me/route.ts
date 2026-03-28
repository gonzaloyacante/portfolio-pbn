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
import { authMeUpdateSchema } from '@/lib/validations'

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
    const body = await req.json().catch(() => null)
    const parsed = authMeUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword, name } = parsed.data

    // ── Profile update (name) ─────────────────────────────────────────────
    if (name !== undefined && !currentPassword && !newPassword) {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { name: name.trim() },
        select: { id: true, name: true, email: true, role: true, avatarUrl: true },
      })

      logger.info('[admin-me] Profile updated', { userId })
      return NextResponse.json({ success: true, data: updated, message: 'Perfil actualizado' })
    }

    // ── Password change ───────────────────────────────────────────────────
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'currentPassword y newPassword son requeridos' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        {
          success: false,
          error: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
        },
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

    const isValid = await bcrypt.compare(currentPassword, user.password ?? '')
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña actual incorrecta' },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed, failedLoginCount: 0, lockedUntil: null },
    })

    // Revoke all refresh tokens — password change invalidates all sessions
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })

    logger.info('[admin-me] Password changed + all sessions revoked', { userId })
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
