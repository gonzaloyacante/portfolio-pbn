'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Settings Actions
 * Normalized settings management (NO JSON fields)
 */

// ========== THEME SETTINGS ==========

export interface ThemeSettingsData {
  id: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  headingFont: string
  bodyFont: string
  borderRadius: number
  isActive: boolean
}

/**
 * Get theme settings (singleton - first active row)
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
        'primary-color': '#c71585',
        'secondary-color': '#f0f0f0',
        'accent-color': '#ff69b4',
        'background-color': '#ffffff',
        'text-color': '#1a1a1a',
        'heading-font': 'Raleway',
        'body-font': 'Open Sans',
        'border-radius': '8',
      }
    }

    return {
      'primary-color': settings.primaryColor,
      'secondary-color': settings.secondaryColor,
      'accent-color': settings.accentColor,
      'background-color': settings.backgroundColor,
      'text-color': settings.textColor,
      'heading-font': settings.headingFont,
      'body-font': settings.bodyFont,
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
    // Get or create the settings row
    let settings = await prisma.themeSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      settings = await prisma.themeSettings.create({
        data: {
          primaryColor: data.primaryColor || '#c71585',
          secondaryColor: data.secondaryColor || '#f0f0f0',
          accentColor: data.accentColor || '#ff69b4',
          backgroundColor: data.backgroundColor || '#ffffff',
          textColor: data.textColor || '#1a1a1a',
          headingFont: data.headingFont || 'Raleway',
          bodyFont: data.bodyFont || 'Open Sans',
          borderRadius: data.borderRadius || 8,
          isActive: true,
        },
      })
    } else {
      settings = await prisma.themeSettings.update({
        where: { id: settings.id },
        data,
      })
    }

    revalidatePath('/', 'layout')

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
    const settings = await prisma.themeSettings.findFirst({ where: { isActive: true } })

    const defaultData = {
      primaryColor: '#c71585',
      secondaryColor: '#f0f0f0',
      accentColor: '#ff69b4',
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      headingFont: 'Raleway',
      bodyFont: 'Open Sans',
      borderRadius: 8,
    }

    if (settings) {
      await prisma.themeSettings.update({
        where: { id: settings.id },
        data: defaultData,
      })
    } else {
      await prisma.themeSettings.create({
        data: { ...defaultData, isActive: true },
      })
    }

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: 'Tema reseteado a valores por defecto',
    }
  } catch (error) {
    console.error('Error resetting theme:', error)
    return {
      success: false,
      error: 'Error al resetear tema',
    }
  }
}

// ========== ABOUT SETTINGS ==========

export interface AboutSettingsData {
  id: string
  bioTitle: string | null
  bioDescription: string | null
  profileImageUrl: string | null
  skills: string[]
  yearsExperience: number | null
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
          bioTitle: data.bioTitle || 'Sobre Mí',
          bioDescription: data.bioDescription,
          profileImageUrl: data.profileImageUrl,
          skills: data.skills || [],
          yearsExperience: data.yearsExperience,
          isActive: true,
        },
      })
    } else {
      settings = await prisma.aboutSettings.update({
        where: { id: settings.id },
        data,
      })
    }

    revalidatePath('/sobre-mi')

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

// ========== HOME SETTINGS ==========

export interface HomeSettingsData {
  id: string
  heroTitle: string | null
  heroSubtitle: string | null
  heroImageUrl: string | null
  heroCtaText: string | null
  heroCtaLink: string | null
  showFeaturedProjects: boolean
  featuredTitle: string | null
  featuredCount: number
  showTestimonials: boolean
  testimonialsTitle: string | null
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
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroImageUrl: data.heroImageUrl,
          heroCtaText: data.heroCtaText || 'Ver Portfolio',
          heroCtaLink: data.heroCtaLink || '/proyectos',
          showFeaturedProjects: data.showFeaturedProjects ?? true,
          featuredTitle: data.featuredTitle || 'Trabajos Destacados',
          featuredCount: data.featuredCount || 6,
          showTestimonials: data.showTestimonials ?? true,
          testimonialsTitle: data.testimonialsTitle || 'Lo que dicen mis clientes',
          isActive: true,
        },
      })
    } else {
      settings = await prisma.homeSettings.update({
        where: { id: settings.id },
        data,
      })
    }

    revalidatePath('/')

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

// ========== CONTACT SETTINGS ==========

export interface ContactSettingsData {
  id: string
  emails: string[]
  phones: string[]
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  country: string | null
  hoursTitle: string | null
  hoursWeekdays: string | null
  hoursSaturday: string | null
  hoursSunday: string | null
  formTitle: string | null
  formSuccessMessage: string | null
  isActive: boolean
}

/**
 * Get contact settings
 */
export async function getContactSettings(): Promise<ContactSettingsData | null> {
  try {
    const settings = await prisma.contactSettings.findFirst({
      where: { isActive: true },
    })
    return settings
  } catch (error) {
    console.error('Error getting contact settings:', error)
    return null
  }
}

/**
 * Update contact settings
 */
export async function updateContactSettings(data: Partial<Omit<ContactSettingsData, 'id'>>) {
  try {
    let settings = await prisma.contactSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      settings = await prisma.contactSettings.create({
        data: {
          emails: data.emails || [],
          phones: data.phones || [],
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          country: data.country,
          hoursTitle: data.hoursTitle || 'Horario de Atención',
          hoursWeekdays: data.hoursWeekdays,
          hoursSaturday: data.hoursSaturday,
          hoursSunday: data.hoursSunday,
          formTitle: data.formTitle || 'Envíame un mensaje',
          formSuccessMessage: data.formSuccessMessage || '¡Gracias! Tu mensaje ha sido enviado.',
          isActive: true,
        },
      })
    } else {
      settings = await prisma.contactSettings.update({
        where: { id: settings.id },
        data,
      })
    }

    revalidatePath('/contacto')

    return {
      success: true,
      settings,
      message: 'Configuración de contacto actualizada',
    }
  } catch (error) {
    console.error('Error updating contact settings:', error)
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}

// ========== LEGACY EXPORTS (Backward Compatibility) ==========
// These will be removed in future versions

/** @deprecated Use getThemeSettings() instead */
export async function getAllThemeSettings() {
  console.warn('getAllThemeSettings is deprecated. Use getThemeSettings().')
  return getThemeSettings()
}

/** @deprecated Use getThemeSettings() instead */
export async function getThemeSettingsGrouped() {
  console.warn('getThemeSettingsGrouped is deprecated. Use getThemeSettings().')
  const settings = await getThemeSettings()
  return {
    colors: settings ? [settings] : [],
    typography: [],
    spacing: [],
    layout: [],
    effects: [],
  }
}

/** @deprecated Use updateThemeSettings() instead */
export async function updateMultipleThemeSettings(updates: Array<{ key: string; value: string }>) {
  console.warn('updateMultipleThemeSettings is deprecated. Use updateThemeSettings().')
  const data: Record<string, string | number> = {}
  for (const { key, value } of updates) {
    // Map old keys to new flat columns
    const keyMap: Record<string, string> = {
      'primary-color': 'primaryColor',
      'secondary-color': 'secondaryColor',
      'accent-color': 'accentColor',
      'background-color': 'backgroundColor',
      'text-color': 'textColor',
      'heading-font': 'headingFont',
      'body-font': 'bodyFont',
      'border-radius': 'borderRadius',
    }
    const newKey = keyMap[key] || key
    data[newKey] = key === 'border-radius' ? parseInt(value) || 8 : value
  }
  return updateThemeSettings(data as Partial<ThemeSettingsData>)
}
