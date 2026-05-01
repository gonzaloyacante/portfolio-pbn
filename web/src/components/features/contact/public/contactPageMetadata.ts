import type { Metadata } from 'next'
import { getContactSettings } from '@/actions/settings/contact'
import { ROUTES } from '@/config/routes'

export async function generateContactPageMetadata(): Promise<Metadata> {
  const contactSettings = await getContactSettings()
  const ownerName = contactSettings?.ownerName || 'Paola Bolívar Nievas'
  const location = contactSettings?.location?.trim()
  const locationSuffix = location ? ` en ${location}` : ''

  return {
    title: 'Contacto',
    description: `Reserva tu sesión de maquillaje profesional${locationSuffix}. Presupuestos para bodas, editoriales, eventos y caracterización artística.`,
    alternates: {
      canonical: ROUTES.public.contact,
    },
    openGraph: {
      title: `Contacto | ${ownerName}`,
      description: `Reserva tu sesión de maquillaje profesional${locationSuffix}. Bodas, editoriales, eventos y caracterización artística.`,
      type: 'website',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary',
      title: `Contacto | ${ownerName}`,
      description: `Reserva tu sesión de maquillaje profesional${locationSuffix}.`,
    },
  }
}
