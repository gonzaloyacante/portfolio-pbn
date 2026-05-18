import { getContactSettings, type ContactSettingsData } from '@/actions/settings/contact'
import { getSocialLinks, type SocialLinkData } from '@/actions/settings/social'
import { getVisibleContactMethods, type ContactMethodItem } from '../contactMethodUtils'

export interface PublicContactPageData {
  contactSettings: ContactSettingsData | null
  socialLinks: SocialLinkData[]
  contactMethods: ContactMethodItem[]
  ownerName: string
  locationSuffix: string
}

export async function getPublicContactPageData(): Promise<PublicContactPageData> {
  const [contactSettings, socialLinks] = await Promise.all([getContactSettings(), getSocialLinks()])

  const ownerName = contactSettings?.ownerName || 'Paola Bolívar Nievas'
  const location = contactSettings?.location?.trim()
  const locationSuffix = location ? ` en ${location}` : ''
  const contactMethods = getVisibleContactMethods(contactSettings)

  return {
    contactSettings,
    socialLinks,
    contactMethods,
    ownerName,
    locationSuffix,
  }
}
