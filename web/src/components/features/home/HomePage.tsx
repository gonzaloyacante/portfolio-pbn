import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Heart } from 'lucide-react'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { getHomeSettings } from '@/actions/settings/home'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import { cn } from '@/lib/utils'
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedCategories from '@/components/features/home/FeaturedCategories'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { ROUTES } from '@/config/routes'

function toBackgroundUrl(url?: string | null) {
  return url ? `url("${url.replace(/"/g, '\\"')}")` : undefined
}

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
  const testimonials = testimonialsInLayout ? [] : await getActiveTestimonials(9)
  const showFeatured = homeSettings?.showFeaturedImages === true
  // Backdrop: SOLO campos del backdrop. La imagen destacada es OTRA cosa.
  const desktopBackgroundUrl =
    homeSettings?.heroBackdropUrl || homeSettings?.heroBackdropPosterUrl || undefined
  const homeBackgroundStyle = {
    '--public-home-background-image': toBackgroundUrl(desktopBackgroundUrl),
    '--public-home-background-position': homeSettings?.heroBackdropObjectPosition || 'center',
  } as CSSProperties

  return (
    <div
      className={cn(
        'public-home-page relative isolate w-full flex-1 transition-colors duration-500'
      )}
      style={homeBackgroundStyle}
    >
      <div
        aria-hidden
        className="public-home-page-background pointer-events-none absolute inset-x-0 top-0 h-[100svh]"
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-between">
        <HeroSection settings={homeSettings} />

        {showFeatured && (
          <FeaturedCategories
            title={homeSettings.featuredTitle}
            count={homeSettings.featuredCount}
            titleFont={homeSettings.featuredTitleFont}
            titleFontUrl={homeSettings.featuredTitleFontUrl}
            titleFontSize={homeSettings.featuredTitleFontSize}
            // titleColor={homeSettings.featuredTitleColor}
            // titleColorDark={homeSettings.featuredTitleColorDark}
            ambientUnderlay
          />
        )}

        {!testimonialsInLayout && testimonials.length > 0 && (
          <div className="public-testimonial-section w-full border-t py-12 transition-colors duration-500 lg:py-14">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
              <h2 className="public-testimonial-title font-heading mb-12 text-center text-3xl font-bold">
                {testimonialSettings?.title || 'Lo que dicen mis clientes'}
              </h2>

              <TestimonialSlider
                testimonials={testimonials}
                autoAdvanceMs={testimonialSettings?.sliderAutoAdvanceMs}
              />

              <div className="mt-12 flex justify-center">
                <Link
                  href={ROUTES.public.testimonialForm}
                  className="public-testimonial-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90"
                >
                  <Heart size={16} />
                  ¿Fuiste mi clienta? Deja tu opinión
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
