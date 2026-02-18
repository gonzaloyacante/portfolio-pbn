'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@prisma/client'

import { testimonialSettingsSchema, type TestimonialSettingsFormData } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'

export interface TestimonialSettingsData {
  showOnAbout: boolean
  title: string | null
  maxDisplay: number
}

/**
 * Get testimonial display settings
 */
export const getTestimonialSettings = unstable_cache(
  async (): Promise<TestimonialSettingsData | null> => {
    const settings = await prisma.testimonialSettings.findFirst()
    return settings
  },
  [CACHE_TAGS.testimonialSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.testimonialSettings] }
)

/**
 * Update testimonial display settings
 */
export async function updateTestimonialSettings(data: TestimonialSettingsFormData) {
  try {
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation
    const validated = validateAndSanitize(testimonialSettingsSchema, data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data strictly typed
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.TestimonialSettingsUpdateInput

    const existingSettings = await prisma.testimonialSettings.findFirst()

    if (existingSettings) {
      await prisma.testimonialSettings.update({
        where: { id: existingSettings.id },
        data: cleanData,
      })
    } else {
      // Manual mapping for strict Creation
      const createData: Prisma.TestimonialSettingsCreateInput = {
        showOnAbout: (cleanData.showOnAbout as boolean) ?? true,
        title: (cleanData.title as string) ?? undefined,
        maxDisplay: (cleanData.maxDisplay as number) ?? 3,
      }

      await prisma.testimonialSettings.create({
        data: createData,
      })
    }

    revalidatePath('/')
    revalidatePath('/about')
    revalidatePath('/admin/testimonials')
    revalidateTag(CACHE_TAGS.testimonialSettings, 'max')

    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating testimonial settings:', { error })
    return { success: false, error: 'Failed to update settings' }
  }
}
