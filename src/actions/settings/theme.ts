'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'

export interface ThemeSettingsData {
  id: string
  // Light Theme
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  cardBgColor: string
  // Dark Theme
  darkPrimaryColor: string
  darkSecondaryColor: string
  darkAccentColor: string
  darkBackgroundColor: string
  darkTextColor: string
  darkCardBgColor: string
  // Typography Values (Family Names)
  headingFont: string
  headingFontSize: number
  scriptFont: string
  scriptFontSize: number
  bodyFont: string
  bodyFontSize: number
  brandFont: string | null
  brandFontSize: number
  portfolioFont: string | null
  portfolioFontSize: number
  signatureFont: string | null
  signatureFontSize: number
  // Typography URLs (Google Fonts Embed)
  headingFontUrl: string | null
  scriptFontUrl: string | null
  bodyFontUrl: string | null
  brandFontUrl: string | null
  portfolioFontUrl: string | null
  signatureFontUrl: string | null
  // Layout
  borderRadius: number
  isActive: boolean
}

/**
 * Get theme settings
 */
export async function getThemeSettings(): Promise<ThemeSettingsData | null> {
  try {
    const settings = await prisma.themeSettings.findFirst({
      where: { isActive: true },
    })
    return settings
  } catch (error) {
    console.error('Error getting theme settings:', error)
    return null
  }
}

/**
 * Get theme values as CSS variable object
 */
export async function getThemeValues(): Promise<Record<string, string>> {
  try {
    const settings = await getThemeSettings()
    if (!settings) {
      return {
        'primary-color': '#6c0a0a',
        'secondary-color': '#ffaadd',
        'accent-color': '#fff1f9',
        'background-color': '#fff1f9',
        'text-color': '#000000',
        'card-bg-color': '#ffaadd',
        'heading-font': 'Poppins',
        'heading-font-size': '32',
        'script-font': 'Great Vibes',
        'script-font-size': '24',
        'body-font': 'Open Sans',
        'body-font-size': '16',
        'brand-font': 'Saira Extra Condensed',
        'brand-font-size': '112',
        'portfolio-font': 'Saira Extra Condensed',
        'portfolio-font-size': '96',
        'signature-font': 'Dawning of a New Day',
        'signature-font-size': '36',
        'border-radius': '40',
      }
    }

    return {
      'primary-color': settings.primaryColor,
      'secondary-color': settings.secondaryColor,
      'accent-color': settings.accentColor,
      'background-color': settings.backgroundColor,
      'text-color': settings.textColor,
      'card-bg-color': settings.cardBgColor,
      'dark-primary-color': settings.darkPrimaryColor,
      'dark-secondary-color': settings.darkSecondaryColor,
      'dark-accent-color': settings.darkAccentColor,
      'dark-background-color': settings.darkBackgroundColor,
      'dark-text-color': settings.darkTextColor,
      'dark-card-bg-color': settings.darkCardBgColor,
      'heading-font': settings.headingFont,
      'heading-font-size': String(settings.headingFontSize),
      'script-font': settings.scriptFont,
      'script-font-size': String(settings.scriptFontSize),
      'body-font': settings.bodyFont,
      'body-font-size': String(settings.bodyFontSize),
      'brand-font': settings.brandFont || 'inherit',
      'brand-font-size': String(settings.brandFontSize),
      'portfolio-font': settings.portfolioFont || 'inherit',
      'portfolio-font-size': String(settings.portfolioFontSize),
      'signature-font': settings.signatureFont || 'inherit',
      'signature-font-size': String(settings.signatureFontSize),
      'border-radius': String(settings.borderRadius),
    }
  } catch (error) {
    console.error('Error getting theme values:', error)
    return {}
  }
}

/**
 * Update theme settings
 */
export async function updateThemeSettings(data: Partial<Omit<ThemeSettingsData, 'id'>>) {
  try {
    let settings = await prisma.themeSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      settings = await prisma.themeSettings.create({
        data: {
          isActive: true,
          ...data,
        },
      })
    } else {
      settings = await prisma.themeSettings.update({
        where: { id: settings.id },
        data,
      })
    }

    // Revalidate all critical paths to apply theme changes
    revalidatePath('/', 'layout') // All layouts including admin
    revalidatePath('/projects') // Projects page
    revalidatePath('/about') // About page
    revalidatePath('/contact') // Contact page
    revalidatePath('/admin') // Admin dashboard

    return {
      success: true,
      settings,
      message: 'Configuración de tema actualizada',
    }
  } catch (error) {
    console.error('Error updating theme settings:', error)
    return {
      success: false,
      error: 'Error al actualizar configuración de tema',
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

    // Create new default
    await prisma.themeSettings.create({
      data: {
        isActive: true,
        // Light Defaults
        primaryColor: '#6c0a0a',
        secondaryColor: '#fce7f3',
        accentColor: '#fff1f9',
        backgroundColor: '#fff8fc',
        textColor: '#1a050a',
        cardBgColor: '#ffffff',
        // Dark Defaults (Fixed)
        darkPrimaryColor: '#fb7185',
        darkSecondaryColor: '#881337',
        darkAccentColor: '#2a1015',
        darkBackgroundColor: '#0f0505',
        darkTextColor: '#fafafa',
        darkCardBgColor: '#1c0a0f',
      },
    })

    revalidatePath(ROUTES.home, 'layout')

    return { success: true, message: 'Tema reseteado a valores por defecto' }
  } catch (error) {
    console.error('Error resetting theme:', error)
    return { success: false, error: 'Error al resetear tema' }
  }
}
