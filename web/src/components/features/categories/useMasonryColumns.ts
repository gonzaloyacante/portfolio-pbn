'use client'

import { useState, useEffect, useMemo } from 'react'
import { BREAKPOINTS } from '@/config/breakpoints'

interface MasonryColumn<T> {
  items: (T & { flatIndex: number })[]
  height: number
}

/**
 * Distributes items into masonry columns using height-based shortest-column-first algorithm.
 * Memoized so columns are NOT recalculated on parent re-renders during drag-and-drop —
 * that would cause dnd-kit and the visual columns to disagree about which item goes where.
 */
export function useMasonryColumns<T extends { width?: number | null; height?: number | null }>(
  items: T[],
  defaultColumns: number = 3
) {
  const [columns, setColumns] = useState(defaultColumns)

  useEffect(() => {
    const update = () => {
      // El parámetro defaultColumns define el comportamiento mobile inicial.
      // En >= md forzamos 3 columnas (admin y público coinciden aquí).
      if (window.innerWidth >= BREAKPOINTS.md) {
        setColumns(Math.max(defaultColumns, 3))
      } else {
        setColumns(defaultColumns)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [defaultColumns])

  const { columnsData, colClass } = useMemo(() => {
    const cols: MasonryColumn<T>[] = Array.from({ length: columns }, () => ({
      items: [],
      height: 0,
    }))

    items.forEach((item, idx) => {
      const ar = item.height && item.width ? item.height / item.width : 1.5
      let minCol = 0
      cols.forEach((col, i) => {
        if (col.height < cols[minCol].height) minCol = i
      })
      cols[minCol].items.push({ ...item, flatIndex: idx })
      cols[minCol].height += ar
    })

    return {
      columnsData: cols,
      colClass: columns === 2 ? 'grid-cols-2' : 'grid-cols-3',
    }
  }, [items, columns])

  return { columns, columnsData, colClass }
}
