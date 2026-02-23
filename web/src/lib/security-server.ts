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
 * Combined Security Guard for Settings Actions
 * 1. Admin Auth
 * 2. Rate Limiting based on User ID
 */
export async function guardSettingsAction() {
  const user = await requireAdmin()
  if (user.id) {
    await checkSettingsRateLimit(user.id)
  }
  return user
}
