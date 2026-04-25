'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { siteSettingsSchema } from '@/lib/validations'

// ─── Types ──────────────────────────────────────────

export interface SiteSettingsData {
  id: string
  siteName: string
  siteTagline: string | null
  logoUrl: string | null
  faviconUrl: string | null
  defaultEmail: string | null
  defaultPhone: string | null
  defaultWhatsapp: string | null
  defaultMetaTitle: string | null
  defaultMetaDescription: string | null
  defaultOgImage: string | null
  defaultAddress: string | null
  maintenanceMode: boolean
  maintenanceMessage: string | null
  showAboutPage: boolean
  showGalleryPage: boolean
  showServicesPage: boolean
  showContactPage: boolean
  allowIndexing: boolean
  navbarBrandText: string | null
  navbarBrandFont: string | null
  navbarBrandFontUrl: string | null
  navbarBrandFontSize: number | null
  navbarBrandColor: string | null
  navbarBrandColorDark: string | null
  navbarShowBrand: boolean
}

/** Minimal visibility-only data for Navbar / Footer / middleware */
export interface PageVisibility {
  showAboutPage: boolean
  showGalleryPage: boolean
  showServicesPage: boolean
  showContactPage: boolean
  maintenanceMode: boolean
  maintenanceMessage: string | null
  navbarBrandText: string | null
  navbarBrandFont: string | null
  navbarBrandFontUrl: string | null
  navbarBrandFontSize: number | null
  navbarBrandColor: string | null
  navbarBrandColorDark: string | null
  navbarShowBrand: boolean
}

// ─── Queries ────────────────────────────────────────

/**
 * Get full site settings
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData | null> => {
    try {
      const settings = await prisma.siteSettings.findFirst({
        where: { isActive: true },
        select: {
          id: true,
          siteName: true,
          siteTagline: true,
          logoUrl: true,
          faviconUrl: true,
          defaultEmail: true,
          defaultPhone: true,
          defaultWhatsapp: true,
          defaultMetaTitle: true,
          defaultMetaDescription: true,
          defaultOgImage: true,
          defaultAddress: true,
          maintenanceMode: true,
          maintenanceMessage: true,
          showAboutPage: true,
          showGalleryPage: true,
          showServicesPage: true,
          showContactPage: true,
          allowIndexing: true,
          navbarBrandText: true,
          navbarBrandFont: true,
          navbarBrandFontUrl: true,
          navbarBrandFontSize: true,
          navbarBrandColor: true,
          navbarBrandColorDark: true,
          navbarShowBrand: true,
        },
      })
      return settings
    } catch (error) {
      logger.error('Error getting site settings:', { error })
      return null
    }
  },
  [CACHE_TAGS.siteSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.siteSettings] }
)

/**
 * Get page visibility settings (lightweight, for Navbar/Footer/Middleware)
 */
export const getPageVisibility = unstable_cache(
  async (): Promise<PageVisibility> => {
    try {
      const settings = await prisma.siteSettings.findFirst({
        where: { isActive: true },
        select: {
          showAboutPage: true,
          showGalleryPage: true,
          showServicesPage: true,
          showContactPage: true,
          maintenanceMode: true,
          maintenanceMessage: true,
          navbarBrandText: true,
          navbarBrandFont: true,
          navbarBrandFontUrl: true,
          navbarBrandFontSize: true,
          navbarBrandColor: true,
          navbarBrandColorDark: true,
          navbarShowBrand: true,
        },
      })
      return (
        settings ?? {
          showAboutPage: true,
          showGalleryPage: true,
          showServicesPage: false,
          showContactPage: true,
          maintenanceMode: false,
          maintenanceMessage: null,
          navbarBrandText: null,
          navbarBrandFont: null,
          navbarBrandFontUrl: null,
          navbarBrandFontSize: null,
          navbarBrandColor: null,
          navbarBrandColorDark: null,
          navbarShowBrand: true,
        }
      )
    } catch {
      return {
        showAboutPage: true,
        showGalleryPage: true,
        showServicesPage: false,
        showContactPage: true,
        maintenanceMode: false,
        maintenanceMessage: null,
        navbarBrandText: null,
        navbarBrandFont: null,
        navbarBrandFontUrl: null,
        navbarBrandFontSize: null,
        navbarBrandColor: null,
        navbarBrandColorDark: null,
        navbarShowBrand: true,
      }
    }
  },
  [CACHE_TAGS.siteSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.siteSettings] }
)

// ─── Mutations ──────────────────────────────────────

/**
 * Update site settings
 */
async function _upsertSiteSettings(cleanData: Record<string, unknown>) {
  const existing = await prisma.siteSettings.findFirst({ where: { isActive: true } })
  if (existing) {
    return prisma.siteSettings.update({ where: { id: existing.id }, data: cleanData })
  }
  return prisma.siteSettings.create({ data: { ...cleanData, isActive: true } })
}

export async function updateSiteSettings(data: Partial<Omit<SiteSettingsData, 'id'>>) {
  try {
    const user = await requireAdmin()
    await checkSettingsRateLimit(user.id as string)

    const validated = validateAndSanitize(siteSettingsSchema.partial(), data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    const cleanData = Object.fromEntries(
      Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    ) as Record<string, unknown>

    const settings = await _upsertSiteSettings(cleanData)

    // site settings (page visibility) affect Navbar on ALL public pages via (public)/layout.tsx
    revalidatePath('/', 'layout')
    revalidateTag(CACHE_TAGS.siteSettings, 'max')

    return { success: true, settings, message: 'Configuración del sitio actualizada' }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating site settings:', { error })
    return { success: false, error: 'Error al actualizar configuración del sitio' }
  }
}
