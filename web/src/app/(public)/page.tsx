import { getHomeSettings } from '@/actions/settings/home'
import { getContactSettings } from '@/actions/settings/contact'
import { getSiteSettings } from '@/actions/settings/site'
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedCategories from '@/components/features/home/FeaturedCategories'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const [contact, site] = await Promise.all([getContactSettings(), getSiteSettings()])
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''
  const siteName = site?.siteName || ownerName

  const title = `${ownerName} | Maquilladora Profesional${locationSuffix}`
  const shortDesc = `Maquilladora y caracterizadora profesional${locationSuffix}. Bodas, editoriales, cine y teatro. Descubre mi portfolio.`

  return {
    title,
    description: `Portfolio profesional de ${ownerName}, maquilladora y caracterizadora${locationSuffix}, España. Especialista en bodas, editoriales, cine, teatro y eventos.`,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description: shortDesc,
      type: 'website',
      locale: 'es_ES',
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: shortDesc,
    },
  }
}

/**
 * Homepage
 * - Hero Section (Dynamic)
 * - Featured Galleries Grid (Dynamic)
 * - Testimonials moved to About Page
 */
export default async function Home() {
  const homeSettings = await getHomeSettings()

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-between bg-(--background) transition-colors duration-500">
      {/* Hero Section */}
      <HeroSection settings={homeSettings} />

      {/* Featured Images Section */}
      {homeSettings?.showFeaturedImages && (
        <FeaturedCategories
          title={homeSettings.featuredTitle}
          count={homeSettings.featuredCount}
          titleFont={homeSettings.featuredTitleFont}
          titleFontUrl={homeSettings.featuredTitleFontUrl}
          titleFontSize={homeSettings.featuredTitleFontSize}
          titleColor={homeSettings.featuredTitleColor}
          titleColorDark={homeSettings.featuredTitleColorDark}
        />
      )}
    </main>
  )
}
