import { createRateLimiter } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit-config'
import { logger } from '@/lib/logger'
import { headers } from 'next/headers'

// Initialize limiters
const apiLimiter = createRateLimiter(RATE_LIMITS.API)
// Creating a specific limiter for settings updates to prevent spam
const settingsLimiter = createRateLimiter({
  id: 'settings_update',
  limit: 20, // 20 updates per 10 minutes per admin seems reasonable but safe
  window: 10 * 60 * 1000,
  errorMessage: 'Demasiadas actualizaciones de configuración. Espera unos minutos.',
})

/**
 * Get client IP from headers
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return 'unknown-ip'
}

/**
 * Guard: Check Rate Limit for Settings Updates
 * Throws error if limit exceeded
 */
export async function checkSettingsRateLimit(userId: string) {
  const result = await settingsLimiter.check(userId)

  if (!result.allowed) {
    logger.warn(`Rate limit exceeded for settings update. User: ${userId}`)
    throw new Error(`Demasiadas actualizaciones de configuración. Reset en ${result.resetIn}s`)
  }

  // Async record (fire and forget to not block)
  settingsLimiter
    .record(userId)
    .catch((err) => logger.error('Error recording rate limit', { error: err }))
}

/**
 * Guard: Check Rate Limit for General API / Uploads
 * Throws error if limit exceeded
 */
export async function checkApiRateLimit(ip?: string) {
  const clientIp = ip || (await getClientIp())
  const result = await apiLimiter.check(clientIp)

  if (!result.allowed) {
    logger.warn(`Rate limit exceeded for API. IP: ${clientIp}`)
    throw new Error(`Demasiadas solicitudes. Reset en ${result.resetIn}s`)
  }

  apiLimiter
    .record(clientIp)
    .catch((err) => logger.error('Error recording API rate limit', { error: err }))
}
