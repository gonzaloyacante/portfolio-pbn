import useSWR from 'swr'
import { categoryService } from '@/lib/services/categories'
import type Category from '@/models/Category'

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    ['categories:list'],
    () => categoryService.list()
  )
  return { categories: data ?? [], isLoading, error, mutate }
}
