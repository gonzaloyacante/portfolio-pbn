import useSWR, { SWRConfiguration } from 'swr'

export type SettingsSection = 'contact' | 'home' | 'about' | 'theme'

const ENDPOINT_MAP: Record<string, string> = {
  contact: '/api/settings/contact',
  home: '/api/settings/home',
  about: '/api/settings/about',
  theme: '/api/settings/theme',
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return res.json()
}

export function useSettings<T>(section: string, config?: SWRConfiguration) {
  const endpoint = ENDPOINT_MAP[section] || `/api/settings/${section}`

  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: T
    error?: string
  }>(endpoint, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: true,
    dedupingInterval: 2000,
    ...config,
  })

  return {
    settings: data?.data,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error') : null,
    mutate,
  }
}
