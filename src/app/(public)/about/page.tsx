import { getAboutSettings } from '@/actions/settings/about'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import JsonLd from '@/components/seo/JsonLd'
import { AboutBioColumn, AboutProfileImage } from '@/components/features/about/AboutBioSection'
import { AboutTestimonialsSection } from '@/components/features/about/AboutTestimonialsSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description:
    'Conoce a Paola Bolívar Nievas, maquilladora profesional y caracterizadora en Málaga. Más de 10 años de experiencia en bodas, editoriales y caracterización artística.',
  alternates: {
    canonical: '/sobre-mi',
  },
  openGraph: {
    title: 'Sobre Mí | Paola Bolívar Nievas',
    description:
      'Conoce a Paola Bolívar Nievas, maquilladora profesional y caracterizadora en Málaga. Bodas, editoriales, cine y teatro.',
    type: 'profile',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Mí | Paola Bolívar Nievas',
    description:
      'Maquilladora profesional y caracterizadora en Málaga. Bodas, editoriales, cine y teatro.',
  },
}

function buildJsonLdData(aboutSettings: Awaited<ReturnType<typeof getAboutSettings>>) {
  return {
    name: 'Paola Bolívar Nievas',
    description: aboutSettings?.bioIntro || undefined,
    image: aboutSettings?.profileImageUrl || undefined,
    jobTitle: 'Professional Makeup Artist',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/sobre-mi`,
  }
}

/**
 * About Page - Canva Design
 * Mínima complejidad ciclomática: toda lógica delegada a sub-componentes.
 */
export default async function AboutPage() {
  const [testimonials, aboutSettings, testimonialSettings] = await Promise.all([
    getActiveTestimonials(6),
    getAboutSettings(),
    getTestimonialSettings(),
  ])

  const showTestimonials = testimonialSettings?.showOnAbout ?? true

  return (
    <section className="w-full bg-(--background) transition-colors duration-500">
      <JsonLd type="Person" data={buildJsonLdData(aboutSettings)} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-6 py-8 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        <AboutBioColumn
          bioTitle={aboutSettings?.bioTitle || 'Hola, soy Paola.'}
          bioIntro={aboutSettings?.bioIntro || ''}
          bioDescription={aboutSettings?.bioDescription || ''}
          illustrationUrl={aboutSettings?.illustrationUrl}
          illustrationAlt={aboutSettings?.illustrationAlt || 'Ilustración'}
          skills={aboutSettings?.skills || []}
          certifications={aboutSettings?.certifications || []}
        />

        <AboutProfileImage
          profileImageUrl={aboutSettings?.profileImageUrl}
          profileImageAlt={aboutSettings?.profileImageAlt || 'Paola Bolívar Nievas'}
          shape={aboutSettings?.profileImageShape ?? 'ellipse'}
        />
      </div>

      {showTestimonials && (
        <AboutTestimonialsSection
          testimonials={testimonials}
          title={testimonialSettings?.title || 'Lo que dicen mis clientes'}
        />
      )}
    </section>
  )
}
