import { prisma } from '@/lib/db'
import { MetadataRoute } from 'next'
import { ROUTES } from '@/config/routes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.paolabolivar.es'

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
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === ROUTES.home ? 1 : 0.8,
  }))

  // Dynamic categories
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    select: {
      slug: true,
    },
  })

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}${ROUTES.public.portfolio}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic services
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}${ROUTES.public.services}/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categoryRoutes, ...serviceRoutes]
}
