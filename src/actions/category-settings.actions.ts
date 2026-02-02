'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { categorySettingsSchema, type CategorySettingsFormData } from '@/lib/validations'

export async function getCategorySettings() {
  try {
    const settings = await prisma.categorySettings.findFirst()
    return settings
  } catch (error) {
    console.error('Error fetching category settings:', error)
    return null
  }
}

export async function updateCategorySettings(data: CategorySettingsFormData) {
  try {
    const validatedData = categorySettingsSchema.parse(data)
    const existing = await prisma.categorySettings.findFirst()

    if (existing) {
      await prisma.categorySettings.update({
        where: { id: existing.id },
        data: validatedData,
      })
    } else {
      await prisma.categorySettings.create({
        data: validatedData,
      })
    }

    revalidatePath('/proyectos')
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('Error updating category settings:', error)
    return { success: false, error: 'Failed' }
  }
}
