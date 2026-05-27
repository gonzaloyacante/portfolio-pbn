import { getAboutSettings } from '@/actions/settings/about'
import { getContactSettings } from '@/actions/settings/contact'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import JsonLd from '@/components/seo/JsonLd'
import { AboutBioColumn, AboutProfileImage } from '@/components/features/about/AboutBioSection'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { Metadata } from 'next'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { getPublicSiteUrl } from '@/lib/site-url'

/** Cache público — invalidación explícita desde CMS. */
export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactSettings()
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''

  return {
    title: 'Sobre Mí',
    description: `Conoce a ${ownerName}, maquilladora profesional y caracterizadora${locationSuffix}. Más de 10 años de experiencia en bodas, editoriales y caracterización artística.`,
    alternates: {
      canonical: ROUTES.public.about,
    },
    openGraph: {
      title: `Sobre Mí | ${ownerName}`,
      description: `Conoce a ${ownerName}, maquilladora profesional y caracterizadora${locationSuffix}. Bodas, editoriales, cine y teatro.`,
      type: 'profile',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Sobre Mí | ${ownerName}`,
      description: `Maquilladora profesional y caracterizadora${locationSuffix}. Bodas, editoriales, cine y teatro.`,
    },
  }
}

function buildJsonLdData(
  aboutSettings: Awaited<ReturnType<typeof getAboutSettings>>,
  ownerName: string,
  location: string
) {
  return {
    name: ownerName,
    description: aboutSettings?.bioIntro || undefined,
    image: aboutSettings?.profileImageUrl || undefined,
    jobTitle: 'Maquilladora Profesional',
    url: `${getPublicSiteUrl()}${ROUTES.public.about}`,
    address: {
      addressLocality: location,
      addressCountry: 'ES',
    },
  }
}

/**
 * About Page - Canva Design
 * Mínima complejidad ciclomática: toda lógica delegada a sub-componentes.
 */
export default async function AboutPage() {
  const [aboutSettings, contact, testimonials, testimonialSettings] = await Promise.all([
    getAboutSettings(),
    getContactSettings(),
    getActiveTestimonials(9),
    getTestimonialSettings(),
  ])

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''

  return (
    <section className="public-about-page w-full transition-colors duration-500">
      <JsonLd type="Person" data={buildJsonLdData(aboutSettings, ownerName, location)} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-4 py-8 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        <AboutBioColumn
          bioTitle={aboutSettings?.bioTitle || 'Hola, soy Paola.'}
          bioIntro={aboutSettings?.bioIntro || ''}
          bioDescription={aboutSettings?.bioDescription || ''}
          illustrationUrl={aboutSettings?.illustrationUrl}
          illustrationAlt={aboutSettings?.illustrationAlt || 'Ilustración'}
          illustrationMaxPx={aboutSettings?.illustrationMaxPx}
          illustrationMobileMaxPx={aboutSettings?.illustrationMobileMaxPx}
          bioTitleFont={aboutSettings?.bioTitleFont}
          bioTitleFontUrl={aboutSettings?.bioTitleFontUrl}
          bioTitleFontSize={aboutSettings?.bioTitleFontSize}
          bioTitleMobileFontSize={aboutSettings?.bioTitleMobileFontSize}
          // bioTitleColor={aboutSettings?.bioTitleColor}
          // bioTitleColorDark={aboutSettings?.bioTitleColorDark}
          skills={aboutSettings?.skills || []}
          certifications={aboutSettings?.certifications || []}
        />

        <AboutProfileImage
          profileImageUrl={aboutSettings?.profileImageUrl}
          profileImageAlt={aboutSettings?.profileImageAlt || 'Paola Bolívar Nievas'}
          shape={aboutSettings?.profileImageShape ?? 'ellipse'}
          shadowEnabled={aboutSettings?.profileImageShadowEnabled ?? true}
          shadowBlur={aboutSettings?.profileImageShadowBlur}
          shadowSpread={aboutSettings?.profileImageShadowSpread}
          shadowOffsetX={aboutSettings?.profileImageShadowOffsetX}
          shadowOffsetY={aboutSettings?.profileImageShadowOffsetY}
          // shadowColor={aboutSettings?.profileImageShadowColor}
          shadowOpacity={aboutSettings?.profileImageShadowOpacity}
        />
      </div>

      {testimonials.length > 0 && (
        <div className="public-about-testimonials-section border-t py-12 transition-colors duration-500 lg:py-14">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <h2 className="public-about-testimonial-title font-heading mb-12 text-center text-3xl font-bold">
              {testimonialSettings?.title || 'Lo que dicen mis clientes'}
            </h2>

            <TestimonialSlider
              testimonials={testimonials}
              autoAdvanceMs={testimonialSettings?.sliderAutoAdvanceMs}
            />

            <div className="mt-12 flex justify-center">
              <Link
                href={ROUTES.public.testimonialForm}
                className="public-about-testimonial-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90"
              >
                <Heart size={16} />
                ¿Fuiste mi clienta? Deja tu opinión
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
