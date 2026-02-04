'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'

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
export async function getAboutSettings(): Promise<AboutSettingsData | null> {
  try {
    const settings = await prisma.aboutSettings.findFirst({
      where: { isActive: true },
    })
    return settings
  } catch (error) {
    console.error('Error getting about settings:', error)
    return null
  }
}

/**
 * Update about page settings
 */
export async function updateAboutSettings(data: Partial<Omit<AboutSettingsData, 'id'>>) {
  try {
    let settings = await prisma.aboutSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      settings = await prisma.aboutSettings.create({
        data: {
          illustrationUrl: data.illustrationUrl,
          illustrationAlt: data.illustrationAlt || 'Ilustración sobre mí',
          bioTitle: data.bioTitle || 'Hola, soy Paola.',
          bioIntro: data.bioIntro,
          bioDescription: data.bioDescription,
          profileImageUrl: data.profileImageUrl,
          profileImageAlt: data.profileImageAlt || 'Paola Bolívar Nievas',
          skills: data.skills || [],
          yearsExperience: data.yearsExperience,
          certifications: data.certifications || [],
          isActive: true,
        },
      })
    } else {
      settings = await prisma.aboutSettings.update({
        where: { id: settings.id },
        data,
      })
    }

    revalidatePath(ROUTES.public.about)

    return {
      success: true,
      settings,
      message: 'Configuración de "Sobre Mí" actualizada',
    }
  } catch (error) {
    console.error('Error updating about settings:', error)
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}
