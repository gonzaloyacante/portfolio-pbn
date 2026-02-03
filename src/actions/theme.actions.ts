'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'

/**
 * Settings Actions
 * Normalized settings management for Portfolio PBN
 * ALL fields are explicit - NO JSON
 */

// ========== THEME SETTINGS ==========

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
          isActive: true, // partial data creates issues if required fields missing? No, defaults handle it.
          // Type safety might complain if I don't provide all required. Schema has defaults for most.
          // But I need to cast or ensure data is valid.
          // For now assuming data contains necessary fields or schema defaults kick in.
          // Typescript might complain about missing string fields if they are not optional in schema but optional here.
          // Zod schema enforces requirements.
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

// ========== HOME SETTINGS ==========

export interface HomeSettingsData {
  id: string
  // Hero - Left Top
  heroTitle1: string | null
  heroTitle2: string | null
  // Hero - Left Bottom
  illustrationUrl: string | null
  illustrationAlt: string | null
  ownerName: string | null
  // Hero - Right
  heroMainImageUrl: string | null
  heroMainImageAlt: string | null
  heroMainImageCaption: string | null
  heroImageStyle: string | null
  // CTA
  ctaText: string | null
  ctaLink: string | null
  // Featured Projects
  showFeaturedProjects: boolean
  featuredTitle: string | null
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
          heroTitle1: data.heroTitle1 || 'Make-up',
          heroTitle2: data.heroTitle2 || 'Portfolio',
          illustrationUrl: data.illustrationUrl,
          illustrationAlt: data.illustrationAlt || 'Ilustración maquilladora',
          ownerName: data.ownerName || 'Paola Bolívar Nievas',
          heroMainImageUrl: data.heroMainImageUrl,
          heroMainImageAlt: data.heroMainImageAlt || 'Trabajo destacado',
          heroMainImageCaption: data.heroMainImageCaption,
          heroImageStyle: data.heroImageStyle || 'original',
          ctaText: data.ctaText || 'Ver Portfolio',
          ctaLink: data.ctaLink || ROUTES.public.projects,
          showFeaturedProjects: data.showFeaturedProjects ?? true,
          featuredTitle: data.featuredTitle,
          featuredCount: data.featuredCount || 6,
          isActive: true,
        },
      })
    } else {
      settings = await prisma.homeSettings.update({
        where: { id: settings.id },
        data,
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

// ========== ABOUT SETTINGS ==========

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

// ========== CONTACT SETTINGS ==========

export interface ContactSettingsData {
  id: string
  pageTitle: string | null
  illustrationUrl: string | null
  illustrationAlt: string | null
  ownerName: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  location: string | null
  formTitle: string | null
  nameLabel: string | null
  emailLabel: string | null
  phoneLabel: string | null
  messageLabel: string | null
  preferenceLabel: string | null
  submitLabel: string | null
  successTitle: string | null
  successMessage: string | null
  sendAnotherLabel: string | null
  showSocialLinks: boolean
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
          pageTitle: data.pageTitle || 'Contacto',
          illustrationUrl: data.illustrationUrl,
          illustrationAlt: data.illustrationAlt || 'Ilustración contacto',
          ownerName: data.ownerName || 'Paola Bolívar Nievas',
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          location: data.location,
          formTitle: data.formTitle || 'Envíame un mensaje',
          nameLabel: data.nameLabel || 'Tu nombre',
          emailLabel: data.emailLabel || 'Tu email',
          phoneLabel: data.phoneLabel || 'Tu teléfono (opcional)',
          messageLabel: data.messageLabel || 'Mensaje',
          preferenceLabel: data.preferenceLabel || '¿Cómo preferís que te contacte?',
          submitLabel: data.submitLabel || 'Enviar mensaje',
          successTitle: data.successTitle || '¡Mensaje enviado!',
          successMessage:
            data.successMessage || 'Gracias por contactarme. Te responderé lo antes posible.',
          sendAnotherLabel: data.sendAnotherLabel || 'Enviar otro mensaje',
          showSocialLinks: data.showSocialLinks ?? true,
          isActive: true,
        },
      })
    } else {
      settings = await prisma.contactSettings.update({
        where: { id: settings.id },
        data,
      })
    }

    revalidatePath(ROUTES.public.contact)

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

// ========== SOCIAL LINKS ==========

export interface SocialLinkData {
  id: string
  platform: string
  url: string
  username: string | null
  icon: string | null
  isActive: boolean
  sortOrder: number
}

/**
 * Get all active social links
 */
export async function getSocialLinks(): Promise<SocialLinkData[]> {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return links
  } catch (error) {
    console.error('Error getting social links:', error)
    return []
  }
}

/**
 * Update or create a social link
 */
export async function upsertSocialLink(data: Omit<SocialLinkData, 'id'> & { id?: string }) {
  try {
    const link = await prisma.socialLink.upsert({
      where: { platform: data.platform },
      update: data,
      create: data,
    })

    revalidatePath(ROUTES.home, 'layout')

    return {
      success: true,
      link,
      message: 'Enlace social actualizado',
    }
  } catch (error) {
    console.error('Error upserting social link:', error)
    return {
      success: false,
      error: 'Error al actualizar enlace social',
    }
  }
}

/**
 * Delete a social link
 */
export async function deleteSocialLink(id: string) {
  try {
    await prisma.socialLink.delete({ where: { id } })
    revalidatePath(ROUTES.home, 'layout')
    return { success: true, message: 'Enlace social eliminado' }
  } catch (error) {
    console.error('Error deleting social link:', error)
    return { success: false, error: 'Error al eliminar enlace social' }
  }
}
