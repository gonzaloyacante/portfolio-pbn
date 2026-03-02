'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { requireAdmin } from '@/lib/security-server'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { z } from 'zod'

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
  maintenanceMode: boolean
  showAboutPage: boolean
  showProjectsPage: boolean
  showServicesPage: boolean
  showContactPage: boolean
  allowIndexing: boolean
}

/** Minimal visibility-only data for Navbar / Footer / middleware */
export interface PageVisibility {
  showAboutPage: boolean
  showProjectsPage: boolean
  showServicesPage: boolean
  showContactPage: boolean
  maintenanceMode: boolean
}

// ─── Validation ─────────────────────────────────────

const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(200).optional(),
  siteTagline: z.string().max(500).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  faviconUrl: z.string().url().nullable().optional(),
  defaultEmail: z.string().email().nullable().optional(),
  defaultPhone: z.string().max(30).nullable().optional(),
  defaultWhatsapp: z.string().max(30).nullable().optional(),
  maintenanceMode: z.boolean().optional(),
  showAboutPage: z.boolean().optional(),
  showProjectsPage: z.boolean().optional(),
  showServicesPage: z.boolean().optional(),
  showContactPage: z.boolean().optional(),
  allowIndexing: z.boolean().optional(),
})

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
          maintenanceMode: true,
          showAboutPage: true,
          showProjectsPage: true,
          showServicesPage: true,
          showContactPage: true,
          allowIndexing: true,
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
          showProjectsPage: true,
          showServicesPage: true,
          showContactPage: true,
          maintenanceMode: true,
        },
      })
      return (
        settings ?? {
          showAboutPage: true,
          showProjectsPage: true,
          showServicesPage: false,
          showContactPage: true,
          maintenanceMode: false,
        }
      )
    } catch {
      return {
        showAboutPage: true,
        showProjectsPage: true,
        showServicesPage: false,
        showContactPage: true,
        maintenanceMode: false,
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

    const parsed = siteSettingsSchema.partial().safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
    }

    const cleanData = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
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
