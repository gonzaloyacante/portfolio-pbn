'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ProjectSettingsFormData, projectSettingsSchema } from '@/lib/validations'

export async function getProjectSettings() {
  try {
    const settings = await prisma.projectSettings.findFirst()
    return settings
  } catch (error) {
    console.error('Error fetching project settings:', error)
    return null
  }
}

export async function updateProjectSettings(data: ProjectSettingsFormData) {
  try {
    const validatedData = projectSettingsSchema.parse(data)

    // Check if settings exist
    const existingSettings = await prisma.projectSettings.findFirst()

    if (existingSettings) {
      await prisma.projectSettings.update({
        where: { id: existingSettings.id },
        data: validatedData,
      })
    } else {
      await prisma.projectSettings.create({
        data: validatedData,
      })
    }

    revalidatePath('/')
    revalidatePath('/proyectos')
    revalidatePath('/admin/projects/settings')
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    console.error('Error updating project settings:', error)
    return { success: false, error: 'Failed to update project settings' }
  }
}
