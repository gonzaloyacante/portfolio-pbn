'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { OptimizedImage, Lightbox } from '@/components/ui'
import type { LightboxImage } from '@/components/ui'
import { cn } from '@/lib/utils'

interface GalleryImage {
  id: string
  url: string
  alt: string
  title: string // Project title for context
  projectSlug: string
  width?: number | null
  height?: number | null
}

export default function CategoryGallery({
  images: initialImages,
  showTitles = true,
}: {
  images: GalleryImage[]
  showTitles?: boolean
}) {
  const images = initialImages

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Refs for focus management
  const triggerRef = useRef<HTMLDivElement | null>(null)

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
    triggerRef.current?.focus()
  }, [])

  // Clean Masonry Logic
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setColumns(4)
      else if (window.innerWidth >= 1024) setColumns(3)
      else if (window.innerWidth >= 768) setColumns(2)
      else setColumns(2)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Shortest Column Distribution
  const columnsData = Array.from({ length: columns }, () => ({
    images: [] as (GalleryImage & { originalIndex: number })[],
    height: 0,
  }))

  const imagesWithIndex = images.map((img, idx) => ({ ...img, originalIndex: idx }))

  imagesWithIndex.forEach((img) => {
    const aspectRatio = img.height && img.width ? img.height / img.width : 1.5
    let minColIndex = 0
    let minHeight = columnsData[0].height
    columnsData.forEach((col, idx) => {
      if (col.height < minHeight) {
        minHeight = col.height
        minColIndex = idx
      }
    })
    columnsData[minColIndex].images.push(img)
    columnsData[minColIndex].height += aspectRatio
  })

  const distributedImages = columnsData.map((c) => c.images)

  // Map images for Lightbox
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
      {/* Grid */}
      <div
        className={cn(
          'grid gap-4',
          columns === 1
            ? 'grid-cols-1'
            : columns === 2
              ? 'grid-cols-2'
              : columns === 3
                ? 'grid-cols-3'
                : 'grid-cols-4'
        )}
      >
        {distributedImages.map((columnImages, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {columnImages.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: img.originalIndex * 0.15, duration: 0.5 }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget as HTMLDivElement
                    const originalIndex = images.findIndex((i) => i.id === img.id)
                    setSelectedIndex(originalIndex)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      triggerRef.current = e.currentTarget as HTMLDivElement
                      const originalIndex = images.findIndex((i) => i.id === img.id)
                      setSelectedIndex(originalIndex)
                    }
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-(--card-bg) shadow-sm transition-all hover:shadow-lg"
                >
                  <OptimizedImage
                    src={img.url}
                    alt={img.alt}
                    width={500}
                    height={500}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    variant="card"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  {showTitles && (
                    <div className="absolute right-2 bottom-2 left-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-xs font-bold text-white drop-shadow-md">
                        {img.title}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        selectedIndex={selectedIndex}
        onClose={closeLightbox}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}
