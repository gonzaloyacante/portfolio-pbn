'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { OptimizedImage } from '@/components/ui'
import { staggerItem, StaggerChildren } from '@/components/ui/animations/Animations'

interface GalleryImage {
  id: string
  url: string
  alt: string
  title: string // Project title for context
  projectSlug: string
}

export default function CategoryGallery({
  images,
  categoryName,
  showTitles = true,
}: {
  images: GalleryImage[]
  categoryName: string
  showTitles?: boolean
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

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
        setSelectedIndex(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, images.length])

  return (
    <>
      {/* Grid */}
      <StaggerChildren className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
        {images.map((img, index) => (
          <motion.div key={img.id} variants={staggerItem} className="break-inside-avoid">
            <div
              onClick={() => {
                setSelectedIndex(index)
                setIsZoomed(false)
              }}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-sm transition-all hover:shadow-lg"
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
      </StaggerChildren>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Controls */}
            <button className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20">
              <X size={24} />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 z-50 hidden rounded-full bg-white/10 p-4 text-white hover:bg-white/20 md:block"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 z-50 hidden rounded-full bg-white/10 p-4 text-white hover:bg-white/20 md:block"
            >
              <ChevronRight size={32} />
            </button>

            {/* Info */}
            <div className="absolute top-4 left-4 z-40">
              <div className="flex flex-col">
                <span className="text-xs font-medium tracking-wider text-[var(--primary)] uppercase">
                  {categoryName}
                </span>
                <h3 className="text-xl font-bold text-white">{images[selectedIndex].title}</h3>
              </div>
              <p className="text-sm text-white/60">
                {selectedIndex + 1} / {images.length}
              </p>
            </div>

            {/* Main Image */}
            <div
              className={`relative flex h-full w-full items-center justify-center p-4 transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomed(!isZoomed)
              }}
            >
              <OptimizedImage
                src={images[selectedIndex].url}
                alt={images[selectedIndex].alt}
                fill
                className="object-contain"
                priority
                variant="full"
              />
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
