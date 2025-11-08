import { MetadataRoute } from 'next'
import { apiClient } from '@/lib/api-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paolabolivar.com'
  
  // Páginas estáticas
  const routes = ['', '/projects', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Obtener proyectos dinámicos
  try {
    const projects = await apiClient.getProjects({ limit: 100 })
    const projectRoutes = projects.map((project: any) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt || project.createdAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...routes, ...projectRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return routes
  }
}
