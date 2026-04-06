'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion, FadeIn, OptimizedImage, Lightbox } from '@/components/ui'
import type { LightboxImage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { getVariantUrl } from '@/lib/cloudinary-helper'

interface GalleryImage {
  id: string
  url: string
  alt: string
  title: string
  width?: number | null
  height?: number | null
}

interface ExpandOrigin {
  rect: DOMRect
  src: string
  alt: string
  pendingIndex: number
}

const CLOUDINARY_RE = /^https?:\/\/res\.cloudinary\.com\//

export default function CategoryGallery({
  images: initialImages,
  showTitles = true,
}: {
  images: GalleryImage[]
  showTitles?: boolean
}) {
  const images = initialImages

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [expandOrigin, setExpandOrigin] = useState<ExpandOrigin | null>(null)

  const triggerRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
    triggerRef.current?.focus()
  }, [])

  // ── IntersectionObserver prefetch ─────────────────────────────────────────
  // When a thumbnail enters the viewport (with 300px rootMargin), preload the
  // Cloudinary thumbnail variant so the lightbox image is already cached on click.
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

  // ── Masonry columns ───────────────────────────────────────────────────────
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setColumns(3)
      else setColumns(2)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const columnsData = Array.from({ length: columns }, () => ({
    images: [] as (GalleryImage & { originalIndex: number })[],
    height: 0,
  }))

  const imagesWithIndex = images.map((img, idx) => ({ ...img, originalIndex: idx }))

  imagesWithIndex.forEach((img, i) => {
    columnsData[i % columns].images.push(img)
  })

  const distributedImages = columnsData.map((c) => c.images)

  const lightboxImages: LightboxImage[] = images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    title: img.title,
    width: img.width,
    height: img.height,
  }))

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, img: GalleryImage & { originalIndex: number }) => {
      triggerRef.current = e.currentTarget
      const rect = e.currentTarget.getBoundingClientRect()
      const originalIndex = images.findIndex((i) => i.id === img.id)
      const src = CLOUDINARY_RE.test(img.url) ? getVariantUrl(img.url, 'thumbnail') : img.url
      setExpandOrigin({ rect, src, alt: img.alt, pendingIndex: originalIndex })
    },
    [images]
  )

  return (
    <>
      {/* Grid */}
      <div
        ref={gridRef}
        className={cn('grid gap-4', columns === 2 ? 'grid-cols-2' : 'grid-cols-3')}
      >
        {distributedImages.map((columnImages, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {columnImages.map((img) => {
              const prefetchUrl = CLOUDINARY_RE.test(img.url)
                ? getVariantUrl(img.url, 'thumbnail')
                : img.url
              return (
                <FadeIn key={img.id} delay={Math.min(img.originalIndex * 0.08, 0.6)}>
                  <motion.div
                    role="button"
                    tabIndex={0}
                    aria-label={img.alt || `Ver imagen ${img.originalIndex + 1}`}
                    data-prefetch-url={prefetchUrl}
                    onClick={(e) => handleImageClick(e, img)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        triggerRef.current = e.currentTarget as HTMLDivElement
                        setSelectedIndex(images.findIndex((i) => i.id === img.id))
                      }
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
                  </motion.div>
                </FadeIn>
              )
            })}
          </div>
        ))}
      </div>

      {/* Expand-from-origin overlay */}
      <AnimatePresence>
        {expandOrigin && (
          <motion.div
            key="expand-overlay"
            style={{ position: 'fixed', overflow: 'hidden', zIndex: 9998, pointerEvents: 'none' }}
            initial={{
              top: expandOrigin.rect.top,
              left: expandOrigin.rect.left,
              width: expandOrigin.rect.width,
              height: expandOrigin.rect.height,
              borderRadius: 12,
            }}
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0,
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={(def) => {
              if (def === 'animate') {
                setSelectedIndex(expandOrigin.pendingIndex)
                setExpandOrigin(null)
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={expandOrigin.src}
              alt={expandOrigin.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
