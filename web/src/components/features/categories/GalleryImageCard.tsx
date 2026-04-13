'use client'

import { motion, FadeIn, OptimizedImage } from '@/components/ui'
import { getVariantUrl } from '@/lib/cloudinary-helper'
import type { GalleryImage } from './types'

const CLOUDINARY_RE = /^https?:\/\/res\.cloudinary\.com\//

interface GalleryImageCardProps {
  image: GalleryImage & { flatIndex: number }
  showTitles: boolean
  onClick: (index: number, trigger: HTMLElement) => void
}

export function GalleryImageCard({ image, showTitles, onClick }: GalleryImageCardProps) {
  const prefetchUrl = CLOUDINARY_RE.test(image.url)
    ? getVariantUrl(image.url, 'thumbnail')
    : image.url

  const handleActivate = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return
    if ('key' in e) e.preventDefault()
    onClick(image.flatIndex, e.currentTarget)
  }

  return (
    <FadeIn delay={Math.min(image.flatIndex * 0.08, 0.6)}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={image.alt || `Ver imagen ${image.flatIndex + 1}`}
        data-prefetch-url={prefetchUrl}
        onClick={handleActivate}
        onKeyDown={handleActivate}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="group relative cursor-pointer overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-lg"
      >
        <OptimizedImage
          src={image.url}
          alt={image.alt}
          width={500}
          height={500}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          variant="card"
        />
        <div className="bg-foreground/20 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
        {showTitles && (
          <div className="absolute right-2 bottom-2 left-2 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-background truncate text-xs font-bold drop-shadow-md">
              {image.title}
            </p>
          </div>
        )}
      </motion.div>
    </FadeIn>
  )
}
