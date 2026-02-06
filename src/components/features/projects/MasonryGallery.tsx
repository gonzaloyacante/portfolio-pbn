'use client'

import { useState, useEffect, useMemo } from 'react'
import { OptimizedImage, FadeIn } from '@/components/ui'
import { cn } from '@/lib/utils'

interface MasonryGalleryProps {
  images: {
    id: string
    url: string
    title?: string
    order?: number
    width?: number | null
    height?: number | null
    originalIndex: number
  }[]
  titlePrefix?: string
}

export default function MasonryGallery({
  images,
  titlePrefix = 'Project Image',
}: MasonryGalleryProps) {
  const [columns, setColumns] = useState(3) // Default to desktop

  // Detect responsive columns on client side
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024)
        setColumns(3) // lg
      else if (window.innerWidth >= 640)
        setColumns(2) // sm
      else setColumns(1) // default
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Distribution Algorithm: Horizontal Flow V2 (Shortest Column First)
  // Re-distribute images to minimize vertical gaps (waterfall / pinterest style)
  const columnsData = useMemo(() => {
    const cols = Array.from({ length: columns }, () => ({
      images: [] as typeof images,
      height: 0,
    }))

    images.forEach((img) => {
      // Determine image aspect ratio (height relative to width)
      // If no dims, assume square (1)
      const aspectRatio = img.height && img.width ? img.height / img.width : 1.2

      // Find shortest column
      let minColIndex = 0
      let minHeight = cols[0].height

      cols.forEach((col, idx) => {
        if (col.height < minHeight) {
          minHeight = col.height
          minColIndex = idx
        }
      })

      // Add to shortest
      cols[minColIndex].images.push(img)
      cols[minColIndex].height += aspectRatio
    })

    return cols
  }, [images, columns])

  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-3'
      )}
    >
      {columnsData.map((col, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4">
          {col.images.map((image) => (
            <FadeIn key={image.id} delay={image.originalIndex * 0.15} duration={0.5}>
              <div className="group relative overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-md transition-all hover:shadow-xl">
                <OptimizedImage
                  src={image.url}
                  alt={image.title || `${titlePrefix} ${image.order}`}
                  width={image.width || 800}
                  height={image.height || 1000}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  variant="card"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      ))}
    </div>
  )
}
