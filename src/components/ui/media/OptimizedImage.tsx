'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

const COMMON_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

// Simple lazy image hook
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useLazyImage(_src: string, _options: { quality?: number; priority?: boolean }) {
  const [isInView, setIsInView] = useState(false)
  return { isInView, setIsInView }
}

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
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
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  sizes = COMMON_SIZES,
  placeholder = 'blur',
  blurDataURL,
  lazy = true,
  onLoad,
  onError,
  fill = false,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  const { isInView, setIsInView } = useLazyImage(src, { quality, priority })

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
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority, setIsInView])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setImageError(true)
    onError?.()
  }

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>`
  ).toString('base64')}`

  if (imageError) {
    return (
      <div
        ref={imgRef}
        className={`flex items-center justify-center border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 ${className} ${fill ? 'absolute inset-0' : ''}`}
        style={fill ? undefined : { width, height }}
      >
        <div className="p-4 text-center">
          <div className="mx-auto mb-2 h-8 w-8 text-gray-400">
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
      className={`relative overflow-hidden ${className}`}
      style={fill ? { position: 'absolute', inset: 0 } : undefined}
    >
      {(isInView || priority) && (
        <>
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            quality={quality}
            sizes={sizes}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL || defaultBlurDataURL}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={fill ? { objectFit: 'cover' } : undefined}
            onLoad={handleLoad}
            onError={handleError}
          />

          {/* Loading skeleton */}
          {!isLoaded && (
            <div
              className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700"
              style={fill ? undefined : { width, height }}
            />
          )}
        </>
      )}

      {/* Lazy loading placeholder */}
      {!isInView && !priority && (
        <div
          className="animate-pulse bg-gray-100 dark:bg-gray-800"
          style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
        />
      )}
    </div>
  )
}
