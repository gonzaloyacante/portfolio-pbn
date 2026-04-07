'use client'

import { useState, useCallback } from 'react'
import { motion, FadeIn, OptimizedImage, Lightbox } from '@/components/ui'
import type { LightboxImage } from '@/components/ui'

interface FeaturedImage {
  id: string
  url: string
  width?: number | null
  height?: number | null
  categoryName: string
}

interface FeaturedImagesGalleryProps {
  images: FeaturedImage[]
}

export default function FeaturedImagesGallery({ images }: FeaturedImagesGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const closeLightbox = useCallback(() => setSelectedIndex(null), [])

  const lightboxImages: LightboxImage[] = images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.categoryName,
    width: img.width,
    height: img.height,
  }))

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {images.map((img, i) => (
          <FadeIn key={img.id} delay={Math.min(i * 0.08, 0.5)}>
            <motion.div
              role="button"
              tabIndex={0}
              aria-label={`Ver imagen ${i + 1}`}
              onClick={() => setSelectedIndex(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedIndex(i)
                }
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="group relative block aspect-4/5 cursor-pointer overflow-hidden rounded-[2.5rem] bg-(--card-bg) shadow-lg transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <OptimizedImage
                src={img.url}
                alt={img.categoryName}
                fill
                variant="card"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Subtle hover overlay — no text */}
              <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          </FadeIn>
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
