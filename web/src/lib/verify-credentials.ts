/**
 * Núcleo de autenticación por email+password, compartido entre el login web
 * (NextAuth, `src/lib/auth.ts`) y el login de la app móvil
 * (`/api/admin/auth/login`).
 *
 * ARQ2: antes cada pipeline reimplementaba por separado el rate limiting,
 * la comparación de password con mitigación de timing (A12), y el
 * incremento/reseteo de `failedLoginCount`/`lockedUntil` (A7). Esa
 * duplicación ya había divergido una vez (A7: web no bloqueaba cuenta,
 * móvil sí) — centralizarlo acá evita que vuelva a pasar.
 */

import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/db'
import {
  checkAuthRateLimit,
  recordFailedLoginAttempt,
  clearLoginAttempts,
} from '@/lib/auth-rate-limit'

const LOCKOUT_THRESHOLD = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000

// Hash bcrypt calculado en runtime (una sola vez, perezoso) para comparar
// cuando no corresponde verificar contra el hash real (usuario inexistente,
// inactivo o bloqueado). Mismo costo (12) que un hash real → bcrypt.compare
// tarda lo mismo, evitando enumeración por timing (A12).
let _dummyPasswordHash: string | null = null
function getDummyPasswordHash(): string {
  if (!_dummyPasswordHash) {
    _dummyPasswordHash = bcrypt.hashSync('dummy-password-for-timing-equalization', 12)
  }
  return _dummyPasswordHash
}

export interface VerifiedUser {
  id: string
  email: string
  name: string | null
  role: string
  avatarUrl: string | null
}

export type VerifyCredentialsResult =
  | { ok: true; user: VerifiedUser }
  | { ok: false; reason: 'rate_limited'; lockoutMinutes?: number }
  | { ok: false; reason: 'locked' }
  | { ok: false; reason: 'invalid' }

export async function verifyCredentials(
  email: string,
  password: string,
  ipAddress: string
): Promise<VerifyCredentialsResult> {
  const normalizedEmail = email.toLowerCase()

  const rateCheck = await checkAuthRateLimit(normalizedEmail, ipAddress)
  if (!rateCheck.allowed) {
    return { ok: false, reason: 'rate_limited', lockoutMinutes: rateCheck.lockoutMinutes }
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      avatarUrl: true,
      failedLoginCount: true,
      lockedUntil: true,
      isActive: true,
      deletedAt: true,
    },
  })

  if (!user || !user.isActive || user.deletedAt !== null) {
    // Comparación dummy para igualar el tiempo de respuesta y evitar
    // enumeración de usuarios por timing (A12)
    await bcrypt.compare(password, getDummyPasswordHash())
    if (!user) {
      await recordFailedLoginAttempt(normalizedEmail, ipAddress)
    }
    return { ok: false, reason: 'invalid' }
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    await bcrypt.compare(password, getDummyPasswordHash())
    return { ok: false, reason: 'locked' }
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    await recordFailedLoginAttempt(normalizedEmail, ipAddress)

    // Bloqueo tras 5 intentos fallidos (A7)
    const newFailedCount = user.failedLoginCount + 1
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: newFailedCount,
        lockedUntil:
          newFailedCount >= LOCKOUT_THRESHOLD ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
      },
    })

    return { ok: false, reason: 'invalid' }
  }

  // Login exitoso: limpiar intentos fallidos y resetear bloqueo (A7)
  await clearLoginAttempts(normalizedEmail, ipAddress)
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null },
  })

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  }
}
