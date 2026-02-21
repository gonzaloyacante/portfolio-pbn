'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { Prisma } from '@/generated/prisma/client'

import { ROUTES } from '@/config/routes'
import { contactSettingsSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/security-server'
import { validateAndSanitize } from '@/lib/security-client'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'

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
export const getContactSettings = unstable_cache(
  async (): Promise<ContactSettingsData | null> => {
    try {
      const settings = await prisma.contactSettings.findFirst({
        where: { isActive: true },
      })
      return settings
    } catch (error) {
      logger.error('Error getting contact settings:', { error: error })
      return null
    }
  },
  [CACHE_TAGS.contactSettings],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.contactSettings] }
)

/**
 * Update contact settings
 */
export async function updateContactSettings(data: Partial<Omit<ContactSettingsData, 'id'>>) {
  try {
    // 1. 🔒 Security
    const user = await requireAdmin()

    // 2. 🚦 Rate Limiting
    await checkSettingsRateLimit(user.id as string)

    // 3. 🛡️ Validation
    const validated = validateAndSanitize(contactSettingsSchema.partial(), data)
    if (!validated.success) {
      return { success: false, error: validated.error }
    }

    // 3. 🧹 Clean Data strictly typed
    const cleanEntries = Object.entries(validated.data || {}).filter(([, v]) => v !== undefined)
    const cleanData = Object.fromEntries(cleanEntries) as Prisma.ContactSettingsUpdateInput

    let settings = await prisma.contactSettings.findFirst({ where: { isActive: true } })

    if (!settings) {
      const createData: Prisma.ContactSettingsCreateInput = {
        pageTitle: (cleanData.pageTitle as string) || 'Contacto',
        illustrationUrl: (cleanData.illustrationUrl as string) ?? undefined,
        illustrationAlt: (cleanData.illustrationAlt as string) || 'Ilustración contacto',
        ownerName: (cleanData.ownerName as string) || 'Paola Bolívar Nievas',

        // Required / Safe Optional fields
        email: (cleanData.email as string) || '', // Email is required in schema usually, assuming user provides strictly valid partial or defaults logic applies
        phone: (cleanData.phone as string) ?? undefined,
        whatsapp: (cleanData.whatsapp as string) ?? undefined,
        location: (cleanData.location as string) ?? undefined,

        formTitle: (cleanData.formTitle as string) || 'Envíame un mensaje',
        nameLabel: (cleanData.nameLabel as string) || 'Tu nombre',
        emailLabel: (cleanData.emailLabel as string) || 'Tu email',
        phoneLabel: (cleanData.phoneLabel as string) || 'Tu teléfono (opcional)',
        messageLabel: (cleanData.messageLabel as string) || 'Mensaje',
        preferenceLabel: (cleanData.preferenceLabel as string) || '¿Cómo preferís que te contacte?',
        submitLabel: (cleanData.submitLabel as string) || 'Enviar mensaje',
        successTitle: (cleanData.successTitle as string) || '¡Mensaje enviado!',
        successMessage:
          (cleanData.successMessage as string) ||
          'Gracias por contactarme. Te responderé lo antes posible.',
        sendAnotherLabel: (cleanData.sendAnotherLabel as string) || 'Enviar otro mensaje',
        showSocialLinks: (cleanData.showSocialLinks as boolean) ?? true,

        isActive: true,
      }

      settings = await prisma.contactSettings.create({
        data: createData,
      })
    } else {
      settings = await prisma.contactSettings.update({
        where: { id: settings.id },
        data: cleanData,
      })
    }

    revalidatePath(ROUTES.public.contact)
    revalidateTag(CACHE_TAGS.contactSettings, 'max')

    return {
      success: true,
      settings,
      message: 'Configuración de contacto actualizada',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return { success: false, error: error.message }
    }
    logger.error('Error updating contact settings:', { error })
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}
