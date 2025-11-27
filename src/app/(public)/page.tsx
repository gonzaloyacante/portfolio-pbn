import HeroSection from '@/components/public/HeroSection'
import TestimonialSlider from '@/components/public/TestimonialSlider'
import { getSiteConfig } from '@/actions/settings.actions'
import { getActiveTestimonials } from '@/lib/testimonials'
import { FadeIn, SlideIn } from '@/components/ui/Animations'

export default async function Home() {
  const siteConfig = await getSiteConfig()
  const testimonials = await getActiveTestimonials()

  return (
    <div className="flex flex-col gap-12">
      <FadeIn duration={0.8}>
        <HeroSection heroImageUrl={siteConfig?.heroImageUrl} title="Paola Bolívar Nievas" />
      </FadeIn>

      {testimonials.length > 0 && (
        <SlideIn direction="up" delay={0.3}>
          <section className="container mx-auto px-4 py-12">
            <h2 className="font-script text-primary mb-8 text-center text-4xl">
              Lo que dicen mis clientes
            </h2>
            <TestimonialSlider testimonials={testimonials} />
          </section>
        </SlideIn>
      )}
    </div>
  )
}
