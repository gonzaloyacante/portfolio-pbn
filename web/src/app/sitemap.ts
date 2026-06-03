import { prisma } from '@/lib/db'
import { MetadataRoute } from 'next'
import { ROUTES } from '@/config/routes'
import { unstable_cache } from 'next/cache'
import { CACHE_DURATIONS, CACHE_TAGS } from '@/lib/cache-tags'
import { getPublicSiteUrl } from '@/lib/site-url'

export const revalidate = false

const DEFAULT_LAST_MODIFIED = new Date('2024-01-01T00:00:00.000Z')

const getSitemapData = unstable_cache(
  async () => {
    const [siteSettings, categories, services] = await Promise.all([
      prisma.siteSettings.findFirst({
        select: { updatedAt: true },
      }),
      prisma.category.findMany({
        where: { deletedAt: null, isActive: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      prisma.service.findMany({
        where: { deletedAt: null, isActive: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ])

    return { siteSettings, categories, services }
  },
  ['public-sitemap-data'],
  {
    revalidate: CACHE_DURATIONS.VERY_LONG,
    tags: [CACHE_TAGS.siteSettings, CACHE_TAGS.categories, CACHE_TAGS.services],
  }
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getPublicSiteUrl()
  const { siteSettings, categories, services } = await getSitemapData()
  const staticLastModified = siteSettings?.updatedAt ?? DEFAULT_LAST_MODIFIED

  // Static routes
  const routes = [
    ROUTES.home,
    ROUTES.public.about,
    ROUTES.public.contact,
    ROUTES.public.portfolio,
    ROUTES.public.services,
    ROUTES.public.privacy,
  ].map((route) => ({
    url: `${baseUrl}${route === '/' ? '' : route}`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly' as const,
    priority: route === ROUTES.home ? 1 : 0.8,
  }))

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}${ROUTES.public.portfolio}/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}${ROUTES.public.services}/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categoryRoutes, ...serviceRoutes]
}
