'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'

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
