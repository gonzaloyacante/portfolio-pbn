'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { getVariantUrl, getBlurPlaceholderUrl } from '@/lib/cloudinary-helper'
import { NEUTRAL } from '@/lib/design-tokens'

const COMMON_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
const CLOUDINARY_REGEX = /^https?:\/\/res\.cloudinary\.com\//

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  lazy?: boolean
  onLoad?: () => void
  onError?: () => void
  fill?: boolean
  variant?: 'thumbnail' | 'card' | 'hero' | 'full' | 'original'
  transparentBackground?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality,
  sizes = COMMON_SIZES,
  placeholder = 'blur',
  blurDataURL,
  lazy = true,
  onLoad,
  onError,
  fill = false,
  variant,
  transparentBackground = true,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(!lazy || priority)

  // Use cloudinary-helper for URL optimization instead of manual construction
  const isCloudinary = CLOUDINARY_REGEX.test(src)
  const optimizedSrc = isCloudinary && variant ? getVariantUrl(src, variant) : src

  // Generate blur placeholder automatically for Cloudinary images
  const computedBlurDataURL =
    isCloudinary && placeholder === 'blur' && !blurDataURL
      ? getBlurPlaceholderUrl(src)
      : blurDataURL

  // Intersection Observer for lazy loading (only when lazy=true and not priority)
  useEffect(() => {
    if (!lazy || priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.01, rootMargin: '100px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority, isInView])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setImageError(true)
    onError?.()
  }

  // Fallback SVG placeholder
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width || 100}" height="${height || 100}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${NEUTRAL.gray100}"/>
    </svg>`
  ).toString('base64')}`

  if (imageError) {
    return (
      <div
        ref={imgRef}
        className={`border-border flex items-center justify-center border ${transparentBackground ? 'bg-transparent' : 'bg-muted'} ${className} ${fill ? 'absolute inset-0' : 'h-64 w-full'} rounded-lg`}
      >
        <div className="p-4 text-center">
          <div className="text-muted-foreground mx-auto mb-2 h-8 w-8">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={imgRef}
      className={`${transparentBackground ? 'bg-transparent' : 'bg-muted'} relative overflow-hidden ${className}`}
      style={fill ? { position: 'absolute', inset: 0 } : undefined}
    >
      {(isInView || priority) && (
        <>
          {/* Blur placeholder — always shown until image loads, regardless of transparentBackground */}
          {(computedBlurDataURL || placeholder === 'blur') && (
            <Image
              src={computedBlurDataURL || defaultBlurDataURL}
              alt={alt}
              fill={fill}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              className={`absolute inset-0 object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
              priority={true}
              aria-hidden="true"
            />
          )}

          <Image
            src={optimizedSrc}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            quality={quality}
            sizes={sizes}
            priority={priority}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${fill ? 'object-cover' : ''}`}
            style={fill ? { objectFit: 'cover' } : undefined}
            onLoad={handleLoad}
            onError={handleError}
          />
        </>
      )}
    </div>
  )
}
