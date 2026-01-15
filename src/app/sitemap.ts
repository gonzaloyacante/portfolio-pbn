import { prisma } from '@/lib/db'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.paolabolivar.es'

  // Static routes
  const routes = ['', '/sobre-mi', '/contacto', '/proyectos'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic projects
  const projects = await prisma.project.findMany({
    where: { isDeleted: false },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/proyecto/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic categories
  const categories = await prisma.category.findMany({
    select: {
      name: true, // Categories might not have slugs yet, filtering is via /proyectos?cat=ID usually.
      // If we don't have category pages dedicated, we can skip or use query param URLs (canonical issues).
      // For now, let's skip categories as individual pages if they don't have dedicated routes.
      // Based on previous analysis, category filtering happens in /proyectos list.
    },
  })

  // NOTE: If we implement /categoria/[slug] later, add here.

  return [...routes, ...projectRoutes]
}
