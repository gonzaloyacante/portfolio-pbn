'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@prisma/client'

import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// Basic schema for Social Link since it wasn't in validations.ts
const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  username: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

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
export const getSocialLinks = unstable_cache(
  async (): Promise<SocialLinkData[]> => {
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
  },
  [CACHE_TAGS.socialLinks],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.socialLinks] }
)

/**
 * Update or create a social link
 */
export async function upsertSocialLink(data: Omit<SocialLinkData, 'id'> & { id?: string }) {
  try {
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation
    const validated = validateAndSanitize(socialLinkSchema, data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data strictly typed
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries)

    // Ensure platform is present for upsert
    if (!cleanData.platform) {
      return { success: false, error: 'Platform is required' }
    }

    // Cast individually to inputs for precision
    const updateInput: Prisma.SocialLinkUpdateInput = {
      url: cleanData.url as string | undefined,
      username: cleanData.username as string | undefined,
      icon: cleanData.icon as string | undefined,
      isActive: cleanData.isActive as boolean | undefined,
      sortOrder: cleanData.sortOrder as number | undefined,
    }

    const createInput: Prisma.SocialLinkCreateInput = {
      platform: cleanData.platform as string,
      url: cleanData.url as string,
      username: (cleanData.username as string) ?? undefined,
      icon: (cleanData.icon as string) ?? undefined,
      isActive: (cleanData.isActive as boolean) ?? true,
      sortOrder: (cleanData.sortOrder as number) ?? 0,
    }

    const link = await prisma.socialLink.upsert({
      where: { platform: cleanData.platform as string },
      update: updateInput,
      create: createInput,
    })

    revalidatePath(ROUTES.home, 'layout')
    revalidateTag(CACHE_TAGS.socialLinks, 'max')

    return {
      success: true,
      link,
      message: 'Enlace social actualizado',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error upserting social link:', { error })
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
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    await prisma.socialLink.delete({ where: { id } })
    revalidatePath(ROUTES.home, 'layout')
    revalidateTag(CACHE_TAGS.socialLinks, 'max')
    return { success: true, message: 'Enlace social eliminado' }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error deleting social link:', { error })
    return { success: false, error: 'Error al eliminar enlace social' }
  }
}
