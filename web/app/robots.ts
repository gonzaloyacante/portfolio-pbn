import type { MetadataRoute } from 'next'

const env = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || 'development'
const defaultUrl = env === 'production' ? 'https://portfolio-pbn.vercel.app' : 'https://dev-portfolio-pbn.vercel.app'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultUrl

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
