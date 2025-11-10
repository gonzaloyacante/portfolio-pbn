import { fetchJson } from '@/lib/api'
import Project from '@/models/Project'
import { ApiProject, mapApiProjectToProject } from '@/lib/mappers/projectMapper'

export const projectService = {
  async list(): Promise<Project[]> {
    const data = await fetchJson<ApiProject[]>('/api/projects')
    return data.map(mapApiProjectToProject)
  },

  async getById(id: string | number): Promise<Project> {
    const data = await fetchJson<ApiProject>(`/api/projects/${id}`)
    return mapApiProjectToProject(data)
  },

  async create(input: {
    title: string
    description: string
    categoryId?: number
    images?: { url: string; order: number }[]
  }): Promise<Project> {
    const created = await fetchJson<ApiProject>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return mapApiProjectToProject(created)
  },

  async update(id: string | number, input: {
    title?: string
    description?: string
    categoryId?: number
    images?: { url: string; order: number }[]
  }): Promise<Project> {
    const updated = await fetchJson<ApiProject>(`/api/projects/${id}` , {
      method: 'PUT',
      body: JSON.stringify(input),
    })
    return mapApiProjectToProject(updated)
  },

  async remove(id: string | number): Promise<{ ok: boolean } | void> {
    return fetchJson(`/api/projects/${id}`, { method: 'DELETE' })
  },
}
