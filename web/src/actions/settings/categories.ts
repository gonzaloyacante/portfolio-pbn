'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@/generated/prisma/client'
import { findSingleton, upsertSingleton } from '@/lib/settings-service'

import { categorySettingsSchema, type CategorySettingsFormData } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'

export const getCategorySettings = unstable_cache(
  async () => {
    try {
      const settings = await findSingleton(prisma.categorySettings)
      return settings
    } catch (error) {
      logger.error('Error fetching category settings:', { error: error })
      return null
    }
  },
  [CACHE_TAGS.categorySettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.categorySettings] }
)

export async function updateCategorySettings(data: CategorySettingsFormData) {
  try {
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation
    const validated = validateAndSanitize(categorySettingsSchema, data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data: Strictly Typed
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.CategorySettingsUpdateInput

    await upsertSingleton(prisma.categorySettings, {}, cleanData)

    revalidatePath(ROUTES.public.portfolio)
    revalidatePath(ROUTES.admin.categories)
    revalidateTag(CACHE_TAGS.categorySettings, 'max')
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating category settings:', { error })
    return { success: false, error: 'Failed' }
  }
}
