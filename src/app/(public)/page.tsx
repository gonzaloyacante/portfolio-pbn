import HeroSection from '@/components/public/HeroSection'
import TestimonialSlider from '@/components/public/TestimonialSlider'
import { getSiteConfig } from '@/actions/settings.actions'
import { getActiveTestimonials } from '@/lib/testimonials'
import { FadeIn, SlideIn } from '@/components/ui'
import { generateMetadata, generatePersonSchema } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMetadata({
  title: 'Inicio | Portfolio Paola Bolívar Nievas',
  description:
    'Portfolio de Paola Bolívar Nievas - Maquilladora profesional especializada en audiovisuales, caracterización y efectos especiales en Málaga, España.',
  keywords: [
    'maquilladora málaga',
    'caracterización profesional',
    'efectos especiales maquillaje',
    'maquillaje audiovisual',
  ],
})

export default async function Home() {
  const [siteConfig, testimonials] = await Promise.all([getSiteConfig(), getActiveTestimonials()])
  const personSchema = generatePersonSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <FadeIn duration={0.6}>
        <HeroSection
          heroImageUrl={siteConfig?.heroImageUrl}
          silhouetteImageUrl={siteConfig?.silhouetteImageUrl}
          ownerName={siteConfig?.ownerName}
          heroTitle1={siteConfig?.heroTitle1}
          heroTitle2={siteConfig?.heroTitle2}
        />
      </FadeIn>

      {testimonials.length > 0 && (
        <SlideIn direction="up" delay={0.2}>
          <section className="px-4 py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto">
              <h2
                className="font-script mb-8 text-center text-4xl"
                style={{ color: 'var(--color-text)' }}
              >
                Lo que dicen mis clientes
              </h2>
              <TestimonialSlider testimonials={testimonials} />
            </div>
          </section>
        </SlideIn>
      )}
    </>
  )
}
