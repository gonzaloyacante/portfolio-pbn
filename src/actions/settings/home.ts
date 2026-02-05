'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

import { ROUTES } from '@/config/routes'
import { logger } from '@/lib/logger'
import { homeSettingsSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize, validateFontUrl, validateColor } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'

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
    // 1. 🔒 Security: Require Admin
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation & Sanitization
    const validated = validateAndSanitize(homeSettingsSchema.partial(), data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data: Remove undefined values strictly
    const cleanEntries = Object.entries(validated.data || {}).filter(([_, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.HomeSettingsUpdateInput

    // 3. 🎨 Specific Validations (Colors & Fonts)
    // Safe access because cleanData is Partial<HomeSettingsUpdateInput> which matches our interface mostly,
    // but types are strict string | StringFieldUpdateOperationsInput | undefined.
    // We cast to string for validation helpers which expect string | null | undefined.
    const fontUrls = [
      cleanData.heroTitle1FontUrl as string | undefined,
      cleanData.heroTitle2FontUrl as string | undefined,
      cleanData.ownerNameFontUrl as string | undefined,
      cleanData.ctaFontUrl as string | undefined,
    ]
    for (const url of fontUrls) {
      if (!validateFontUrl(url)) {
        return {
          success: false,
          error: `URL de fuente inválida: ${url}. Solo se permiten fuentes de Google Fonts oficiales.`,
        }
      }
    }

    const colors = [
      cleanData.heroTitle1Color as string | undefined,
      cleanData.heroTitle1ColorDark as string | undefined,
      cleanData.heroTitle2Color as string | undefined,
      cleanData.heroTitle2ColorDark as string | undefined,
      cleanData.ownerNameColor as string | undefined,
      cleanData.ownerNameColorDark as string | undefined,
    ]
    for (const color of colors) {
      if (!validateColor(color)) {
        return {
          success: false,
          error: `Color inválido detectado: ${color}. Debe ser formato HEX (#RRGGBB).`,
        }
      }
    }

    let settings = await prisma.homeSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      // 4. Manual mapping for strict Type Safety during Creation
      const createData: Prisma.HomeSettingsCreateInput = {
        // Título 1
        heroTitle1Text: (cleanData.heroTitle1Text as string) ?? undefined,
        heroTitle1Font: (cleanData.heroTitle1Font as string) ?? undefined,
        heroTitle1FontUrl: (cleanData.heroTitle1FontUrl as string) ?? undefined,
        heroTitle1FontSize: (cleanData.heroTitle1FontSize as number) ?? undefined,
        heroTitle1Color: (cleanData.heroTitle1Color as string) ?? undefined,
        heroTitle1ColorDark: (cleanData.heroTitle1ColorDark as string) ?? undefined,
        heroTitle1ZIndex: (cleanData.heroTitle1ZIndex as number) ?? undefined,
        heroTitle1OffsetX: (cleanData.heroTitle1OffsetX as number) ?? undefined,
        heroTitle1OffsetY: (cleanData.heroTitle1OffsetY as number) ?? undefined,

        // Título 2
        heroTitle2Text: (cleanData.heroTitle2Text as string) ?? undefined,
        heroTitle2Font: (cleanData.heroTitle2Font as string) ?? undefined,
        heroTitle2FontUrl: (cleanData.heroTitle2FontUrl as string) ?? undefined,
        heroTitle2FontSize: (cleanData.heroTitle2FontSize as number) ?? undefined,
        heroTitle2Color: (cleanData.heroTitle2Color as string) ?? undefined,
        heroTitle2ColorDark: (cleanData.heroTitle2ColorDark as string) ?? undefined,
        heroTitle2ZIndex: (cleanData.heroTitle2ZIndex as number) ?? undefined,
        heroTitle2OffsetX: (cleanData.heroTitle2OffsetX as number) ?? undefined,
        heroTitle2OffsetY: (cleanData.heroTitle2OffsetY as number) ?? undefined,

        // Nombre propietario
        ownerNameText: (cleanData.ownerNameText as string) ?? undefined,
        ownerNameFont: (cleanData.ownerNameFont as string) ?? undefined,
        ownerNameFontUrl: (cleanData.ownerNameFontUrl as string) ?? undefined,
        ownerNameFontSize: (cleanData.ownerNameFontSize as number) ?? undefined,
        ownerNameColor: (cleanData.ownerNameColor as string) ?? undefined,
        ownerNameColorDark: (cleanData.ownerNameColorDark as string) ?? undefined,
        ownerNameZIndex: (cleanData.ownerNameZIndex as number) ?? undefined,
        ownerNameOffsetX: (cleanData.ownerNameOffsetX as number) ?? undefined,
        ownerNameOffsetY: (cleanData.ownerNameOffsetY as number) ?? undefined,

        // Imágenes
        heroMainImageUrl: (cleanData.heroMainImageUrl as string) ?? undefined,
        heroMainImageAlt: (cleanData.heroMainImageAlt as string) ?? undefined,
        heroMainImageCaption: (cleanData.heroMainImageCaption as string) ?? undefined,
        heroImageStyle: (cleanData.heroImageStyle as string) ?? undefined,
        heroMainImageZIndex: (cleanData.heroMainImageZIndex as number) ?? undefined,
        heroMainImageOffsetX: (cleanData.heroMainImageOffsetX as number) ?? undefined,
        heroMainImageOffsetY: (cleanData.heroMainImageOffsetY as number) ?? undefined,

        illustrationUrl: (cleanData.illustrationUrl as string) ?? undefined,
        illustrationAlt: (cleanData.illustrationAlt as string) ?? undefined,
        illustrationZIndex: (cleanData.illustrationZIndex as number) ?? undefined,
        illustrationOpacity: (cleanData.illustrationOpacity as number) ?? undefined,
        illustrationSize: (cleanData.illustrationSize as number) ?? undefined,
        illustrationOffsetX: (cleanData.illustrationOffsetX as number) ?? undefined,
        illustrationOffsetY: (cleanData.illustrationOffsetY as number) ?? undefined,
        illustrationRotation: (cleanData.illustrationRotation as number) ?? undefined,

        // Botón CTA
        ctaText: (cleanData.ctaText as string) ?? undefined,
        ctaLink: (cleanData.ctaLink as string) ?? undefined,
        ctaFont: (cleanData.ctaFont as string) ?? undefined,
        ctaFontUrl: (cleanData.ctaFontUrl as string) ?? undefined,
        ctaFontSize: (cleanData.ctaFontSize as number) ?? undefined,
        ctaVariant: (cleanData.ctaVariant as string) ?? undefined,
        ctaSize: (cleanData.ctaSize as string) ?? undefined,
        ctaOffsetX: (cleanData.ctaOffsetX as number) ?? undefined,
        ctaOffsetY: (cleanData.ctaOffsetY as number) ?? undefined,

        // Sección destacados
        showFeaturedProjects: (cleanData.showFeaturedProjects as boolean) ?? false,
        featuredTitle: (cleanData.featuredTitle as string) ?? undefined,
        featuredTitleFont: (cleanData.featuredTitleFont as string) ?? undefined,
        featuredTitleFontUrl: (cleanData.featuredTitleFontUrl as string) ?? undefined,
        featuredTitleFontSize: (cleanData.featuredTitleFontSize as number) ?? undefined,
        featuredTitleColor: (cleanData.featuredTitleColor as string) ?? undefined,
        featuredTitleColorDark: (cleanData.featuredTitleColorDark as string) ?? undefined,
        featuredCount: (cleanData.featuredCount as number) ?? 3,

        isActive: true,
      }

      settings = await prisma.homeSettings.create({
        data: createData,
      })
    } else {
      // 4. Data is strictly typed as UpdateInput
      settings = await prisma.homeSettings.update({
        where: { id: settings.id },
        data: cleanData,
      })
    }

    revalidatePath(ROUTES.home)

    return {
      success: true,
      settings,
      message: 'Configuración actualizada correctamente',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating home settings:', { error })
    return {
      success: false,
      error: 'Error interno al actualizar la configuración.',
    }
  }
}
