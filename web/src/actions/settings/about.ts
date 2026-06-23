'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@/generated/prisma/client'
import { findSingleton, upsertSingleton } from '@/lib/settings-service'

import { ROUTES } from '@/config/routes'
import { aboutSettingsSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize, validateColor } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'

export interface AboutSettingsData {
  id: string
  illustrationUrl: string | null
  illustrationAlt: string | null
  illustrationMaxPx: number | null
  illustrationMobileMaxPx: number | null
  bioTitle: string | null
  bioTitleFont: string | null
  bioTitleFontUrl: string | null
  bioTitleFontSize: number | null
  bioTitleMobileFontSize: number | null
  bioTitleColor: string | null
  bioTitleColorDark: string | null
  bioIntro: string | null
  bioDescription: string | null
  profileImageUrl: string | null
  profileImageAlt: string | null
  profileImageShape: string | null
  profileImageShadowEnabled: boolean
  profileImageShadowBlur: number | null
  profileImageShadowSpread: number | null
  profileImageShadowOffsetX: number | null
  profileImageShadowOffsetY: number | null
  profileImageShadowColor: string | null
  profileImageShadowOpacity: number | null
  skills: string[]
  yearsExperience: number | null
  certifications: string[]
  isActive: boolean
}

/**
 * Get about page settings
 */
export const getAboutSettings = unstable_cache(
  async (): Promise<AboutSettingsData | null> => {
    try {
      const settings = await findSingleton(prisma.aboutSettings)
      return settings
    } catch (error) {
      logger.error('Error getting about settings:', { error: error })
      return null
    }
  },
  [CACHE_TAGS.aboutSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.aboutSettings] }
)

/**
 * Update about page settings
 */
export async function updateAboutSettings(data: Partial<Omit<AboutSettingsData, 'id'>>) {
  try {
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation
    const validated = validateAndSanitize(aboutSettingsSchema.partial(), data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data: Strictly Typed for Prisma
    // Fix: Unused variable '_' removed by using empty destructuring
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.AboutSettingsUpdateInput

    const shadowColor = cleanData.profileImageShadowColor as string | null | undefined
    if (shadowColor !== undefined && !validateColor(shadowColor)) {
      return {
        success: false,
        error: `Color de sombra inválido: ${shadowColor}. Usa HEX (#RRGGBB).`,
      }
    }

    const bioTitleColor = cleanData.bioTitleColor as string | null | undefined
    const bioTitleColorDark = cleanData.bioTitleColorDark as string | null | undefined
    if (bioTitleColor !== undefined && bioTitleColor !== null && !validateColor(bioTitleColor)) {
      return { success: false, error: `Color del título (claro) inválido: ${bioTitleColor}` }
    }
    if (
      bioTitleColorDark !== undefined &&
      bioTitleColorDark !== null &&
      !validateColor(bioTitleColorDark)
    ) {
      return { success: false, error: `Color del título (oscuro) inválido: ${bioTitleColorDark}` }
    }

    logger.debug('Updating about settings', { userId: user.id })

    const settings = await upsertSingleton(prisma.aboutSettings, {}, cleanData)

    // Revalidate Public Pages (both rewritten and canonical)
    revalidatePath(ROUTES.public.about) // /sobre-mi
    revalidatePath('/about') // Canonical Next.js route

    // Revalidate Admin Page
    revalidatePath(ROUTES.admin.about)
    revalidateTag(CACHE_TAGS.aboutSettings, 'max')

    return {
      success: true,
      settings,
      message: 'Configuración de "Sobre Mí" actualizada',
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Unauthorized') ||
        error.message.includes('Demasiadas') ||
        error.message.includes('Acceso denegado'))
    ) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating about settings:', { error })
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}
