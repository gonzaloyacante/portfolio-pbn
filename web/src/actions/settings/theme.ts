'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@/generated/prisma/client'
import { findSingleton, upsertSingleton } from '@/lib/settings-service'

import { themeEditorSchema, type ThemeEditorData } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize, validateFontUrl, validateColor } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { DEFAULT_CSS_VARIABLES, RESET_THEME_DEFAULTS } from '@/lib/design-tokens'
import { themeEditorDataToCssVars } from '@/lib/theme-css-vars-from-editor'

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

function themeSettingsToCssVars(settings: ThemeSettingsData): Record<string, string> {
  const shape: ThemeEditorData = {
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    accentColor: settings.accentColor,
    backgroundColor: settings.backgroundColor,
    textColor: settings.textColor,
    cardBgColor: settings.cardBgColor,
    darkPrimaryColor: settings.darkPrimaryColor,
    darkSecondaryColor: settings.darkSecondaryColor,
    darkAccentColor: settings.darkAccentColor,
    darkBackgroundColor: settings.darkBackgroundColor,
    darkTextColor: settings.darkTextColor,
    darkCardBgColor: settings.darkCardBgColor,
    headingFont: settings.headingFont,
    headingFontUrl: settings.headingFontUrl ?? undefined,
    headingFontSize: settings.headingFontSize,
    scriptFont: settings.scriptFont,
    scriptFontUrl: settings.scriptFontUrl ?? undefined,
    scriptFontSize: settings.scriptFontSize,
    bodyFont: settings.bodyFont,
    bodyFontUrl: settings.bodyFontUrl ?? undefined,
    bodyFontSize: settings.bodyFontSize,
    brandFont: settings.brandFont ?? undefined,
    brandFontUrl: settings.brandFontUrl ?? undefined,
    brandFontSize: settings.brandFontSize ?? undefined,
    portfolioFont: settings.portfolioFont ?? undefined,
    portfolioFontUrl: settings.portfolioFontUrl ?? undefined,
    portfolioFontSize: settings.portfolioFontSize ?? undefined,
    signatureFont: settings.signatureFont ?? undefined,
    signatureFontUrl: settings.signatureFontUrl ?? undefined,
    signatureFontSize: settings.signatureFontSize ?? undefined,
    borderRadius: settings.borderRadius,
  }
  return themeEditorDataToCssVars(shape)
}

/**
 * Get theme settings
 */
export const getThemeSettings = unstable_cache(
  async (): Promise<ThemeSettingsData | null> => {
    try {
      const settings = await findSingleton(prisma.themeSettings)
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
 * Get theme values as CSS variable object (cached)
 */
export const getThemeValues = unstable_cache(
  async (): Promise<Record<string, string>> => {
    try {
      const settings = await getThemeSettings()
      if (!settings) {
        return DEFAULT_CSS_VARIABLES
      }

      return themeSettingsToCssVars(settings)
    } catch (error) {
      logger.error('Error getting theme values:', { error: error })
      return DEFAULT_CSS_VARIABLES
    }
  },
  ['theme-values'],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.themeSettings] }
)

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

    const themeNumericKeys = new Set([
      'headingFontSize',
      'scriptFontSize',
      'bodyFontSize',
      'brandFontSize',
      'portfolioFontSize',
      'signatureFontSize',
      'borderRadius',
    ])
    const validatedData = { ...(validated.data || {}) }
    for (const key of themeNumericKeys) {
      if (validatedData[key as keyof typeof validatedData] === null) {
        delete validatedData[key as keyof typeof validatedData]
      }
    }

    // 3. 🧹 Clean Data strictly typed
    const cleanEntries = Object.entries(validatedData).filter(([, v]) => v !== undefined)
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

    const settings = await upsertSingleton(prisma.themeSettings, {}, cleanData)

    revalidatePath('/', 'layout')
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
  const user = await requireAdmin()
  await checkSettingsRateLimit(user.id)

  try {
    // Sobrescribe todos los campos con RESET_THEME_DEFAULTS (fuente única de verdad)
    await upsertSingleton(prisma.themeSettings, RESET_THEME_DEFAULTS, RESET_THEME_DEFAULTS)

    revalidatePath('/', 'layout')
    revalidateTag(CACHE_TAGS.themeSettings, 'max')

    return { success: true, message: 'Tema reseteado a valores por defecto' }
  } catch (error) {
    logger.error('Error resetting theme:', { error })
    return { success: false, error: 'Error al resetear tema' }
  }
}
