import { getHomeSettings } from '@/actions/theme.actions'
import HeroSection from '@/components/public/HeroSection'
import FeaturedProjects from '@/components/public/FeaturedProjects'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Portfolio profesional de maquillaje y caracterización.',
}

/**
 * Homepage
 * - Hero Section (Dynamic)
 * - Featured Projects Grid (Dynamic)
 * - Testimonials moved to About Page
 */
export default async function Home() {
  const homeSettings = await getHomeSettings()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <HeroSection settings={homeSettings} />

      {/* Featured Projects Section */}
      {homeSettings?.showFeaturedProjects && (
        <FeaturedProjects
          title={homeSettings.featuredTitle}
          count={homeSettings.featuredCount}
        />
      )}
    </main>
  )
}
