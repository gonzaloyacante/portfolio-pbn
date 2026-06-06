import { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getPublicSiteUrl } from '@/lib/site-url'
import { prisma } from '@/lib/db'
import { CACHE_DURATIONS, CACHE_TAGS } from '@/lib/cache-tags'

export const revalidate = false

const getRobotsSettings = unstable_cache(
  async () =>
    prisma.siteSettings.findFirst({
      select: { allowIndexing: true },
    }),
  ['public-robots-settings'],
  { revalidate: CACHE_DURATIONS.VERY_LONG, tags: [CACHE_TAGS.siteSettings] }
)

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = getPublicSiteUrl()
  const settings = await getRobotsSettings()
  const allowIndexing = settings?.allowIndexing ?? true

  return {
    rules: allowIndexing
      ? {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin/', '/api/'],
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
