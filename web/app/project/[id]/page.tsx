import type { Metadata } from 'next'
import { getApiUrl, getSiteUrl } from '@/lib/site'
import ProjectClient from './ProjectClient'

type Params = { params: { id: string } }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = params.id
  try {
    const res = await fetch(`${getApiUrl()}/api/projects/${id}`, { 
      next: { revalidate: 3600 }, // 1 hora cache
      headers: { 'User-Agent': 'NextJS-Metadata-Generator' }
    })
    if (!res.ok) throw new Error('Project not found')
    const data = await res.json()
    const title = data?.title || 'Proyecto'
    const description = data?.description || 'Detalle del proyecto en el portfolio de Paola Bolivar Nievas.'
    const images: string[] = Array.isArray(data?.images) ? data.images.map((i: any) => i.url) : []
    const url = `${getSiteUrl()}/project/${id}`
    
    // JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: title,
      description,
      url,
      creator: {
        '@type': 'Person',
        name: 'Paola Bolivar Nievas'
      },
      dateCreated: data?.createdAt,
      dateModified: data?.updatedAt,
      image: images.length ? images[0] : undefined,
    }
    
    return {
      title,
      description,
      keywords: data?.category?.name ? [data.category.name, 'portfolio', 'proyecto'] : ['portfolio', 'proyecto'],
      alternates: { canonical: `/project/${id}` },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        images: images.length ? images.map(img => ({ url: img })) : undefined,
        publishedTime: data?.createdAt,
        modifiedTime: data?.updatedAt,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: images.length ? [images[0]] : undefined,
      },
      other: {
        'application/ld+json': JSON.stringify(jsonLd),
      },
    }
  } catch (error) {
    console.warn(`Failed to generate metadata for project ${id}:`, error)
    const url = `${getSiteUrl()}/project/${id}`
    return {
      title: 'Proyecto',
      description: 'Detalle del proyecto en el portfolio de Paola Bolivar Nievas.',
      alternates: { canonical: `/project/${id}` },
      openGraph: { 
        title: 'Proyecto', 
        description: 'Detalle del proyecto en el portfolio de Paola Bolivar Nievas.', 
        url, 
        type: 'article' 
      },
    }
  }
}

export default function ProjectDetails() {
  // Render cliente (carga de datos en ProjectClient)
  return <ProjectClient project={null} />
}
