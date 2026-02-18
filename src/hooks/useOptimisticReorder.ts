'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/lib/toast'

interface UseOptimisticReorderOptions<T> {
  initialItems: T[]
  reorderAction: (ids: string[]) => Promise<void>
  getId: (item: T) => string
  successMessage: string
  errorMessage: string
}

interface UseOptimisticReorderReturn<T> {
  items: T[]
  handleReorder: (reorderedItems: T[]) => Promise<void>
  isReordering: boolean
}

/**
 * Custom hook for optimistic reordering with error recovery
 *
 * @example
 * ```tsx
 * const { items, handleReorder, isReordering } = useOptimisticReorder({
 *   initialItems: projects,
 *   reorderAction: reorderProjects,
 *   getId: (p) => p.id,
 *   successMessage: 'Orden actualizado',
 *   errorMessage: 'Error al reordenar'
 * })
 * ```
 */
export function useOptimisticReorder<T>({
  initialItems,
  reorderAction,
  getId,
  successMessage,
  errorMessage,
}: UseOptimisticReorderOptions<T>): UseOptimisticReorderReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems)
  const [isReordering, setIsReordering] = useState(false)
  const router = useRouter()

  // Sync with initialItems when they change, but prevent infinite loops
  // by checking if the IDs actually changed (deep comparison via string)
  const prevIds = items.map(getId).join(',')
  const nextIds = initialItems.map(getId).join(',')

  useEffect(() => {
    if (prevIds !== nextIds) {
      setItems(initialItems)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextIds]) // Only depend on the IDs signature

  const handleReorder = async (reorderedItems: T[]) => {
    // Optimistic update
    setItems(reorderedItems)
    setIsReordering(true)

    try {
      const ids = reorderedItems.map(getId)
      await reorderAction(ids)
      showToast.success(successMessage)
    } catch (err) {
      console.error('Reorder error:', err)
      showToast.error(errorMessage)
      // Revert on error
      setItems(initialItems)
      router.refresh()
    } finally {
      setIsReordering(false)
    }
  }

  return { items, handleReorder, isReordering }
}
