import HeroSection from '@/components/public/HeroSection'
import TestimonialSlider from '@/components/public/TestimonialSlider'
import { getSiteConfig } from '@/actions/settings.actions'
import { getActiveTestimonials } from '@/lib/testimonials'
import { FadeIn, SlideIn } from '@/components/ui/Animations'
import { generateSEOMetadata, generatePersonSchema } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Inicio',
  description:
    'Portfolio de Paola Bolívar Nievas - Maquilladora profesional especializada en audiovisuales, caracterización y efectos especiales.',
  keywords: ['maquilladora málaga', 'caracterización profesional', 'efectos especiales maquillaje'],
})

export default async function Home() {
  const siteConfig = await getSiteConfig()
  const testimonials = await getActiveTestimonials()
  const personSchema = generatePersonSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <FadeIn duration={0.8}>
        <HeroSection heroImageUrl={siteConfig?.heroImageUrl} title="Paola Bolívar Nievas" />
      </FadeIn>

      {testimonials.length > 0 && (
        <SlideIn direction="up" delay={0.3}>
          <section className="container mx-auto px-4 pb-12">
            <h2 className="font-script text-primary mb-8 text-center text-4xl">
              Lo que dicen mis clientes
            </h2>
            <TestimonialSlider testimonials={testimonials} />
          </section>
        </SlideIn>
      )}
    </>
  )
}
