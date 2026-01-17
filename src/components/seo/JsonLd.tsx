
interface JsonLdProps {
  type: 'Person' | 'ProfessionalService' | 'LocalBusiness' | 'CollectionPage' | 'CreativeWork'
  data?: {
    name?: string
    url?: string
    image?: string
    description?: string
    datePublished?: string
    author?: string
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
    mainEntity?: {
      name: string
      url: string
      image: string
    }[]
  }
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.paolabolivar.es'

  const defaultData = {
    name: 'Paola Bolívar Nievas',
    url: baseUrl,
    image: `${baseUrl}/og-image.jpg`,
    jobTitle: 'Professional Makeup Artist',
    sameAs: [],
    address: {
      addressLocality: 'Málaga',
      addressRegion: 'Málaga',
      addressCountry: 'ES',
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
            name: 'Málaga',
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
          ],
          sameAs: mergedData.sameAs,
        }

      case 'CollectionPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: mergedData.name,
          description: mergedData.description,
          url: mergedData.url,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: mergedData.mainEntity?.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: item.url,
              name: item.name,
              image: item.image,
            })),
          },
        }

      case 'CreativeWork':
        return {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: mergedData.name,
          description: mergedData.description,
          image: mergedData.image,
          url: mergedData.url,
          datePublished: mergedData.datePublished,
          author: {
            '@type': 'Person',
            name: mergedData.author || 'Paola Bolívar Nievas',
          },
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
