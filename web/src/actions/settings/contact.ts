'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@/generated/prisma/client'
import { findSingleton, upsertSingleton, CONTACT_SETTINGS_DEFAULTS } from '@/lib/settings-service'

import { contactSettingsSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'

export interface ContactSettingsData {
  id: string
  pageTitle: string | null
  illustrationUrl: string | null
  illustrationAlt: string | null
  ownerName: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  location: string | null
  showSocialLinks: boolean
  showPhone: boolean
  showWhatsapp: boolean
  showEmail: boolean
  showLocation: boolean
  instagram: string | null
  instagramUsername: string | null
  showInstagram: boolean
  instagramPostUrl: string | null
  showInstagramEmbed: boolean
  isActive: boolean
}

/**
 * Get contact settings
 */
export const getContactSettings = unstable_cache(
  async (): Promise<ContactSettingsData | null> => {
    try {
      const settings = await findSingleton(prisma.contactSettings)
      return settings
    } catch (error) {
      logger.error('Error getting contact settings:', { error: error })
      return null
    }
  },
  [CACHE_TAGS.contactSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.contactSettings] }
)

/**
 * Update contact settings
 */
export async function updateContactSettings(data: Partial<Omit<ContactSettingsData, 'id'>>) {
  try {
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation
    const validated = validateAndSanitize(contactSettingsSchema.partial(), data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data strictly typed
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.ContactSettingsUpdateInput

    const settings = await upsertSingleton(
      prisma.contactSettings,
      CONTACT_SETTINGS_DEFAULTS,
      cleanData
    )

    // contact settings affect Navbar (ownerName) on ALL public pages via (public)/layout.tsx
    revalidatePath('/', 'layout')
    revalidateTag(CACHE_TAGS.contactSettings, 'max')

    return {
      success: true,
      settings,
      message: 'Configuración de contacto actualizada',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating contact settings:', { error })
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}
