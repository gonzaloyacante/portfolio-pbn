'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@/generated/prisma/client'

import { ROUTES } from '@/config/routes'
import { servicesPageSettingsSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize, validateColor } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import {
  DEFAULT_SERVICES_PAGE_LIST_INTRO,
  type ServicesPageSettingsData,
} from '@/lib/services-page-settings'

export const getServicesPageSettings = unstable_cache(
  async (): Promise<ServicesPageSettingsData | null> => {
    try {
      const settings = await prisma.servicesPageSettings.findFirst({
        where: { isActive: true },
      })
      return settings
    } catch (error) {
      logger.error('Error getting services page settings:', { error })
      return null
    }
  },
  [CACHE_TAGS.servicesPageSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.servicesPageSettings] }
)

export async function updateServicesPageSettings(
  data: Partial<Omit<ServicesPageSettingsData, 'id'>>
) {
  try {
    const user = await requireAdmin()
    await checkSettingsRateLimit(user.id as string)

    const validated = validateAndSanitize(servicesPageSettingsSchema.partial(), data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.ServicesPageSettingsUpdateInput

    const cLight = cleanData.listTitleColor as string | null | undefined
    const cDark = cleanData.listTitleColorDark as string | null | undefined
    if (cLight !== undefined && cLight !== null && !validateColor(cLight)) {
      return { success: false, error: `Color título (claro) inválido: ${cLight}` }
    }
    if (cDark !== undefined && cDark !== null && !validateColor(cDark)) {
      return { success: false, error: `Color título (oscuro) inválido: ${cDark}` }
    }

    let settings = await prisma.servicesPageSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      const createData: Prisma.ServicesPageSettingsCreateInput = {
        listTitle: (cleanData.listTitle as string) || 'Mis Servicios',
        listIntro: (cleanData.listIntro as string) ?? DEFAULT_SERVICES_PAGE_LIST_INTRO,
        listTitleFont: (cleanData.listTitleFont as string) ?? undefined,
        listTitleFontUrl: (cleanData.listTitleFontUrl as string) ?? undefined,
        listTitleFontSize: (cleanData.listTitleFontSize as number) ?? undefined,
        listTitleMobileFontSize: (cleanData.listTitleMobileFontSize as number) ?? undefined,
        listTitleColor: (cleanData.listTitleColor as string) ?? undefined,
        listTitleColorDark: (cleanData.listTitleColorDark as string) ?? undefined,
        isActive: true,
      }
      settings = await prisma.servicesPageSettings.create({ data: createData })
    } else {
      settings = await prisma.servicesPageSettings.update({
        where: { id: settings.id },
        data: cleanData,
      })
    }

    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.servicesPageSettings, 'max')
    revalidatePath(ROUTES.admin.services)

    return { success: true, settings, message: 'Cabecera de servicios actualizada' }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating services page settings:', { error })
    return { success: false, error: 'Error al actualizar configuración' }
  }
}
