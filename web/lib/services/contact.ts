import { fetchJson } from '@/lib/api'
import { ContactData } from '@/models/ContactData'

export const contactService = {
  async get(): Promise<ContactData | null> {
    return fetchJson<ContactData | null>('/api/contact')
  },
  async update(input: ContactData): Promise<ContactData> {
    return fetchJson<ContactData>('/api/contact', {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  },
}
