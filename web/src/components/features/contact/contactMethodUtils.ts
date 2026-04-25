import type { ContactSettingsData } from '@/actions/settings/contact'

export type ContactMethodId = 'email' | 'phone' | 'whatsapp' | 'instagram' | 'location'

export interface ContactMethodItem {
  id: ContactMethodId
  label: string
  value: string
  href?: string
  external?: boolean
}

export function getVisibleContactMethods(
  settings: ContactSettingsData | null
): ContactMethodItem[] {
  if (!settings) return []

  const instagramUrl =
    settings.instagram ||
    (settings.instagramUsername
      ? `https://instagram.com/${settings.instagramUsername.replace(/^@/, '')}`
      : null)

  const methods: ContactMethodItem[] = []

  if (settings.showEmail && settings.email) {
    methods.push({
      id: 'email',
      label: 'Correo',
      value: settings.email,
      href: `mailto:${settings.email}`,
    })
  }

  if (settings.showPhone && settings.phone) {
    methods.push({
      id: 'phone',
      label: 'Teléfono',
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s+/g, '')}`,
    })
  }

  if (settings.showWhatsapp && settings.whatsapp) {
    methods.push({
      id: 'whatsapp',
      label: 'WhatsApp',
      value: settings.whatsapp,
      href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`,
    })
  }

  if (settings.showInstagram && instagramUrl) {
    methods.push({
      id: 'instagram',
      label: 'Instagram',
      value: settings.instagramUsername
        ? `@${settings.instagramUsername.replace(/^@/, '')}`
        : 'Ver perfil',
      href: instagramUrl,
      external: true,
    })
  }

  if (settings.showLocation && settings.location) {
    methods.push({
      id: 'location',
      label: 'Ubicación',
      value: settings.location,
    })
  }

  return methods
}
