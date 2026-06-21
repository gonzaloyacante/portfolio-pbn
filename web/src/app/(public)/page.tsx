import { getContactSettings } from '@/actions/settings/contact'
import { getHomeSettings } from '@/actions/settings/home'
import { getSiteSettings } from '@/actions/settings/site'
import HomePage from '@/components/features/home/HomePage'
import JsonLd from '@/components/seo/JsonLd'
import { Metadata } from 'next'
import { ROUTES } from '@/config/routes'
import { buildSeoMetadata } from '@/lib/seo-metadata'
import { getPublicSiteUrl } from '@/lib/site-url'

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
    // OG image: SOLO backdrop. La imagen destacada es OTRA cosa.
    image: home?.heroBackdropUrl || site?.defaultOgImage,
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
  const [contact, site] = await Promise.all([getContactSettings(), getSiteSettings()])
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''
  const description =
    site?.defaultMetaDescription ||
    `Maquilladora y caracterizadora profesional${locationSuffix}. Bodas, editoriales, cine, teatro y eventos. Descubre mi portfolio.`

  return (
    <>
      <JsonLd
        type="WebPage"
        data={{
          name: `${ownerName} | Maquilladora Profesional${locationSuffix}`,
          description,
          url: getPublicSiteUrl(),
          speakableCssSelectors: ['h1', '.public-hero-title-secondary', 'meta[name="description"]'],
        }}
      />
      <HomePage />
    </>
  )
}
