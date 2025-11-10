import useSWR from 'swr'
import { settingsService, type Settings } from '@/lib/services/settings'

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<Settings | null>(
    ['settings:get'],
    () => settingsService.get()
  )
  return { settings: data, isLoading, error, mutate }
}
