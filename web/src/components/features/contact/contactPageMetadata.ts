import { getContactSettings } from '@/actions/settings/contact'
import { getSiteSettings } from '@/actions/settings/site'
import type { Metadata } from 'next'

export async function getContactPageMetadata(): Promise<Metadata> {
  const [contactSettings, site] = await Promise.all([getContactSettings(), getSiteSettings()])

  const ownerName = contactSettings?.ownerName || site?.siteName || 'Paola Bolívar Nievas'
  const location = contactSettings?.location?.trim()
  const locationSuffix = location ? ` en ${location}` : ''

  const title = `Contacto | ${ownerName}`
  const description = `Reserva tu sesión de maquillaje profesional${locationSuffix}. Presupuestos para bodas, editoriales, eventos y caracterización artística.`

  return {
    title,
    description,
    alternates: {
      canonical: '/contacto',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
