import type { Metadata } from 'next'
import { getPublicSiteUrl } from '@/lib/site-url'

type SiteSeoSettings = {
  siteName?: string | null
  defaultMetaTitle?: string | null
  defaultMetaDescription?: string | null
  defaultOgImage?: string | null
  allowIndexing?: boolean | null
}

type BuildSeoMetadataInput = {
  title: string
  description: string
  path?: string
  site?: SiteSeoSettings | null
  ownerName: string
  image?: string | null
  imageAlt?: string | null
  type?: 'website' | 'article' | 'profile'
  robots?: Metadata['robots']
  keywords?: string[]
}

export const SOCIAL_IMAGE = {
  width: 1200,
  height: 630,
  fallbackPath: '/opengraph-image',
} as const

export function absoluteUrl(urlOrPath: string, baseUrl = getPublicSiteUrl()): string {
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath
  const normalizedPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`
  return `${baseUrl}${normalizedPath}`
}

export function canonicalUrl(path = '/'): string {
  return absoluteUrl(path)
}

export function pickSocialImage(
  preferredImage?: string | null,
  site?: SiteSeoSettings | null
): string {
  return absoluteUrl(preferredImage || site?.defaultOgImage || SOCIAL_IMAGE.fallbackPath)
}

export function buildSeoMetadata({
  title,
  description,
  path = '/',
  site,
  ownerName,
  image,
  imageAlt,
  type = 'website',
  robots,
  keywords,
}: BuildSeoMetadataInput): Metadata {
  const baseUrl = getPublicSiteUrl()
  const siteName = site?.siteName || ownerName
  const canonical = absoluteUrl(path, baseUrl)
  const socialImage = pickSocialImage(image, site)
  const socialImageAlt = imageAlt || title
  const allowIndexing = site?.allowIndexing ?? true

  return {
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type,
      locale: 'es_ES',
      images: [
        {
          url: socialImage,
          width: SOCIAL_IMAGE.width,
          height: SOCIAL_IMAGE.height,
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
    robots:
      robots ??
      ({
        index: allowIndexing,
        follow: allowIndexing,
        googleBot: {
          index: allowIndexing,
          follow: allowIndexing,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      } satisfies Metadata['robots']),
  }
}
