'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'

export interface HomeSettingsData {
  id: string
  // Título 1
  heroTitle1Text: string | null
  heroTitle1Font: string | null
  heroTitle1FontUrl: string | null
  heroTitle1FontSize: number | null
  heroTitle1Color: string | null

  heroTitle1ColorDark: string | null
  heroTitle1ZIndex: number | null
  heroTitle1OffsetX: number | null
  heroTitle1OffsetY: number | null
  // Título 2
  heroTitle2Text: string | null
  heroTitle2Font: string | null
  heroTitle2FontUrl: string | null
  heroTitle2FontSize: number | null
  heroTitle2Color: string | null

  heroTitle2ColorDark: string | null
  heroTitle2ZIndex: number | null
  heroTitle2OffsetX: number | null
  heroTitle2OffsetY: number | null
  // Nombre propietario
  ownerNameText: string | null
  ownerNameFont: string | null
  ownerNameFontUrl: string | null
  ownerNameFontSize: number | null
  ownerNameColor: string | null

  ownerNameColorDark: string | null
  ownerNameZIndex: number | null
  ownerNameOffsetX: number | null
  ownerNameOffsetY: number | null
  // Imágenes
  heroMainImageUrl: string | null
  heroMainImageAlt: string | null
  heroMainImageCaption: string | null

  heroImageStyle: string | null
  heroMainImageZIndex: number | null
  heroMainImageOffsetX: number | null
  heroMainImageOffsetY: number | null

  illustrationUrl: string | null
  illustrationAlt: string | null
  illustrationZIndex: number | null
  illustrationOpacity: number | null
  illustrationSize: number | null
  illustrationOffsetX: number | null
  illustrationOffsetY: number | null
  illustrationRotation: number | null
  // Botón CTA
  ctaText: string | null
  ctaLink: string | null
  ctaFont: string | null
  ctaFontUrl: string | null
  ctaFontSize: number | null
  ctaVariant: string | null
  ctaSize: string | null
  ctaOffsetX: number | null
  ctaOffsetY: number | null
  // Sección destacados
  showFeaturedProjects: boolean
  featuredTitle: string | null
  featuredTitleFont: string | null
  featuredTitleFontUrl: string | null
  featuredTitleFontSize: number | null
  featuredTitleColor: string | null
  featuredTitleColorDark: string | null
  featuredCount: number
  isActive: boolean
}

/**
 * Get home page settings
 */
export async function getHomeSettings(): Promise<HomeSettingsData | null> {
  try {
    const settings = await prisma.homeSettings.findFirst({
      where: { isActive: true },
    })
    return settings
  } catch (error) {
    console.error('Error getting home settings:', error)
    return null
  }
}

/**
 * Update home page settings
 */
export async function updateHomeSettings(data: Partial<Omit<HomeSettingsData, 'id'>>) {
  try {
    let settings = await prisma.homeSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      settings = await prisma.homeSettings.create({
        data: {
          // Título 1
          heroTitle1Text: data.heroTitle1Text || 'Make-up',
          heroTitle1FontSize: data.heroTitle1FontSize, // Removed default 112
          // Título 2
          heroTitle2Text: data.heroTitle2Text || 'Portfolio',
          heroTitle2FontSize: data.heroTitle2FontSize, // Removed default 96
          // Nombre
          ownerNameText: data.ownerNameText || 'Paola Bolívar Nievas',

          ownerNameFontSize: data.ownerNameFontSize, // Removed default 36
          // Z-Indices & Offsets
          heroTitle1ZIndex: data.heroTitle1ZIndex || 20,
          heroTitle1OffsetX: data.heroTitle1OffsetX || 0,
          heroTitle1OffsetY: data.heroTitle1OffsetY || 0,

          heroTitle2ZIndex: data.heroTitle2ZIndex || 10,
          heroTitle2OffsetX: data.heroTitle2OffsetX || 0,
          heroTitle2OffsetY: data.heroTitle2OffsetY || 0,

          ownerNameZIndex: data.ownerNameZIndex || 15,
          ownerNameOffsetX: data.ownerNameOffsetX || 0,
          ownerNameOffsetY: data.ownerNameOffsetY || 0,

          heroMainImageZIndex: data.heroMainImageZIndex || 5,
          heroMainImageOffsetX: data.heroMainImageOffsetX || 0,
          heroMainImageOffsetY: data.heroMainImageOffsetY || 0,

          illustrationZIndex: data.illustrationZIndex || 10,
          illustrationOffsetX: data.illustrationOffsetX || 0,
          illustrationOffsetY: data.illustrationOffsetY || 0,
          illustrationRotation: data.illustrationRotation || 0,

          // Imágenes
          illustrationUrl: data.illustrationUrl,
          illustrationAlt: data.illustrationAlt || 'Ilustración maquilladora',
          illustrationOpacity: data.illustrationOpacity ?? 100, // Use ?? to allow 0
          illustrationSize: data.illustrationSize || 100,
          heroMainImageUrl: data.heroMainImageUrl,
          heroMainImageAlt: data.heroMainImageAlt || 'Trabajo destacado',
          heroMainImageCaption: data.heroMainImageCaption,
          heroImageStyle: data.heroImageStyle || 'original',
          // Botón
          ctaText: data.ctaText || 'Ver Portfolio',
          ctaLink: data.ctaLink || ROUTES.public.projects,
          ctaFontSize: data.ctaFontSize, // Removed default 16
          ctaVariant: data.ctaVariant || 'default',
          ctaSize: data.ctaSize || 'default',
          ctaOffsetX: data.ctaOffsetX || 0,
          ctaOffsetY: data.ctaOffsetY || 0,
          // Destacados
          showFeaturedProjects: data.showFeaturedProjects ?? true,
          featuredTitle: data.featuredTitle || 'Proyectos Destacados',
          featuredTitleFontSize: data.featuredTitleFontSize, // Removed default
          featuredCount: data.featuredCount || 6,
          isActive: true,
        },
      })
    } else {
      // Extract only updatable fields, excluding id and isActive
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, isActive, ...updateData } = data as HomeSettingsData
      settings = await prisma.homeSettings.update({
        where: { id: settings.id },
        data: updateData,
      })
    }

    revalidatePath(ROUTES.home)

    return {
      success: true,
      settings,
      message: 'Configuración de inicio actualizada',
    }
  } catch (error) {
    console.error('Error updating home settings:', error)
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}
