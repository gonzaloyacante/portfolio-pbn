import { getContactSettings, type ContactSettingsData } from '@/actions/settings/contact'
import { getSocialLinks, type SocialLinkData } from '@/actions/settings/social'
import { getActiveServices } from '@/actions/cms/services'
import { getVisibleContactMethods, type ContactMethodItem } from '../contactMethodUtils'

export interface PublicContactServiceOption {
  id: string
  name: string
}

export interface PublicContactPageData {
  contactSettings: ContactSettingsData | null
  socialLinks: SocialLinkData[]
  contactMethods: ContactMethodItem[]
  ownerName: string
  locationSuffix: string
  serviceOptions: PublicContactServiceOption[]
}

export async function getPublicContactPageData(): Promise<PublicContactPageData> {
  const [contactSettings, socialLinks, services] = await Promise.all([
    getContactSettings(),
    getSocialLinks(),
    getActiveServices(),
  ])

  const ownerName = contactSettings?.ownerName || 'Paola Bolívar Nievas'
  const location = contactSettings?.location?.trim()
  const locationSuffix = location ? ` en ${location}` : ''
  const contactMethods = getVisibleContactMethods(contactSettings)
  // Solo nombre + id, lo que necesita el selector del formulario público.
  // La descripción completa se mantiene admin-side.
  const serviceOptions: PublicContactServiceOption[] = services.map((s) => ({
    id: s.id,
    name: s.name,
  }))

  return {
    contactSettings,
    socialLinks,
    contactMethods,
    ownerName,
    locationSuffix,
    serviceOptions,
  }
}
