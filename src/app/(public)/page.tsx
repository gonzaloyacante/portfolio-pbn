import { getHomeSettings } from '@/actions/theme.actions'
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedProjects from '@/components/features/home/FeaturedProjects'
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
    <main className="flex flex-col items-center justify-between">
      {/* Hero Section */}
      <HeroSection settings={homeSettings} />

      {/* Featured Projects Section */}
      {homeSettings?.showFeaturedProjects && (
        <FeaturedProjects title={homeSettings.featuredTitle} count={homeSettings.featuredCount} />
      )}
    </main>
  )
}
