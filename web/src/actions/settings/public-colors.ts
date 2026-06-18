'use server'

import { prisma } from '@/lib/db'
import { z } from 'zod'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { requireAdmin } from '@/lib/security-server'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'

export type PublicColorOverrides = Record<string, { light: string; dark: string }>

export const getPublicColorOverrides = unstable_cache(
  async (): Promise<PublicColorOverrides> => {
    try {
      const rows = await prisma.themeColorOverride.findMany()
      return Object.fromEntries(rows.map((r) => [r.key, { light: r.light, dark: r.dark }]))
    } catch (error) {
      logger.error('Error getting public color overrides', { error })
      return {}
    }
  },
  [CACHE_TAGS.publicColorOverrides],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.publicColorOverrides] }
)

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color hex inválido (#RRGGBB)')

const overrideRowSchema = z.object({
  key: z.string().min(1).max(80),
  light: hexColorSchema,
  dark: hexColorSchema,
})

export async function upsertPublicColorOverrides(
  rows: { key: string; light: string; dark: string }[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAdmin()
    await checkSettingsRateLimit(user.id as string)

    const validated = z.array(overrideRowSchema).safeParse(rows)
    if (!validated.success) {
      return { success: false, error: 'Valores de color inválidos' }
    }

    await prisma.$transaction(
      validated.data.map((row) =>
        prisma.themeColorOverride.upsert({
          where: { key: row.key },
          create: row,
          update: { light: row.light, dark: row.dark },
        })
      )
    )

    revalidateTag(CACHE_TAGS.publicColorOverrides, 'max')
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Unauthorized') || error.message.includes('Demasiadas'))
    ) {
      return { success: false, error: error.message }
    }
    logger.error('Error upserting public color overrides', { error })
    return { success: false, error: 'Error al guardar los colores' }
  }
}

export async function deletePublicColorOverride(
  key: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAdmin()
    await checkSettingsRateLimit(user.id as string)

    await prisma.themeColorOverride.deleteMany({ where: { key } })

    revalidateTag(CACHE_TAGS.publicColorOverrides, 'max')
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Unauthorized') || error.message.includes('Demasiadas'))
    ) {
      return { success: false, error: error.message }
    }
    logger.error('Error deleting public color override', { error })
    return { success: false, error: 'Error al eliminar el color' }
  }
}
