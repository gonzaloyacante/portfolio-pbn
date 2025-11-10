import { fetchJson } from '@/lib/api'

export async function login(email: string, password: string) {
  return fetchJson<{ id: number; email: string; role: string }>(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function logout() {
  return fetchJson<{ ok: boolean }>(`/api/auth/logout`, {
    method: 'POST',
  })
}

export async function forgotPassword(email: string) {
  return fetchJson<{ ok: boolean }>(`/api/auth/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(token: string, newPassword: string) {
  return fetchJson<{ ok: boolean }>(`/api/auth/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  })
}
