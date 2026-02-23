'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { OptimizedImage, FadeIn, Lightbox } from '@/components/ui'
import type { LightboxImage } from '@/components/ui'
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
  const [columns, setColumns] = useState(3)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setColumns(3)
      else if (window.innerWidth >= 640) setColumns(2)
      else setColumns(2)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Distribution Algorithm: Shortest Column First
  const columnsData = useMemo(() => {
    const cols = Array.from({ length: columns }, () => ({
      images: [] as typeof images,
      height: 0,
    }))

    images.forEach((img) => {
      const aspectRatio = img.height && img.width ? img.height / img.width : 1.2
      let minColIndex = 0
      let minHeight = cols[0].height
      cols.forEach((col, idx) => {
        if (col.height < minHeight) {
          minHeight = col.height
          minColIndex = idx
        }
      })
      cols[minColIndex].images.push(img)
      cols[minColIndex].height += aspectRatio
    })

    return cols
  }, [images, columns])

  // Lightbox images in original order
  const lightboxImages: LightboxImage[] = images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.title ?? `${titlePrefix} ${img.order}`,
    title: img.title,
    width: img.width,
    height: img.height,
  }))

  return (
    <>
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
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget as HTMLDivElement
                    const idx = images.findIndex((i) => i.id === image.id)
                    setSelectedIndex(idx)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      triggerRef.current = e.currentTarget as HTMLDivElement
                      const idx = images.findIndex((i) => i.id === image.id)
                      setSelectedIndex(idx)
                    }
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-(--card-bg) shadow-md transition-all hover:shadow-xl"
                >
                  <OptimizedImage
                    src={image.url}
                    alt={image.title ?? `${titlePrefix} ${image.order}`}
                    width={image.width ?? 800}
                    height={image.height ?? 1000}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    variant="card"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        selectedIndex={selectedIndex}
        onClose={() => {
          setSelectedIndex(null)
          triggerRef.current?.focus()
        }}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}
