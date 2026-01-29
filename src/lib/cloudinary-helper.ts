/**
 * Cloudinary URL Generation Helper
 * Handles automatic optimization (format, quality) and resizing based on variants.
 */

const CLOUDINARY_REGEX = /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(v\d+\/)?(.+)$/

type ImageVariant = 'thumbnail' | 'card' | 'hero' | 'full' | 'original'

interface TransformationOptions {
  width?: number
  height?: number
  quality?: number | 'auto'
  format?: 'auto' | 'webp' | 'avif' | 'jpg'
  effect?: string
  crop?: string
}

const VARIANTS: Record<ImageVariant, TransformationOptions> = {
  thumbnail: { width: 400, quality: 'auto', format: 'auto' }, // Grid thumbnails
  card: { width: 800, quality: 'auto', format: 'auto' }, // Cards / Blog posts
  hero: { width: 1600, quality: 'auto', format: 'auto' }, // Hero headers
  full: { width: 1920, quality: 'auto', format: 'auto' }, // Lightbox full view
  original: { quality: 'auto', format: 'auto' }, // As uploaded but optimized
}

export function getOptimizedUrl(src: string, options: Partial<TransformationOptions> = {}): string {
  // Return original if not a Cloudinary URL
  const match = src.match(CLOUDINARY_REGEX)
  if (!match) return src

  // The regex captures:
  // [0] full match
  // [1] cloudName
  // [2] version (e.g., 'v1234567890/') - optional
  // [3] publicId
  const [, cloudName, version, publicId] = match

  // Construct transformation string
  const transformations: string[] = []

  // Scale/Crop
  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.crop) transformations.push(`c_${options.crop}`) // e.g., 'fill', 'scale'

  // Quality & Format
  transformations.push(`q_${options.quality || 'auto'}`)
  transformations.push(`f_${options.format || 'auto'}`)

  // Effects (e.g., blur for placeholders)
  if (options.effect) transformations.push(`e_${options.effect}`)

  const transformString = transformations.join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${version || ''}${publicId}`
}

export function getVariantUrl(src: string, variant: ImageVariant): string {
  return getOptimizedUrl(src, VARIANTS[variant])
}

export function getBlurPlaceholderUrl(src: string): string {
  return getOptimizedUrl(src, { width: 20, quality: 'auto', effect: 'blur:1000' })
}
