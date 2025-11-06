import useSWR from 'swr'
import { contactService } from '@/lib/services/contact'
import type { ContactData } from '@/models/ContactData'

export function useContact() {
  const { data, error, isLoading, mutate } = useSWR<ContactData | null>(
    ['contact:get'],
    () => contactService.get()
  )
  return { contact: data, isLoading, error, mutate }
}
