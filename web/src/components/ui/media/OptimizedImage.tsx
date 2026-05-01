'use client'

/**
 * `OptimizedImage`: Cloudinary variants, lazy viewport, blur placeholder, unified `objectFit`.
 * Use plain `next/image` only where conviene (p. ej. mini previews admin drag-only sin necesidad de variant URLs).
 */

import Image from 'next/image'
import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { getVariantUrl, getBlurPlaceholderUrl } from '@/lib/cloudinary-helper'
import { NEUTRAL } from '@/lib/design-tokens'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { cn } from '@/lib/utils'

const CLOUDINARY_REGEX = /^https?:\/\/res\.cloudinary\.com\//

function svgMarkupToDataUrl(svgMarkup: string): string {
  if (typeof btoa === 'function') {
    const bytes = new TextEncoder().encode(svgMarkup)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!)
    }
    return `data:image/svg+xml;base64,${btoa(binary)}`
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`
}

type OptimizedImageShared = {
  src: string
  alt: string
  /** Classes for the outer wrapper (position, layout, rounded, etc.). */
  className?: string
  /** Classes for the inner Next.js `<Image>` element. */
  imgClassName?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  lazy?: boolean
  onLoad?: () => void
  onError?: () => void
  /** Applied to the inner `<Image>` elements (main + blur placeholder). Default `cover`. */
  objectFit?: CSSProperties['objectFit']
  variant?: 'thumbnail' | 'card' | 'hero' | 'full' | 'original'
  transparentBackground?: boolean
}

/** Fixed width/height layout (`fill` omitted or `false`). */
export type OptimizedImageFixedProps = OptimizedImageShared & {
  fill?: false
  width: number
  height: number
  sizes?: string
}

/** Fill parent (`sizes` required). */
export type OptimizedImageFillProps = OptimizedImageShared & {
  fill: true
  sizes: string
  width?: never
  height?: never
}

export type OptimizedImageProps = OptimizedImageFixedProps | OptimizedImageFillProps

function isFillProps(props: OptimizedImageProps): props is OptimizedImageFillProps {
  return props.fill === true
}

export function OptimizedImage(props: OptimizedImageProps) {
  const {
    src,
    alt,
    className = '',
    imgClassName = '',
    priority = false,
    quality,
    placeholder = 'blur',
    blurDataURL,
    lazy = true,
    onLoad,
    onError,
    objectFit = 'cover',
    variant,
    transparentBackground = true,
  } = props

  const fill = isFillProps(props)
  const width = fill ? undefined : props.width
  const height = fill ? undefined : props.height
  const sizes = fill ? props.sizes : (props.sizes ?? IMAGE_SIZES.common)

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
  const defaultBlurDataURL = svgMarkupToDataUrl(
    `<svg width="${width ?? 100}" height="${height ?? 100}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${NEUTRAL.gray100}"/>
    </svg>`
  )

  const showBlurLayer = Boolean(computedBlurDataURL || placeholder === 'blur')

  if (imageError) {
    return (
      <div
        ref={imgRef}
        role="alert"
        className={cn(
          'border-border flex items-center justify-center border',
          transparentBackground ? 'bg-transparent' : 'bg-muted',
          className,
          fill ? 'absolute inset-0' : 'h-64 w-full',
          'rounded-lg'
        )}
      >
        <span className="sr-only">No se pudo cargar la imagen.</span>
        <div className="p-4 text-center" aria-hidden="true">
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

  const mainImageClassName = cn(
    'transition-opacity duration-300',
    isLoaded ? 'opacity-100' : 'opacity-0',
    imgClassName,
    showBlurLayer && (fill ? 'z-[1]' : 'relative z-[1]')
  )

  return (
    <div
      ref={imgRef}
      className={cn(
        transparentBackground ? 'bg-transparent' : 'bg-muted',
        'relative overflow-hidden',
        className
      )}
      style={fill ? { position: 'absolute', inset: 0 } : undefined}
    >
      {(isInView || priority) && (
        <>
          {showBlurLayer && (
            <div className="pointer-events-none absolute inset-0 z-0">
              <Image
                src={computedBlurDataURL || defaultBlurDataURL}
                alt=""
                fill
                sizes={sizes}
                className={cn(
                  'transition-opacity duration-500',
                  isLoaded ? 'opacity-0' : 'opacity-100'
                )}
                style={{ objectFit }}
                priority={true}
                aria-hidden={true}
              />
            </div>
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
            className={mainImageClassName}
            style={{ objectFit }}
            onLoad={handleLoad}
            onError={handleError}
          />
        </>
      )}
    </div>
  )
}
