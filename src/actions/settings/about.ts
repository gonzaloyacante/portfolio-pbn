'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@/generated/prisma/client'

import { ROUTES } from '@/config/routes'
import { aboutSettingsSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'

export interface AboutSettingsData {
  id: string
  illustrationUrl: string | null
  illustrationAlt: string | null
  bioTitle: string | null
  bioIntro: string | null
  bioDescription: string | null
  profileImageUrl: string | null
  profileImageAlt: string | null
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
      const settings = await prisma.aboutSettings.findFirst({
        where: { isActive: true },
      })
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

    logger.debug('Updating about settings', { userId: user.id })

    let settings = await prisma.aboutSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      // Manual mapping for strict Type Safety during Creation
      const createData: Prisma.AboutSettingsCreateInput = {
        illustrationUrl: (cleanData.illustrationUrl as string) ?? undefined,
        illustrationAlt: (cleanData.illustrationAlt as string) || 'Ilustración sobre mí',
        bioTitle: (cleanData.bioTitle as string) || 'Hola, soy Paola.',
        bioIntro: (cleanData.bioIntro as string) ?? undefined,
        bioDescription: (cleanData.bioDescription as string) ?? undefined,
        profileImageUrl: (cleanData.profileImageUrl as string) ?? undefined,
        profileImageAlt: (cleanData.profileImageAlt as string) || 'Paola Bolívar Nievas',
        skills: (cleanData.skills as string[]) || [],
        yearsExperience: (cleanData.yearsExperience as number) ?? undefined,
        certifications: (cleanData.certifications as string[]) || [],
        isActive: true,
      }

      settings = await prisma.aboutSettings.create({
        data: createData,
      })
    } else {
      // cleanData is already strictly typed as UpdateInput
      settings = await prisma.aboutSettings.update({
        where: { id: settings.id },
        data: cleanData,
      })
    }

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
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating about settings:', { error })
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}
