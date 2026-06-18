'use server'

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { requireAdmin } from '@/lib/security-server'
import { findSingleton } from '@/lib/settings-service'

export interface EmailSettingsData {
  id: string
  sendContactNotifications: boolean
  sendBookingNotifications: boolean
  sendTestimonialNotifications: boolean
  notificationEmails: string[]
  isActive: boolean
}

/**
 * Returns the singleton EmailSettings row, or null if not yet created.
 */
export async function getEmailSettings(): Promise<EmailSettingsData | null> {
  await requireAdmin()
  try {
    const settings = await findSingleton(prisma.emailSettings)
    return settings
  } catch (error) {
    logger.error('getEmailSettings error:', { error })
    return null
  }
}
