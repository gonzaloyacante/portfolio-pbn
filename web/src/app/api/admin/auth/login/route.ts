/**
 * POST /api/admin/auth/login
 * Autenticación para la app Flutter admin.
 * Genera access token (15 min JWT) + refresh token (30 días, opaco en BD).
 */

import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/db'
import { signAccessToken } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

// ── Schema de validación ──────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  device: z.enum(['android', 'ios']).optional(),
  pushToken: z.string().optional(),
})

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password, device, pushToken } = parsed.data
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? undefined
    const userAgent = req.headers.get('user-agent') ?? undefined

    // 1. Buscar usuario activo
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), isActive: true, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        avatarUrl: true,
        failedLoginCount: true,
        lockedUntil: true,
      },
    })

    if (!user) {
      // Evitar enumeración de usuarios: siempre el mismo tiempo de respuesta
      await bcrypt.compare(password, '$2b$12$invalidhashtopreventtimingattack')
      return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 })
    }

    // 2. Verificar bloqueo de cuenta
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { success: false, error: 'Cuenta bloqueada temporalmente. Inténtalo más tarde.' },
        { status: 403 }
      )
    }

    // 3. Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      // Incrementar contador de fallos (bloqueo tras 5 intentos)
      const newCount = user.failedLoginCount + 1
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: newCount,
          lockedUntil: newCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      })

      return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 })
    }

    // 4. Generar tokens
    const accessToken = await signAccessToken({ userId: user.id, role: user.role })

    const refreshToken = await prisma.refreshToken.create({
      data: {
        token: crypto.randomUUID(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        ipAddress,
        userAgent,
        device,
      },
    })

    // 5. Registrar push token FCM si viene en el body
    if (pushToken && device) {
      await prisma.pushToken.upsert({
        where: { token: pushToken },
        create: { userId: user.id, token: pushToken, platform: device },
        update: { userId: user.id, isActive: true, lastSeen: new Date() },
      })
    }

    // 6. Actualizar lastLoginAt y resetear contador de fallos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
        failedLoginCount: 0,
        lockedUntil: null,
      },
    })

    logger.info(`[admin-login] Usuario ${user.email} autenticado desde ${ipAddress}`)

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
        refreshToken: refreshToken.token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
    })
  } catch (err) {
    logger.error('[admin-login] Error', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
