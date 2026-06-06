import { getContactSettings } from '@/actions/settings/contact'
import { getHomeSettings } from '@/actions/settings/home'
import { getSiteSettings } from '@/actions/settings/site'
import HomePage from '@/components/features/home/HomePage'
import { Metadata } from 'next'
import { ROUTES } from '@/config/routes'
import { buildSeoMetadata } from '@/lib/seo-metadata'

/** Cache segmento público — invalidación explícita desde CMS. */
export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const [contact, site, home] = await Promise.all([
    getContactSettings(),
    getSiteSettings(),
    getHomeSettings(),
  ])
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''

  const title = `${ownerName} | Maquilladora Profesional${locationSuffix}`
  const shortDesc = `Maquilladora y caracterizadora profesional${locationSuffix}. Bodas, editoriales, cine, teatro y eventos. Descubre mi portfolio.`

  return buildSeoMetadata({
    title,
    description: shortDesc,
    path: ROUTES.home,
    site,
    ownerName,
    image: home?.heroBackdropUrl || home?.heroMainImageUrl || site?.defaultOgImage,
    imageAlt: `${ownerName} - maquillaje profesional${locationSuffix}`,
    keywords: [
      `maquilladora profesional${locationSuffix}`,
      `maquillaje profesional${locationSuffix}`,
      'caracterización',
      'efectos especiales',
      'maquillaje editorial',
      'maquillaje para cine y teatro',
    ],
  })
}

export default async function Home() {
  return <HomePage />
}
