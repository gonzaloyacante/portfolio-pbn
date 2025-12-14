import { Metadata } from 'next'

/**
 * Utilidades para SEO y metadata dinámica
 */

const SITE_NAME = 'Portfolio Paola Bolívar Nievas'
const SITE_DESCRIPTION =
  'Maquilladora profesional especializada en audiovisuales, caracterización, efectos especiales y maquillaje social. Portfolio de trabajos en cine, teatro y sesiones fotográficas.'
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-pbn.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  keywords?: string[]
}

/**
 * Generar metadata completa para SEO
 */
export function generateSEOMetadata({
  title,
  description = SITE_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  url = SITE_URL,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Paola Bolívar Nievas',
  keywords = [],
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const defaultKeywords = [
    'maquilladora profesional',
    'caracterización',
    'efectos especiales',
    'maquillaje audiovisual',
    'maquillaje teatro',
    'maquillaje cine',
    'portfolio maquillaje',
    'Paola Bolívar Nievas',
  ]

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: author }],
    creator: author,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: 'es_ES',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@paolamakeup',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}

/**
 * JSON-LD para Schema.org (SEO estructurado)
 */
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Paola Bolívar Nievas',
    jobTitle: 'Maquilladora Profesional',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    sameAs: [
      'https://www.instagram.com/paolamakeup', // Actualizar con URL real
    ],
    knowsAbout: [
      'Maquillaje profesional',
      'Caracterización',
      'Efectos especiales',
      'Maquillaje audiovisual',
      'Posticería',
    ],
  }
}

export function generatePortfolioSchema(
  projects: Array<{ title: string; description: string; image: string; date: Date }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: {
      '@type': 'Person',
      name: 'Paola Bolívar Nievas',
    },
    workExample: projects.map((project) => ({
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      image: project.image,
      dateCreated: project.date.toISOString(),
    })),
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}
