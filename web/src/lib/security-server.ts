'use server'

import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'

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
