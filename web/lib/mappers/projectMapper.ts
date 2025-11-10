import Project from '@/models/Project'

export type ApiProject = {
  id: number
  title: string
  description: string
  category?: { id: number; name: string; slug: string } | null
  images?: { id: number; url: string; order: number }[]
}

export function mapApiProjectToProject(p: ApiProject): Project {
  return {
    id: String(p.id),
    title: p.title,
    description: p.description,
    category: p.category?.name ?? '',
    image: (p.images || []).slice().sort((a, b) => a.order - b.order).map((i) => i.url),
  }
}
