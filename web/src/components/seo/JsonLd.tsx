import { getPublicSiteUrl } from '@/lib/site-url'

interface JsonLdProps {
  type:
    | 'Person'
    | 'ProfessionalService'
    | 'LocalBusiness'
    | 'CollectionPage'
    | 'CreativeWork'
    | 'Service'
    | 'ImageGallery'
    | 'BreadcrumbList'
  data?: {
    name?: string
    url?: string
    image?: string
    description?: string
    datePublished?: string
    author?: string
    providerName?: string
    offers?: { name: string; price: number }[]
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
    serviceType?: string[]
    aggregateRating?: { ratingValue: number; reviewCount: number; bestRating?: number }
    mainEntity?: {
      name: string
      url: string
      image: string
    }[]
    breadcrumbs?: {
      name: string
      url: string
    }[]
  }
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const baseUrl = getPublicSiteUrl()

  const defaultData = {
    name: '',
    url: baseUrl,
    image: '',
    jobTitle: 'Maquilladora Profesional',
    providerName: 'Paola Bolívar Nievas',
    offers: [] as { name: string; price: number }[],
    sameAs: [],
    address: {
      addressLocality: '',
      addressRegion: '',
      addressCountry: 'ES',
    },
    priceRange: '$$',
  }

  const mergedData = {
    ...defaultData,
    ...data,
    address: { ...defaultData.address, ...data?.address },
    offers: data?.offers ?? defaultData.offers,
  }

  const generateSchema = () => {
    switch (type) {
      case 'Person':
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: mergedData.name,
          url: mergedData.url,
          image: mergedData.image,
          description: mergedData.description,
          jobTitle: mergedData.jobTitle,
          sameAs: mergedData.sameAs,
          address: {
            '@type': 'PostalAddress',
            ...mergedData.address,
          },
        }

      case 'ProfessionalService': {
        const addr = {
          '@type': 'PostalAddress',
          ...mergedData.address,
        }
        // Drop empty-string fields — they mislead crawlers
        if (!addr.addressRegion) delete (addr as Record<string, unknown>).addressRegion
        if (!addr.streetAddress) delete (addr as Record<string, unknown>).streetAddress
        if (!addr.postalCode) delete (addr as Record<string, unknown>).postalCode

        const serviceTypes = data?.serviceType ?? [
          'Maquillaje de novias',
          'Maquillaje para eventos',
          'Maquillaje artístico',
          'Sesiones fotográficas',
          'Maquillaje editorial',
          'Caracterización artística',
          'Efectos especiales (FX)',
          'Posticería profesional',
          'Maquillaje para teatro',
        ]

        return {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${mergedData.url}#professional-service`,
          name: mergedData.name,
          url: mergedData.url,
          image: mergedData.image || undefined,
          description: mergedData.description,
          priceRange: mergedData.priceRange,
          address: addr,
          telephone: mergedData.telephone || undefined,
          email: mergedData.email || undefined,
          sameAs: mergedData.sameAs?.length ? mergedData.sameAs : undefined,
          areaServed: {
            '@type': 'City',
            name: mergedData.address?.addressLocality || 'España',
          },
          serviceType: serviceTypes,
          ...(data?.aggregateRating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: data.aggregateRating.ratingValue,
              reviewCount: data.aggregateRating.reviewCount,
              bestRating: data.aggregateRating.bestRating ?? 5,
              worstRating: 1,
            },
          }),
        }
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
            name: mergedData.author || mergedData.name,
          },
        }

      case 'Service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: mergedData.name,
          description: mergedData.description,
          url: mergedData.url,
          image: mergedData.image,
          provider: {
            '@type': 'Person',
            name: mergedData.providerName,
            url: baseUrl,
          },
          areaServed: {
            '@type': 'City',
            name: mergedData.address?.addressLocality || 'España',
          },
          ...(mergedData.offers.length > 0 && {
            offers: mergedData.offers.map((offer) => ({
              '@type': 'Offer',
              name: offer.name,
              price: offer.price,
              priceCurrency: 'EUR',
            })),
          }),
        }

      case 'ImageGallery':
        return {
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: mergedData.name,
          description: mergedData.description,
          url: mergedData.url,
        }

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.breadcrumbs?.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
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
