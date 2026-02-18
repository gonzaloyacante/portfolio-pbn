import { getHomeSettings } from '@/actions/settings/home'
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedProjects from '@/components/features/home/FeaturedProjects'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paola Bolívar Nievas | Maquilladora Profesional en Málaga',
  description:
    'Portfolio profesional de Paola Bolívar Nievas, maquilladora y caracterizadora en Málaga, España. Especialista en bodas, editoriales, cine, teatro y eventos.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Paola Bolívar Nievas | Maquilladora Profesional en Málaga',
    description:
      'Maquilladora y caracterizadora profesional en Málaga. Bodas, editoriales, cine y teatro. Descubre mi portfolio.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Paola Bolívar Nievas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paola Bolívar Nievas | Maquilladora Profesional en Málaga',
    description:
      'Maquilladora y caracterizadora profesional en Málaga. Bodas, editoriales, cine y teatro.',
  },
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
    <main className="flex w-full flex-1 flex-col items-center justify-between bg-[var(--background)] transition-colors duration-500">
      {/* Hero Section */}
      <HeroSection settings={homeSettings} />

      {/* Featured Projects Section */}
      {homeSettings?.showFeaturedProjects && (
        <FeaturedProjects title={homeSettings.featuredTitle} count={homeSettings.featuredCount} />
      )}
    </main>
  )
}
