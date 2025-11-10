import type { SWRConfiguration } from 'swr'

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: true,
  dedupingInterval: 2000,
  shouldRetryOnError: true,
}
