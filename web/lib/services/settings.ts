import { fetchJson } from '@/lib/api'

export type Settings = { title: string }

export const settingsService = {
  async get(): Promise<Settings | null> {
    return fetchJson<Settings | null>('/api/settings')
  },
  async update(input: Settings): Promise<Settings> {
    return fetchJson<Settings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  },
}
