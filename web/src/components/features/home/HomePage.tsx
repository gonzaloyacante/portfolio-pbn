import { getHomeSettings } from '@/actions/settings/home'
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedCategories from '@/components/features/home/FeaturedCategories'
import PublicTestimonialsSection from '@/components/features/testimonials/PublicTestimonialsSection'

/**
 * Homepage container.
 * Keeps route files thin while composing the public home feature.
 */
export default async function HomePage() {
  const homeSettings = await getHomeSettings()

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-between bg-(--background) transition-colors duration-500">
      <HeroSection settings={homeSettings} />

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

      <PublicTestimonialsSection />
    </main>
  )
}
