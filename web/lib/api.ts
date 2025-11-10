import { ENV } from '@/lib/env'

export const API_BASE_URL = ENV.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export class ApiError extends Error {
  code?: string
  status: number
  data?: any
  constructor(message: string, status: number, code?: string, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.data = data
  }
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const isAbsolute = /^https?:\/\//i.test(path)
  const url = isAbsolute ? path : `${API_BASE_URL}${path}`
  const requestId = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2)
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-request-id': requestId,
    },
    ...init,
  })

  if (!res.ok) {
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await res.json().catch(() => ({}))
      const message = body.error || body.message || `Request failed: ${res.status}`
      const code = body.code as string | undefined
      throw new ApiError(message, res.status, code, body)
    }
    const text = await res.text().catch(() => '')
    throw new ApiError(text || `Request failed: ${res.status}`, res.status)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  // @ts-expect-error allow non-json in rare cases
  return res.text()
}
