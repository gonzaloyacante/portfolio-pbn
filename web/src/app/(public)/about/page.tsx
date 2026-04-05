import { getAboutSettings } from '@/actions/settings/about'
import { getContactSettings } from '@/actions/settings/contact'
import JsonLd from '@/components/seo/JsonLd'
import { AboutBioColumn, AboutProfileImage } from '@/components/features/about/AboutBioSection'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactSettings()
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''

  return {
    title: 'Sobre Mí',
    description: `Conoce a ${ownerName}, maquilladora profesional y caracterizadora${locationSuffix}. Más de 10 años de experiencia en bodas, editoriales y caracterización artística.`,
    alternates: {
      canonical: '/sobre-mi',
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
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/sobre-mi`,
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
  const [aboutSettings, contact] = await Promise.all([getAboutSettings(), getContactSettings()])

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''

  return (
    <section className="w-full bg-(--background) transition-colors duration-500">
      <JsonLd type="Person" data={buildJsonLdData(aboutSettings, ownerName, location)} />

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
    </section>
  )
}
