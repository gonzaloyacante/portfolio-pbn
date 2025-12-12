import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-pbn.vercel.app'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    // Dynamic category routes
    const categories = await prisma.category.findMany({
      select: { slug: true },
    })

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/proyectos/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }))

    // Dynamic project detail routes (only active projects)
    const projects = await prisma.project.findMany({
      where: { isDeleted: false },
      select: { id: true, date: true },
    })

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/proyecto/${project.id}`,
      lastModified: new Date(project.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...categoryRoutes, ...projectRoutes]
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error)
    return staticRoutes
  }
}
