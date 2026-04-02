import { Metadata } from 'next'

// SEO configuration
export const seoConfig = {
  siteName: 'Portfolio Paola Bolívar Nievas',
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.paolabolivar.es',
  defaultTitle: 'Paola Bolívar Nievas | Maquilladora Profesional',
  defaultDescription:
    'Portfolio de Paola Bolívar Nievas - Maquilladora profesional especializada en audiovisuales, caracterización, efectos especiales y maquillaje social en Málaga, España.',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@paolabolivar', // Placeholder
  locale: 'es_ES',
}

// Generate generic metadata
export function generateMetadata({
  title,
  description,
  image,
  url,
  keywords,
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  url?: string
  keywords?: string | string[]
  noIndex?: boolean
}): Metadata {
  const fullTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle
  const fullDescription = description || seoConfig.defaultDescription
  const fullImage = image || seoConfig.defaultImage
  const fullUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type: 'website',
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: fullImage.startsWith('http') ? fullImage : `${seoConfig.siteUrl}${fullImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: seoConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage.startsWith('http') ? fullImage : `${seoConfig.siteUrl}${fullImage}`],
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

// Generate Person JSON-LD (Home Page)
export function generatePersonSchema(ownerName = 'Paola Bolívar Nievas', location = 'Málaga') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: ownerName,
    url: seoConfig.siteUrl,
    image: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
    jobTitle: 'Maquilladora Profesional',
    description: seoConfig.defaultDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location,
      addressCountry: 'ES',
    },
  }
}
