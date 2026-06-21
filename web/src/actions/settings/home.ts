'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { Prisma } from '@/generated/prisma/client'
import { findSingleton, upsertSingleton, HOME_SETTINGS_DEFAULTS } from '@/lib/settings-service'

import { ROUTES } from '@/config/routes'
import { logger } from '@/lib/logger'
import { homeSettingsSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize, validateFontUrl, validateColor } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'

export interface HomeSettingsData {
  id: string
  showHeroTitle1: boolean
  showHeroTitle2: boolean
  showOwnerName: boolean
  showHeroMainImage: boolean
  showIllustration: boolean
  showCtaButton: boolean
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

  heroImmersiveEnabled: boolean
  heroBackdropMediaKind: string | null
  heroBackdropUrl: string | null
  heroBackdropPosterUrl: string | null
  heroBackdropLoop: boolean
  heroBackdropMuted: boolean
  heroBackdropPlaysInline: boolean
  heroBackdropObjectFit: string | null
  heroBackdropObjectPosition: string | null
  heroBackdropMobileUrl: string | null
  heroBackdropMobileObjectPosition: string | null
  heroForegroundPortraitShow: boolean
  heroScrimEdge: string | null
  heroScrimShowLeft: boolean
  heroScrimShowRight: boolean
  heroScrimShowTop: boolean
  heroScrimExtentPercent: number | null
  heroScrimOpacity: number | null
  heroScrimColor: string | null
  heroScrimColorDark: string | null
  heroScrimFeatherPercent: number | null
  heroBackdropTintOpacity: number | null
  heroScrimMobileShowLeft: boolean
  heroScrimMobileShowRight: boolean
  heroScrimMobileShowTop: boolean
  heroScrimMobileExtentPercent: number | null
  heroScrimMobileOpacity: number | null

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
  // Mobile Overrides
  heroTitle1MobileOffsetX: number | null
  heroTitle1MobileOffsetY: number | null
  heroTitle1MobileFontSize: number | null
  heroTitle2MobileOffsetX: number | null
  heroTitle2MobileOffsetY: number | null
  heroTitle2MobileFontSize: number | null
  ownerNameMobileOffsetX: number | null
  ownerNameMobileOffsetY: number | null
  ownerNameMobileFontSize: number | null
  heroMainImageMobileOffsetX: number | null
  heroMainImageMobileOffsetY: number | null
  heroMainImageMobileImageStyle: string | null
  illustrationMobileOffsetX: number | null
  illustrationMobileOffsetY: number | null
  illustrationMobileSize: number | null
  illustrationMobileRotation: number | null
  ctaMobileOffsetX: number | null
  ctaMobileOffsetY: number | null
  ctaMobileFontSize: number | null
  ctaMobileSize: string | null
  // Tablet Overrides
  heroTitle1TabletOffsetX: number | null
  heroTitle1TabletOffsetY: number | null
  heroTitle1TabletFontSize: number | null
  heroTitle2TabletOffsetX: number | null
  heroTitle2TabletOffsetY: number | null
  heroTitle2TabletFontSize: number | null
  ownerNameTabletOffsetX: number | null
  ownerNameTabletOffsetY: number | null
  ownerNameTabletFontSize: number | null
  heroMainImageTabletOffsetX: number | null
  heroMainImageTabletOffsetY: number | null
  heroMainImageTabletImageStyle: string | null
  illustrationTabletOffsetX: number | null
  illustrationTabletOffsetY: number | null
  illustrationTabletSize: number | null
  illustrationTabletRotation: number | null
  ctaTabletOffsetX: number | null
  ctaTabletOffsetY: number | null
  ctaTabletFontSize: number | null
  ctaTabletSize: string | null
  // Sección destacados
  showFeaturedImages: boolean
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
export const getHomeSettings = unstable_cache(
  async (): Promise<HomeSettingsData | null> => {
    try {
      const settings = await findSingleton(prisma.homeSettings)
      return settings
    } catch (error) {
      logger.error('Error getting home settings:', { error: error })
      return null
    }
  },
  [CACHE_TAGS.homeSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.homeSettings] }
)

/**
 * Update home page settings
 */
export async function updateHeroElementPosition(
  elementId:
    | 'heroTitle1'
    | 'heroTitle2'
    | 'ownerName'
    | 'heroMainImage'
    | 'illustration'
    | 'ctaButton',
  viewport: 'desktop' | 'tablet' | 'mobile',
  offsetX: number,
  offsetY: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAdmin()

    // Mapear elementId + viewport → keys de BD
    const map: Record<
      typeof elementId,
      Record<typeof viewport, { x: keyof HomeSettingsData; y: keyof HomeSettingsData }>
    > = {
      heroTitle1: {
        desktop: { x: 'heroTitle1OffsetX', y: 'heroTitle1OffsetY' },
        tablet: { x: 'heroTitle1TabletOffsetX', y: 'heroTitle1TabletOffsetY' },
        mobile: { x: 'heroTitle1MobileOffsetX', y: 'heroTitle1MobileOffsetY' },
      },
      heroTitle2: {
        desktop: { x: 'heroTitle2OffsetX', y: 'heroTitle2OffsetY' },
        tablet: { x: 'heroTitle2TabletOffsetX', y: 'heroTitle2TabletOffsetY' },
        mobile: { x: 'heroTitle2MobileOffsetX', y: 'heroTitle2MobileOffsetY' },
      },
      ownerName: {
        desktop: { x: 'ownerNameOffsetX', y: 'ownerNameOffsetY' },
        tablet: { x: 'ownerNameTabletOffsetX', y: 'ownerNameTabletOffsetY' },
        mobile: { x: 'ownerNameMobileOffsetX', y: 'ownerNameMobileOffsetY' },
      },
      heroMainImage: {
        desktop: { x: 'heroMainImageOffsetX', y: 'heroMainImageOffsetY' },
        tablet: { x: 'heroMainImageTabletOffsetX', y: 'heroMainImageTabletOffsetY' },
        mobile: { x: 'heroMainImageMobileOffsetX', y: 'heroMainImageMobileOffsetY' },
      },
      illustration: {
        desktop: { x: 'illustrationOffsetX', y: 'illustrationOffsetY' },
        tablet: { x: 'illustrationTabletOffsetX', y: 'illustrationTabletOffsetY' },
        mobile: { x: 'illustrationMobileOffsetX', y: 'illustrationMobileOffsetY' },
      },
      ctaButton: {
        desktop: { x: 'ctaOffsetX', y: 'ctaOffsetY' },
        tablet: { x: 'ctaTabletOffsetX', y: 'ctaTabletOffsetY' },
        mobile: { x: 'ctaMobileOffsetX', y: 'ctaMobileOffsetY' },
      },
    }
    const keys = map[elementId][viewport]

    await checkSettingsRateLimit(user.id as string)

    const data: Partial<HomeSettingsData> = {
      [keys.x]: offsetX,
      [keys.y]: offsetY,
    } as Partial<HomeSettingsData>

    const validated = validateAndSanitize(homeSettingsSchema.partial(), data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.HomeSettingsUpdateInput

    await upsertSingleton(prisma.homeSettings, HOME_SETTINGS_DEFAULTS, cleanData)

    revalidatePath(ROUTES.home)
    revalidateTag(CACHE_TAGS.homeSettings, 'max')

    return { success: true }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Unauthorized') || error.message.includes('Demasiadas'))
    ) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating hero element position:', { error })
    return {
      success: false,
      error: 'Error interno al guardar la posición.',
    }
  }
}

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
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
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
      cleanData.featuredTitleFontUrl as string | undefined,
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
      cleanData.featuredTitleColor as string | undefined,
      cleanData.featuredTitleColorDark as string | undefined,
      cleanData.heroScrimColor as string | undefined,
      cleanData.heroScrimColorDark as string | undefined,
    ]
    for (const color of colors) {
      if (!validateColor(color)) {
        return {
          success: false,
          error: `Color inválido detectado: ${color}. Debe ser formato HEX (#RRGGBB).`,
        }
      }
    }

    const settings = await upsertSingleton(prisma.homeSettings, HOME_SETTINGS_DEFAULTS, cleanData)

    revalidatePath(ROUTES.home)
    revalidateTag(CACHE_TAGS.homeSettings, 'max')

    return {
      success: true,
      settings,
      message: 'Configuración actualizada correctamente',
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Unauthorized') || error.message.includes('Demasiadas'))
    ) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating home settings:', { error })
    return {
      success: false,
      error: 'Error interno al actualizar la configuración.',
    }
  }
}
