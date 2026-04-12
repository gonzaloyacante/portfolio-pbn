'use server'

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

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
  try {
    const settings = await prisma.emailSettings.findFirst({
      where: { key: 'singleton' },
    })
    return settings
  } catch (error) {
    logger.error('getEmailSettings error:', { error })
    return null
  }
}
