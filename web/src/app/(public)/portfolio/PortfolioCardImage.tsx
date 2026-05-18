'use client'

import { useMemo, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { OptimizedImage } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'

const resolvedPortfolioCardImageCache = new Map<string, string>()

type PortfolioCardImageProps = {
  primarySrc: string | null
  fallbackSrcs: string[]
  alt: string
  priority?: boolean
}

export default function PortfolioCardImage({
  primarySrc,
  fallbackSrcs,
  alt,
  priority = false,
}: PortfolioCardImageProps) {
  const candidates = useMemo(
    () => Array.from(new Set([primarySrc, ...fallbackSrcs].filter(Boolean) as string[])),
    [primarySrc, fallbackSrcs]
  )
  const cacheKey = candidates.join('||')
  const cachedResolvedSrc = cacheKey ? resolvedPortfolioCardImageCache.get(cacheKey) : undefined
  const initialIndex = cachedResolvedSrc ? Math.max(candidates.indexOf(cachedResolvedSrc), 0) : 0
  const [sourceIndex, setSourceIndex] = useState(initialIndex)

  const activeSrc = candidates[sourceIndex] ?? null

  if (!activeSrc) {
    return (
      <div className="public-portfolio-image-fallback absolute inset-0 flex h-full w-full items-center justify-center">
        <ImageOff className="size-14 shrink-0 sm:size-16" aria-hidden />
      </div>
    )
  }

  return (
    <OptimizedImage
      key={activeSrc}
      src={activeSrc}
      alt={alt}
      fill
      className="transition-transform duration-700 ease-out group-hover:scale-110"
      sizes={IMAGE_SIZES.publicCardGrid}
      priority={priority}
      placeholder="empty"
      transparentBackground={false}
      onLoad={() => {
        if (cacheKey) {
          resolvedPortfolioCardImageCache.set(cacheKey, activeSrc)
        }
      }}
      onError={() => {
        if (sourceIndex < candidates.length - 1) {
          setSourceIndex((currentIndex) => currentIndex + 1)
        }
      }}
    />
  )
}
