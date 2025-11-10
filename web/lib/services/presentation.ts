import { fetchJson } from '@/lib/api'

export type Presentation = { title: string; content: string; imageUrl?: string | null }

export const presentationService = {
  async get(): Promise<Presentation | null> {
    return fetchJson<Presentation | null>('/api/presentation')
  },
  async update(input: Presentation): Promise<Presentation> {
    return fetchJson<Presentation>('/api/presentation', {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  },
}
