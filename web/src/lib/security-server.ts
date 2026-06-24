'use server'

import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'

/**
 * Secure Action Wrapper: Require Admin Authentication
 * Throws error if not authenticated or not admin
 */
export async function requireAdmin() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    logger.warn('Unauthorized access attempt to admin action', {
      userId: session?.user?.id,
    })
    throw new Error('Unauthorized: Admin access required')
  }

  return session.user
}

/**
 * Secure Action Wrapper for Settings: Require Admin + check rate limit.
 * Combines requireAdmin and checkSettingsRateLimit into a single guard
 * for Server Actions that mutate HomeSettings/ThemeSettings/etc.
 * Returns the authenticated admin user on success.
 * Throws on auth failure, rate limit, or invalid user id.
 */
export async function guardSettingsAction() {
  const user = await requireAdmin()
  if (user?.id) {
    await checkSettingsRateLimit(user.id as string)
  }
  return user
}
