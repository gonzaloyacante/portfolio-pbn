import { getContactSettings, type ContactSettingsData } from '@/actions/settings/contact'
import { getSocialLinks, type SocialLinkData } from '@/actions/settings/social'
import { getVisibleContactMethods, type ContactMethodItem } from '../contactMethodUtils'

export interface PublicContactPageData {
  contactSettings: ContactSettingsData | null
  socialLinks: SocialLinkData[]
  contactMethods: ContactMethodItem[]
  ownerName: string
  locationSuffix: string
  instagramProfileUrl: string | null
  instagramProfileLabel: string | null
}

export async function getPublicContactPageData(): Promise<PublicContactPageData> {
  const [contactSettings, socialLinks] = await Promise.all([getContactSettings(), getSocialLinks()])

  const ownerName = contactSettings?.ownerName || 'Paola Bolívar Nievas'
  const location = contactSettings?.location?.trim()
  const locationSuffix = location ? ` en ${location}` : ''
  const contactMethods = getVisibleContactMethods(contactSettings)
  const instagramMethod = contactMethods.find((method) => method.id === 'instagram')

  return {
    contactSettings,
    socialLinks,
    contactMethods,
    ownerName,
    locationSuffix,
    instagramProfileUrl: instagramMethod?.href ?? null,
    instagramProfileLabel: instagramMethod?.value ?? null,
  }
}
