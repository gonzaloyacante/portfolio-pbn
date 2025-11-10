import { fetchJson } from '@/lib/api'
import { GalleryImage } from '@/models/GalleryImage'

export type ApiGalleryImage = {
  id: number
  url: string
  name: string
  order: number
}

function mapApiGalleryImage(i: ApiGalleryImage): GalleryImage {
  return { id: String(i.id), url: i.url, name: i.name, order: i.order }
}

export const galleryService = {
  async list(): Promise<GalleryImage[]> {
    const data = await fetchJson<ApiGalleryImage[]>('/api/gallery')
    return data.map(mapApiGalleryImage)
  },
  async bulkCreate(items: { url: string; name: string; order?: number }[]): Promise<GalleryImage[]> {
    const created = await fetchJson<ApiGalleryImage[]>('/api/gallery/bulk', {
      method: 'POST',
      body: JSON.stringify({ items }),
    })
    return created.map(mapApiGalleryImage)
  },
  async create(input: { url: string; name: string; order?: number }): Promise<GalleryImage> {
    const created = await fetchJson<ApiGalleryImage>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify({ ...input, order: input.order ?? 0 }),
    })
    return mapApiGalleryImage(created)
  },
  async update(id: string | number, input: Partial<{ url: string; name: string; order: number }>): Promise<GalleryImage> {
    const updated = await fetchJson<ApiGalleryImage>(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
    return mapApiGalleryImage(updated)
  },
  async reorderAll(items: { id: number; order: number }[]): Promise<GalleryImage[]> {
    const data = await fetchJson<ApiGalleryImage[]>(`/api/gallery/reorder/all`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    })
    return data.map(mapApiGalleryImage)
  },
  async remove(id: string | number): Promise<{ ok: boolean } | void> {
    return fetchJson(`/api/gallery/${id}`, { method: 'DELETE' })
  },
}
