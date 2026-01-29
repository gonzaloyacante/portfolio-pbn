/**
 * Rate limiting para autenticación sin dependencias externas
 * Protección contra ataques de fuerza bruta
 */

import { prisma } from '@/lib/db'

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION_MINUTES = 15

interface LoginAttempt {
  email: string
  ipAddress: string
  timestamp: Date
}

// Almacenamiento en memoria (para producción usar Redis)
const loginAttempts = new Map<string, LoginAttempt[]>()

/**
 * Verificar si un email/IP está bloqueado
 */
export async function checkAuthRateLimit(
  email: string,
  ipAddress: string
): Promise<{
  allowed: boolean
  remainingAttempts?: number
  lockoutMinutes?: number
}> {
  const key = `${email}:${ipAddress}`
  const now = new Date()
  const lockoutTime = new Date(now.getTime() - LOCKOUT_DURATION_MINUTES * 60 * 1000)

  // Obtener intentos recientes
  let attempts = loginAttempts.get(key) || []

  // Filtrar intentos antiguos
  attempts = attempts.filter((attempt) => attempt.timestamp > lockoutTime)
  loginAttempts.set(key, attempts)

  // Verificar si está bloqueado
  if (attempts.length >= MAX_LOGIN_ATTEMPTS) {
    const oldestAttempt = attempts[0]
    const minutesRemaining = Math.ceil(
      (oldestAttempt.timestamp.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000 - now.getTime()) /
        60000
    )

    return {
      allowed: false,
      lockoutMinutes: minutesRemaining > 0 ? minutesRemaining : 1,
    }
  }

  return {
    allowed: true,
    remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.length,
  }
}

/**
 * Registrar un intento de login fallido
 */
export async function recordFailedLoginAttempt(email: string, ipAddress: string): Promise<void> {
  const key = `${email}:${ipAddress}`
  const attempts = loginAttempts.get(key) || []

  attempts.push({
    email,
    ipAddress,
    timestamp: new Date(),
  })

  loginAttempts.set(key, attempts)

  // También registrar en BD para analítica
  try {
    await prisma.analyticLog.create({
      data: {
        eventType: 'FAILED_LOGIN_ATTEMPT',
        ipAddress,
        entityType: 'user',
        entityId: email,
      },
    })
  } catch (error) {
    console.error('Error al registrar intento fallido:', error)
  }
}

/**
 * Limpiar intentos después de login exitoso
 */
export async function clearLoginAttempts(email: string, ipAddress: string): Promise<void> {
  const key = `${email}:${ipAddress}`
  loginAttempts.delete(key)
}

/**
 * Limpiar intentos antiguos periódicamente (ejecutar en cron)
 */
export function cleanupOldAttempts(): void {
  const now = new Date()
  const lockoutTime = new Date(now.getTime() - LOCKOUT_DURATION_MINUTES * 60 * 1000)

  for (const [key, attempts] of loginAttempts.entries()) {
    const recentAttempts = attempts.filter((attempt) => attempt.timestamp > lockoutTime)

    if (recentAttempts.length === 0) {
      loginAttempts.delete(key)
    } else {
      loginAttempts.set(key, recentAttempts)
    }
  }
}

// Limpiar cada 5 minutos
if (typeof window === 'undefined') {
  // Solo en servidor
  setInterval(cleanupOldAttempts, 5 * 60 * 1000)
}
