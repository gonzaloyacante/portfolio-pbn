'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

import { categorySettingsSchema, type CategorySettingsFormData } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'

export async function getCategorySettings() {
  try {
    const settings = await prisma.categorySettings.findFirst()
    return settings
  } catch (error) {
    logger.error('Error fetching category settings:', { error: error })
    return null
  }
}

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

    const existing = await prisma.categorySettings.findFirst()

    if (existing) {
      await prisma.categorySettings.update({
        where: { id: existing.id },
        data: cleanData,
      })
    } else {
      // Manual mapping for strict Creation
      const createData: Prisma.CategorySettingsCreateInput = {
        showDescription: (cleanData.showDescription as boolean) ?? true,
        showProjectCount: (cleanData.showProjectCount as boolean) ?? true,
        gridColumns: (cleanData.gridColumns as number) ?? 4,
      }

      await prisma.categorySettings.create({
        data: createData,
      })
    }

    revalidatePath(ROUTES.public.projects)
    revalidatePath(ROUTES.admin.categories)
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating category settings:', { error })
    return { success: false, error: 'Failed' }
  }
}
