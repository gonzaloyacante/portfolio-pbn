'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@/generated/prisma/client'

import { ROUTES } from '@/config/routes'
import { themeEditorSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize, validateFontUrl, validateColor } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import {
  DEFAULT_CSS_VARIABLES,
  BRAND,
  TYPOGRAPHY_DEFAULTS,
  RESET_THEME_DEFAULTS,
} from '@/lib/design-tokens'

export interface ThemeSettingsData {
  id: string
  // Light Mode
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  cardBgColor: string

  // Dark Mode
  darkPrimaryColor: string
  darkSecondaryColor: string
  darkAccentColor: string
  darkBackgroundColor: string
  darkTextColor: string
  darkCardBgColor: string

  // Typography
  headingFont: string
  headingFontUrl: string | null
  headingFontSize: number
  scriptFont: string
  scriptFontUrl: string | null
  scriptFontSize: number
  bodyFont: string
  bodyFontUrl: string | null
  bodyFontSize: number

  // Fonts Brand
  brandFont: string | null
  brandFontUrl: string | null
  brandFontSize: number | null
  portfolioFont: string | null
  portfolioFontUrl: string | null
  portfolioFontSize: number | null
  signatureFont: string | null
  signatureFontUrl: string | null
  signatureFontSize: number | null

  borderRadius: number
  isActive: boolean
}

/**
 * Get theme settings
 */
export const getThemeSettings = unstable_cache(
  async (): Promise<ThemeSettingsData | null> => {
    try {
      const settings = await prisma.themeSettings.findFirst({
        where: { isActive: true },
      })
      return settings
    } catch (error) {
      logger.error('Error getting theme settings:', { error: error })
      return null
    }
  },
  [CACHE_TAGS.themeSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.themeSettings] }
)

/**
 * Get theme values as CSS variable object
 */
export async function getThemeValues(): Promise<Record<string, string>> {
  try {
    const settings = await getThemeSettings()
    if (!settings) {
      return DEFAULT_CSS_VARIABLES
    }

    return {
      '--primary': settings.primaryColor,
      '--secondary': settings.secondaryColor,
      '--accent': settings.accentColor,
      '--background': settings.backgroundColor,
      '--foreground': settings.textColor,
      '--card-bg': settings.cardBgColor,

      '--dark-primary': settings.darkPrimaryColor,
      '--dark-secondary': settings.darkSecondaryColor,
      '--dark-accent': settings.darkAccentColor,
      '--dark-background': settings.darkBackgroundColor,
      '--dark-foreground': settings.darkTextColor,
      '--dark-card-bg': settings.darkCardBgColor,

      '--font-heading': settings.headingFont ? `"${settings.headingFont}", sans-serif` : 'inherit',
      '--font-heading-size': `${settings.headingFontSize}px`,
      '--font-script': settings.scriptFont ? `"${settings.scriptFont}", cursive` : 'inherit',
      '--font-script-size': `${settings.scriptFontSize}px`,
      '--font-body': settings.bodyFont ? `"${settings.bodyFont}", sans-serif` : 'inherit',
      '--font-body-size': `${settings.bodyFontSize}px`,

      '--font-brand': settings.brandFont ? `"${settings.brandFont}", sans-serif` : 'inherit',
      '--font-brand-size': settings.brandFontSize ? `${settings.brandFontSize}px` : 'inherit',

      '--font-portfolio': settings.portfolioFont
        ? `"${settings.portfolioFont}", sans-serif`
        : 'inherit',
      '--font-portfolio-size': settings.portfolioFontSize
        ? `${settings.portfolioFontSize}px`
        : 'inherit',

      '--font-signature': settings.signatureFont
        ? `"${settings.signatureFont}", cursive`
        : 'inherit',
      '--font-signature-size': settings.signatureFontSize
        ? `${settings.signatureFontSize}px`
        : 'inherit',

      '--radius': `${settings.borderRadius}px`,
    }
  } catch (error) {
    logger.error('Error getting theme values:', { error: error })
    return {}
  }
}

/**
 * Update theme settings
 */
export async function updateThemeSettings(data: Partial<Omit<ThemeSettingsData, 'id'>>) {
  try {
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation
    const validated = validateAndSanitize(themeEditorSchema.partial(), data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data strictly typed
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.ThemeSettingsUpdateInput

    // 3. 🎨 Specific Validations (Colors & Fonts)
    const fontUrls = [
      cleanData.headingFontUrl as string | undefined,
      cleanData.scriptFontUrl as string | undefined,
      cleanData.bodyFontUrl as string | undefined,
      cleanData.brandFontUrl as string | undefined,
      cleanData.portfolioFontUrl as string | undefined,
      cleanData.signatureFontUrl as string | undefined,
    ]
    for (const url of fontUrls) {
      if (!validateFontUrl(url)) {
        return {
          success: false,
          error: `URL de fuente inválida: ${url}`,
        }
      }
    }

    const colors = [
      cleanData.primaryColor,
      cleanData.secondaryColor,
      cleanData.accentColor,
      cleanData.backgroundColor,
      cleanData.textColor,
      cleanData.cardBgColor,
      cleanData.darkPrimaryColor,
      cleanData.darkSecondaryColor,
      cleanData.darkAccentColor,
      cleanData.darkBackgroundColor,
      cleanData.darkTextColor,
      cleanData.darkCardBgColor,
    ]
    for (const color of colors) {
      if (color !== undefined && !validateColor(color as string)) {
        return {
          success: false,
          error: `Color inválido detectado: ${color}`,
        }
      }
    }

    let settings = await prisma.themeSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      const createData: Prisma.ThemeSettingsCreateInput = {
        // Light Mode
        primaryColor: (cleanData.primaryColor as string) || BRAND.fallbackLight.primary,
        secondaryColor: (cleanData.secondaryColor as string) || BRAND.fallbackLight.secondary,
        accentColor: (cleanData.accentColor as string) || BRAND.fallbackLight.accent,
        backgroundColor: (cleanData.backgroundColor as string) || BRAND.fallbackLight.background,
        textColor: (cleanData.textColor as string) || BRAND.fallbackLight.foreground,
        cardBgColor: (cleanData.cardBgColor as string) || BRAND.fallbackLight.card,

        // Dark Mode
        darkPrimaryColor: (cleanData.darkPrimaryColor as string) || BRAND.fallbackDark.primary,
        darkSecondaryColor:
          (cleanData.darkSecondaryColor as string) || BRAND.fallbackDark.secondary,
        darkAccentColor: (cleanData.darkAccentColor as string) || BRAND.fallbackDark.accent,
        darkBackgroundColor:
          (cleanData.darkBackgroundColor as string) || BRAND.fallbackDark.background,
        darkTextColor: (cleanData.darkTextColor as string) || BRAND.fallbackDark.foreground,
        darkCardBgColor: (cleanData.darkCardBgColor as string) || BRAND.fallbackDark.card,

        // Typography - Defaults required for create
        headingFont: (cleanData.headingFont as string) || TYPOGRAPHY_DEFAULTS.headingFont,
        headingFontUrl: (cleanData.headingFontUrl as string) ?? undefined,
        headingFontSize:
          (cleanData.headingFontSize as number) ?? TYPOGRAPHY_DEFAULTS.headingFontSize,

        scriptFont: (cleanData.scriptFont as string) || TYPOGRAPHY_DEFAULTS.scriptFont,
        scriptFontUrl: (cleanData.scriptFontUrl as string) ?? undefined,
        scriptFontSize: (cleanData.scriptFontSize as number) ?? TYPOGRAPHY_DEFAULTS.scriptFontSize,

        bodyFont: (cleanData.bodyFont as string) || TYPOGRAPHY_DEFAULTS.bodyFont,
        bodyFontUrl: (cleanData.bodyFontUrl as string) ?? undefined,
        bodyFontSize: (cleanData.bodyFontSize as number) ?? TYPOGRAPHY_DEFAULTS.bodyFontSize,

        brandFont: (cleanData.brandFont as string) ?? undefined,
        brandFontUrl: (cleanData.brandFontUrl as string) ?? undefined,
        brandFontSize: (cleanData.brandFontSize as number) ?? undefined,

        portfolioFont: (cleanData.portfolioFont as string) ?? undefined,
        portfolioFontUrl: (cleanData.portfolioFontUrl as string) ?? undefined,
        portfolioFontSize: (cleanData.portfolioFontSize as number) ?? undefined,

        signatureFont: (cleanData.signatureFont as string) ?? undefined,
        signatureFontUrl: (cleanData.signatureFontUrl as string) ?? undefined,
        signatureFontSize: (cleanData.signatureFontSize as number) ?? undefined,

        borderRadius: (cleanData.borderRadius as number) ?? 8,

        isActive: true,
      }

      settings = await prisma.themeSettings.create({
        data: createData,
      })
    } else {
      settings = await prisma.themeSettings.update({
        where: { id: settings.id },
        data: cleanData,
      })
    }

    revalidatePath(ROUTES.home)
    revalidateTag(CACHE_TAGS.themeSettings, 'max')

    return {
      success: true,
      settings,
      message: 'Tema actualizado correctamente',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating theme settings:', { error })
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}

/**
 * Reset theme to defaults
 */
export async function resetThemeToDefaults() {
  try {
    // Delete existing standard theme settings
    await prisma.themeSettings.deleteMany({ where: { isActive: true } })

    // Create new default using RESET_THEME_DEFAULTS (single source of truth)
    await prisma.themeSettings.create({
      data: {
        isActive: true,
        ...RESET_THEME_DEFAULTS,
      },
    })

    revalidatePath(ROUTES.home, 'layout')
    revalidateTag(CACHE_TAGS.themeSettings, 'max')

    return { success: true, message: 'Tema reseteado a valores por defecto' }
  } catch (error) {
    logger.error('Error resetting theme:', { error })
    return { success: false, error: 'Error al resetear tema' }
  }
}
