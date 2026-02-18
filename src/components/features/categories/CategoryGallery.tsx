'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { OptimizedImage } from '@/components/ui'
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
  // Use images directly - ordering is already handled by DB query
  const images = initialImages

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  // Refs for focus management
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
    setIsZoomed(false)
    triggerRef.current?.focus()
  }, [])

  // Focus close button when lightbox opens
  useEffect(() => {
    if (selectedIndex !== null) {
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [selectedIndex])

  // Clean Masonry Logic V1
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280)
        setColumns(4) // xl
      else if (window.innerWidth >= 1024)
        setColumns(3) // lg
      else if (window.innerWidth >= 768)
        setColumns(2) // md
      else setColumns(1) // mobile
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Shortest Column Distribution (V2)
  const columnsData = Array.from({ length: columns }, () => ({
    images: [] as (GalleryImage & { originalIndex: number })[],
    height: 0,
  }))

  const imagesWithIndex = images.map((img, idx) => ({ ...img, originalIndex: idx }))

  imagesWithIndex.forEach((img) => {
    // Calculate aspect ratio from real dimensions if available
    // Default to 1.5 (portrait) if missing
    const aspectRatio = img.height && img.width ? img.height / img.width : 1.5

    // Find shortest
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

  // To match the previous map structure for rendering:
  const distributedImages = columnsData.map((c) => c.images)
  // -------------------------

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (selectedIndex !== null) {
        setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
        setIsZoomed(false)
      }
    },
    [selectedIndex, images.length]
  )

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (selectedIndex !== null) {
        setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
        setIsZoomed(false)
      }
    },
    [selectedIndex, images.length]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'ArrowLeft') {
        setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
        setIsZoomed(false)
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
        setIsZoomed(false)
      } else if (e.key === 'Escape') {
        closeLightbox()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, images.length, closeLightbox])

  return (
    <>
      {/* Grid */}
      {/* Horizontal Masonry Grid V1 (Round Robin) */}
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
                    // Store trigger for focus restoration on close
                    triggerRef.current = e.currentTarget as HTMLDivElement
                    // Find original index for lightbox
                    const originalIndex = images.findIndex((i) => i.id === img.id)
                    setSelectedIndex(originalIndex)
                    setIsZoomed(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      triggerRef.current = e.currentTarget as HTMLDivElement
                      const originalIndex = images.findIndex((i) => i.id === img.id)
                      setSelectedIndex(originalIndex)
                      setIsZoomed(false)
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
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen: ${images[selectedIndex].title}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Controls */}
            <button
              ref={closeButtonRef}
              aria-label="Cerrar imagen"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20"
            >
              <X size={24} />
            </button>

            <button
              onClick={handlePrev}
              aria-label="Imagen anterior"
              className="absolute left-4 z-50 hidden rounded-full bg-white/10 p-4 text-white hover:bg-white/20 md:block"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={handleNext}
              aria-label="Imagen siguiente"
              className="absolute right-4 z-50 hidden rounded-full bg-white/10 p-4 text-white hover:bg-white/20 md:block"
            >
              <ChevronRight size={32} />
            </button>

            {/* Info */}
            <div className="absolute top-4 left-4 z-40">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white">{images[selectedIndex].title}</h3>
              </div>
              <p className="text-sm text-white/60">
                {selectedIndex + 1} / {images.length}
              </p>
            </div>

            {/* Main Image */}
            <div
              className="relative flex h-full w-full cursor-zoom-in items-center justify-center overflow-hidden p-4"
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomed(!isZoomed)
              }}
            >
              <div
                className={`relative max-h-[85vh] max-w-[90vw] transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
              >
                <OptimizedImage
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].alt}
                  width={1200}
                  height={800}
                  className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
                  priority
                  variant="full"
                />
              </div>
            </div>

            {/* Hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
              <span className="flex items-center gap-2">
                <ZoomIn size={14} />
                Click para {isZoomed ? 'reducir' : 'ampliar'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
