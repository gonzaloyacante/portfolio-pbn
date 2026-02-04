'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export interface TestimonialSettingsData {
  showOnAbout: boolean
  title: string | null
  maxDisplay: number
}

/**
 * Get testimonial display settings
 */
export async function getTestimonialSettings(): Promise<TestimonialSettingsData | null> {
  const settings = await prisma.testimonialSettings.findFirst()
  return settings
}

/**
 * Update testimonial display settings
 */
export async function updateTestimonialSettings(data: TestimonialSettingsData) {
  try {
    const existingSettings = await prisma.testimonialSettings.findFirst()

    if (existingSettings) {
      await prisma.testimonialSettings.update({
        where: { id: existingSettings.id },
        data: {
          showOnAbout: data.showOnAbout,
          title: data.title,
          maxDisplay: data.maxDisplay,
        },
      })
    } else {
      await prisma.testimonialSettings.create({
        data: {
          showOnAbout: data.showOnAbout,
          title: data.title,
          maxDisplay: data.maxDisplay,
        },
      })
    }

    revalidatePath('/')
    revalidatePath('/about')
    revalidatePath('/admin/testimonials')

    return { success: true }
  } catch (error) {
    console.error('Error updating testimonial settings:', error)
    return { success: false, error: 'Failed to update settings' }
  }
}
