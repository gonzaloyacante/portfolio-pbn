/**
 * POST /api/admin/auth/login
 * Autenticación para la app Flutter admin.
 * Genera access token (15 min JWT) + refresh token (30 días, opaco en BD).
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/db'
import { signAccessToken } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { verifyCredentials } from '@/lib/verify-credentials'
import { hashToken } from '@/lib/token-hash'
import { pruneRefreshTokens } from '@/lib/refresh-token'

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

    // 1-3. Rate limit, cuenta activa/bloqueada y contraseña — núcleo
    // compartido con el login web (A12/A13/A7, ver verify-credentials.ts)
    const result = await verifyCredentials(email, password, ipAddress ?? 'unknown')

    if (!result.ok) {
      if (result.reason === 'rate_limited') {
        logger.warn('[admin-login] Rate limit exceeded', { email, ipAddress })
        return NextResponse.json(
          {
            success: false,
            error: `Demasiados intentos. Espera ${result.lockoutMinutes} minutos.`,
          },
          { status: 429, headers: { 'Retry-After': String((result.lockoutMinutes ?? 15) * 60) } }
        )
      }

      // 'locked' o 'invalid' → misma respuesta, para no revelar el estado de
      // la cuenta (A13)
      return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 })
    }

    const { user } = result

    // 4. Generar tokens
    const accessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    })

    // 5-6. Crear refresh token, push token y actualizar usuario en una transacción atómica
    const rawRefreshToken = crypto.randomUUID()
    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.create({
        data: {
          // Guardamos el hash; el valor crudo solo se devuelve al cliente (A10)
          token: hashToken(rawRefreshToken),
          userId: user.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días (spec AGENTS.md)
          ipAddress,
          userAgent,
          device,
        },
      })

      if (pushToken && device) {
        await tx.pushToken.upsert({
          where: { token: pushToken },
          create: { userId: user.id, token: pushToken, platform: device },
          update: { userId: user.id, isActive: true, lastSeen: new Date() },
        })
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: ipAddress,
        },
      })
    })

    logger.info('[admin-login] Usuario autenticado', { userId: user.id, ipAddress })

    // Limpieza perezosa de refresh tokens viejos del usuario (M20)
    await pruneRefreshTokens(user.id)

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
        refreshToken: rawRefreshToken,
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
