import { useMemo } from 'react'

type FilterFunction<T> = (item: T) => boolean
type SortFunction<T> = (a: T, b: T) => number

interface UseFilteredItemsOptions<T> {
  items: T[]
  filters?: Record<string, FilterFunction<T> | undefined>
  sortBy?: SortFunction<T>
}

/**
 * Custom hook for filtering and sorting items with memoization
 *
 * @example
 * ```tsx
 * const filtered = useFilteredItems({
 *   items: projects,
 *   filters: {
 *     category: (p) => !categoryId || p.categoryId === categoryId,
 *     search: (p) => !search || p.title.toLowerCase().includes(search),
 *     active: (p) => showActive === undefined || p.isActive === showActive
 *   },
 *   sortBy: (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
 * })
 * ```
 */
export function useFilteredItems<T>({
  items,
  filters = {},
  sortBy,
}: UseFilteredItemsOptions<T>): T[] {
  return useMemo(() => {
    let result = [...items]

    // Apply all filters
    Object.values(filters).forEach((filterFn) => {
      if (filterFn) {
        result = result.filter(filterFn)
      }
    })

    // Apply sort
    if (sortBy) {
      result.sort(sortBy)
    }

    return result
  }, [items, filters, sortBy])
}
