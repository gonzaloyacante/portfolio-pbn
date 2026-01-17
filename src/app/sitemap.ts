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
    ROUTES.public.projects,
  ].map((route) => ({
    url: `${baseUrl}${route === '/' ? '' : route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === ROUTES.home ? 1 : 0.8,
  }))

  // Dynamic projects
  const projects = await prisma.project.findMany({
    where: { isDeleted: false, isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  })

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}${ROUTES.public.projects}/${project.category.slug}/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      // updatedAt: true, // Not available in Category model
    },
  })

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}${ROUTES.public.projects}/${category.slug}`,
    lastModified: new Date(), // Fallback to current date
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categoryRoutes, ...projectRoutes]
}
