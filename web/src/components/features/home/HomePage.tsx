import { getHomeSettings } from '@/actions/settings/home'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import { cn } from '@/lib/utils'
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedCategories from '@/components/features/home/FeaturedCategories'
import PublicTestimonialsSection from '@/components/features/testimonials/PublicTestimonialsSection'

/**
 * Homepage container.
 * Keeps route files thin while composing the public home feature.
 */
export default async function HomePage() {
  const [homeSettings, testimonialSettings] = await Promise.all([
    getHomeSettings(),
    getTestimonialSettings(),
  ])

  const testimonialsInLayout = testimonialSettings?.showOnAll === true
  const immersive = homeSettings?.heroImmersiveEnabled === true
  const showFeatured = homeSettings?.showFeaturedImages === true

  return (
    <div
      className={cn(
        'relative z-10 flex w-full flex-1 flex-col items-center justify-between transition-colors duration-500',
        immersive ? 'bg-transparent' : 'bg-(--background)'
      )}
    >
      <HeroSection settings={homeSettings} />

      {showFeatured && (
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

      {!testimonialsInLayout && <PublicTestimonialsSection />}
    </div>
  )
}
