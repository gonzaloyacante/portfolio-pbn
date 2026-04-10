'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Lightbox } from '@/components/ui'
import type { LightboxImage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { GalleryImageCard } from './GalleryImageCard'
import { useMasonryColumns } from './useMasonryColumns'
import type { GalleryImage } from './types'

export default function CategoryGallery({
  images,
  showTitles = true,
}: {
  images: GalleryImage[]
  showTitles?: boolean
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const { columnsData, colClass } = useMasonryColumns(images, 2)

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
    triggerRef.current?.focus()
  }, [])

  // Prefetch thumbnail variant for every image that enters the viewport
  useEffect(() => {
    const container = gridRef.current
    if (!container || typeof IntersectionObserver === 'undefined') return
    const prefetched = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const url = (entry.target as HTMLElement).dataset.prefetchUrl
          if (url && !prefetched.has(url)) {
            prefetched.add(url)
            new window.Image().src = url
          }
        })
      },
      { rootMargin: '300px 0px' }
    )
    container
      .querySelectorAll<HTMLElement>('[data-prefetch-url]')
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [images])

  const handleCardClick = (index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger
    setSelectedIndex(index)
  }

  const lightboxImages: LightboxImage[] = images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    title: img.title,
    width: img.width,
    height: img.height,
  }))

  return (
    <>
      <div ref={gridRef} className={cn('grid gap-4', colClass)}>
        {columnsData.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {col.items.map((img) => (
              <GalleryImageCard
                key={img.id}
                image={img}
                showTitles={showTitles}
                onClick={handleCardClick}
              />
            ))}
          </div>
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        selectedIndex={selectedIndex}
        onClose={closeLightbox}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}


