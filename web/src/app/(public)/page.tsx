import { getContactSettings } from '@/actions/settings/contact'
import { getSiteSettings } from '@/actions/settings/site'
import HomePage from '@/components/features/home/HomePage'
import { Metadata } from 'next'
import { ROUTES } from '@/config/routes'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [contact, site] = await Promise.all([getContactSettings(), getSiteSettings()])
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''
  const siteName = site?.siteName || ownerName
  const ogImage = site?.defaultOgImage || undefined

  const title = `${ownerName} | Maquilladora Profesional${locationSuffix}`
  const shortDesc = `Maquilladora y caracterizadora profesional${locationSuffix}. Bodas, editoriales, cine y teatro. Descubre mi portfolio.`

  return {
    title,
    description: `Portfolio profesional de ${ownerName}, maquilladora y caracterizadora${locationSuffix}, España. Especialista en bodas, editoriales, cine, teatro y eventos.`,
    alternates: {
      canonical: ROUTES.home,
    },
    openGraph: {
      title,
      description: shortDesc,
      type: 'website',
      locale: 'es_ES',
      siteName,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: ownerName }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: shortDesc,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default async function Home() {
  return <HomePage />
}
