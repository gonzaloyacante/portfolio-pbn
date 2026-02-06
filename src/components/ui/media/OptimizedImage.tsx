'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { getOptimizedUrl, getBlurPlaceholderUrl } from '@/lib/cloudinary-helper'

const COMMON_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
const CLOUDINARY_REGEX = /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(v\d+\/)?(.+)$/

// Simple lazy image state hook
function useLazyImage() {
  const [isInView, setIsInView] = useState(false)
  return { isInView, setIsInView }
}

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

  const { isInView, setIsInView } = useLazyImage()

  // Determine final image URL based on variant or default optimization
  const finalSrc = variant
    ? getOptimizedUrl(src, { width: width || 800, quality: quality || 'auto' }) // If variant logic needed, strictly use helper's getVariantUrl, but here we keep flex logic
    : src // If not customized, let Next.js Image handle optimization or pass through

  // But we want to enforce Cloudinary optimization if it IS a Cloudinary URL
  const isCloudinary = CLOUDINARY_REGEX.test(src)
  const optimizeCloudinary = isCloudinary && !src.includes('w_') // Avoid double optimizing if already has params

  const optimizedSrc = optimizeCloudinary
    ? (() => {
        const match = src.match(CLOUDINARY_REGEX)
        if (!match) return src

        const [, cloudName, version, publicId] = match

        // Construct new URL with transformations
        // transformations format: f_auto,q_auto,w_...,h_...,c_...
        const transformations = []
        if (width || (fill ? 1200 : undefined)) {
          transformations.push(`w_${width || (fill ? 1200 : undefined)}`)
        }
        if (quality || 'auto') {
          transformations.push(`q_${quality || 'auto'}`)
        }

        const transformationString = transformations.join(',')

        return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${version || ''}${publicId}`
      })()
    : finalSrc

  // Generate blur placeholder automatically for Cloudinary images
  const computedBlurDataURL =
    isCloudinary && placeholder === 'blur' && !blurDataURL
      ? getBlurPlaceholderUrl(src)
      : blurDataURL

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) {
      setIsInView(true)
      return
    }

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
  }, [lazy, priority, setIsInView])

  // Note: State resets automatically when src changes via React's reconciliation
  // The loadState will be reset when image component is re-mounted or src changes
  // If needed, parent can use key={src} to force full remount

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
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>`
  ).toString('base64')}`

  if (imageError) {
    return (
      <div
        ref={imgRef}
        className={`border-border flex items-center justify-center border ${transparentBackground ? 'bg-transparent' : 'bg-muted'} ${className} ${fill ? 'absolute inset-0' : 'h-64 w-full'} rounded-lg`} // Fixed height for errors
        style={fill ? undefined : undefined} // Remove inline width/height to let CSS control error size
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
          {/* Background Blurred Placeholder (Always visible until load) */}
          {!transparentBackground && (computedBlurDataURL || placeholder === 'blur') && (
            <Image
              src={computedBlurDataURL || defaultBlurDataURL}
              alt={alt}
              fill={fill}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              className={`absolute inset-0 object-cover opacity-100 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : ''}`}
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
            className={`transition-all duration-300 ${isLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'} ${fill ? 'object-cover' : ''}`}
            style={fill ? { objectFit: 'cover' } : undefined}
            onLoad={handleLoad}
            onError={handleError}
          />
        </>
      )}
    </div>
  )
}
