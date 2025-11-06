import { fetchJson } from '@/lib/api'

export const accountService = {
  async changeEmail(input: { currentPassword: string; newEmail: string }) {
    return fetchJson<{ id: number; email: string }>(`/api/account/change-email`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  async changePassword(input: { currentPassword: string; newPassword: string }) {
    return fetchJson<{ ok: boolean }>(`/api/account/change-password`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
}
