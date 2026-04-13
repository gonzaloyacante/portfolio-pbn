'use client'

import { useState, useEffect } from 'react'

interface MasonryColumn<T> {
  items: (T & { flatIndex: number })[]
  height: number
}

/**
 * Distributes items into masonry columns using height-based shortest-column-first algorithm.
 * Matches the public gallery and admin editor layouts exactly.
 */
export function useMasonryColumns<T extends { width?: number | null; height?: number | null }>(
  items: T[],
  defaultColumns: number = 3
) {
  const [columns, setColumns] = useState(defaultColumns)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1280) setColumns(4)
      else if (window.innerWidth >= 768) setColumns(3)
      else setColumns(2)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const columnsData: MasonryColumn<T>[] = Array.from({ length: columns }, () => ({
    items: [],
    height: 0,
  }))

  items.forEach((item, idx) => {
    const ar = item.height && item.width ? item.height / item.width : 1.5
    let minCol = 0
    columnsData.forEach((col, i) => {
      if (col.height < columnsData[minCol].height) minCol = i
    })
    columnsData[minCol].items.push({ ...item, flatIndex: idx })
    columnsData[minCol].height += ar
  })

  const colClass = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-4'

  return { columns, columnsData, colClass }
}
