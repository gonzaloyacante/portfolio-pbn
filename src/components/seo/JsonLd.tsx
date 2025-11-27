interface JsonLdProps {
  type: 'Person' | 'ProfessionalService' | 'LocalBusiness'
  data?: {
    name?: string
    url?: string
    image?: string
    sameAs?: string[]
    jobTitle?: string
    address?: {
      streetAddress?: string
      addressLocality?: string
      addressRegion?: string
      postalCode?: string
      addressCountry?: string
    }
    priceRange?: string
    telephone?: string
    email?: string
  }
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-pbn.vercel.app'

  const defaultData = {
    name: 'Paola Bolívar Nievas',
    url: baseUrl,
    image: `${baseUrl}/og-image.jpg`,
    jobTitle: 'Professional Makeup Artist',
    sameAs: [
      // Agregar redes sociales reales cuando estén disponibles
      // 'https://instagram.com/paolamakeup',
      // 'https://facebook.com/paolamakeup',
    ],
    address: {
      addressLocality: 'Ciudad Autónoma de Buenos Aires',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    priceRange: '$$',
  }

  const mergedData = { ...defaultData, ...data }

  const generateSchema = () => {
    switch (type) {
      case 'Person':
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: mergedData.name,
          url: mergedData.url,
          image: mergedData.image,
          jobTitle: mergedData.jobTitle,
          sameAs: mergedData.sameAs,
          address: {
            '@type': 'PostalAddress',
            ...mergedData.address,
          },
        }

      case 'ProfessionalService':
        return {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: `${mergedData.name} - Makeup Artist`,
          url: mergedData.url,
          image: mergedData.image,
          priceRange: mergedData.priceRange,
          address: {
            '@type': 'PostalAddress',
            ...mergedData.address,
          },
          telephone: mergedData.telephone,
          email: mergedData.email,
          areaServed: {
            '@type': 'City',
            name: 'Ciudad Autónoma de Buenos Aires',
          },
          serviceType: [
            'Maquillaje de novias',
            'Maquillaje para eventos',
            'Maquillaje artístico',
            'Sesiones fotográficas',
            'Maquillaje editorial',
          ],
        }

      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: mergedData.name,
          image: mergedData.image,
          '@id': mergedData.url,
          url: mergedData.url,
          telephone: mergedData.telephone,
          priceRange: mergedData.priceRange,
          address: {
            '@type': 'PostalAddress',
            ...mergedData.address,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '10:00',
              closes: '14:00',
            },
          ],
          sameAs: mergedData.sameAs,
        }

      default:
        return null
    }
  }

  const schema = generateSchema()

  if (!schema) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}
