import { fetchJson } from '@/lib/api'
import Category from '@/models/Category'

export type ApiCategory = { id: number; name: string; slug: string }

export const categoryService = {
  async list(): Promise<Category[]> {
    const data = await fetchJson<ApiCategory[]>('/api/categories')
    return data.map((c) => ({ id: String(c.id), name: c.name }))
  },

  async create(name: string): Promise<Category> {
    const input = { name: name.trim(), slug: slugify(name) }
    const created = await fetchJson<ApiCategory>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return { id: String(created.id), name: created.name }
  },

  async update(id: string | number, name: string): Promise<Category> {
    const input = { name: name.trim(), slug: slugify(name) }
    const updated = await fetchJson<ApiCategory>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
    return { id: String(updated.id), name: updated.name }
  },

  async remove(id: string | number): Promise<{ ok: boolean } | void> {
    return fetchJson(`/api/categories/${id}`, { method: 'DELETE' })
  },
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
