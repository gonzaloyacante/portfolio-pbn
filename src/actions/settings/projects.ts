'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

import { ProjectSettingsFormData, projectSettingsSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'

export async function getProjectSettings() {
  try {
    const settings = await prisma.projectSettings.findFirst()
    return settings
  } catch (error) {
    logger.error('Error fetching project settings:', { error: error })
    return null
  }
}

export async function updateProjectSettings(data: ProjectSettingsFormData) {
  try {
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation
    const validated = validateAndSanitize(projectSettingsSchema, data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data strictly typed
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.ProjectSettingsUpdateInput

    // Check if settings exist
    const existingSettings = await prisma.projectSettings.findFirst()

    if (existingSettings) {
      await prisma.projectSettings.update({
        where: { id: existingSettings.id },
        data: cleanData,
      })
    } else {
      // Manual mapping for strict Creation
      const createData: Prisma.ProjectSettingsCreateInput = {
        showCardTitles: (cleanData.showCardTitles as boolean) ?? true,
        showCardCategory: (cleanData.showCardCategory as boolean) ?? true,
        gridColumns: (cleanData.gridColumns as number) ?? 3,
      }

      await prisma.projectSettings.create({
        data: createData,
      })
    }

    revalidatePath('/')
    revalidatePath(ROUTES.public.projects)
    revalidatePath(ROUTES.admin.projects)
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating project settings:', { error })
    return { success: false, error: 'Failed to update project settings' }
  }
}
