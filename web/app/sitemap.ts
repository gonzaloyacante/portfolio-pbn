import type { MetadataRoute } from 'next'
import { getApiUrl, getSiteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const staticRoutes: MetadataRoute.Sitemap = ['', '/about-me', '/contact'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  // Rutas dinámicas de proyectos desde la API
  try {
    const res = await fetch(`${getApiUrl()}/api/projects`, { 
      next: { revalidate: 3600 }, // 1 hora cache para sitemap
      headers: { 'User-Agent': 'NextJS-Sitemap-Generator' }
    })
    if (!res.ok) return staticRoutes
    const data = await res.json()
    const projectRoutes: MetadataRoute.Sitemap = (Array.isArray(data) ? data : []).map((p: any) => ({
      url: `${siteUrl}/project/${p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
    return [...staticRoutes, ...projectRoutes]
  } catch (error) {
    console.warn('Failed to fetch projects for sitemap:', error)
    return staticRoutes
  }
}
