import type { Metadata } from 'next'
import { getContactSettings } from '@/actions/settings/contact'
import { ROUTES } from '@/config/routes'
import { getSiteSettings } from '@/actions/settings/site'
import { buildSeoMetadata } from '@/lib/seo-metadata'

export async function generateContactPageMetadata(): Promise<Metadata> {
  const [contactSettings, site] = await Promise.all([getContactSettings(), getSiteSettings()])
  const ownerName = contactSettings?.ownerName || 'Paola Bolívar Nievas'
  const location = contactSettings?.location?.trim()
  const locationSuffix = location ? ` en ${location}` : ''
  const description = `Reserva tu sesión de maquillaje profesional${locationSuffix}. Presupuestos para bodas, editoriales, eventos y caracterización artística.`

  return buildSeoMetadata({
    title: `Contacto | ${ownerName}`,
    description,
    path: ROUTES.public.contact,
    site,
    ownerName,
    image: contactSettings?.illustrationUrl || site?.defaultOgImage,
    imageAlt: `Contacto de ${ownerName}`,
    keywords: ['contacto maquilladora', 'reserva maquillaje profesional', ownerName],
  })
}
