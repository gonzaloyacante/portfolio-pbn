/**
 * Cloudinary URL Generation Helper
 * Handles automatic optimization (format, quality) and resizing based on variants.
 */

export const CLOUDINARY_UPLOAD_REGEX =
  /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.+)$/

type ImageVariant = 'thumbnail' | 'card' | 'hero' | 'full' | 'original'

interface TransformationOptions {
  width?: number
  height?: number
  quality?: number | 'auto' | 'auto:best'
  format?: 'auto' | 'webp' | 'avif' | 'jpg'
  effect?: string
  crop?: 'fill' | 'scale'
  gravity?: 'auto'
}

export const CLOUDINARY_PRESETS = {
  // UI variants
  thumbnail: { width: 400, quality: 'auto', format: 'auto' }, // Grid thumbnails
  card: { width: 800, quality: 'auto', format: 'auto' }, // Cards / Blog posts
  hero: { width: 1600, quality: 'auto', format: 'auto' }, // Hero headers
  full: { width: 3840, quality: 'auto', format: 'auto' }, // Lightbox full view (4K)
  original: { quality: 'auto', format: 'auto' }, // As uploaded but optimized
  // API/server transforms (legacy-compatible dimensions)
  apiThumbnail: {
    crop: 'fill',
    gravity: 'auto',
    width: 800,
    height: 600,
    quality: 'auto',
    format: 'auto',
  },
  apiGalleryCard: {
    crop: 'fill',
    gravity: 'auto',
    width: 600,
    height: 600,
    quality: 'auto',
    format: 'auto',
  },
  apiLqip: { width: 30, quality: 5, effect: 'blur:800', format: 'jpg' },
  apiCover: { quality: 'auto:best', format: 'auto' },
} as const satisfies Record<string, TransformationOptions>

const VARIANTS: Record<ImageVariant, TransformationOptions> = {
  thumbnail: CLOUDINARY_PRESETS.thumbnail,
  card: CLOUDINARY_PRESETS.card,
  hero: CLOUDINARY_PRESETS.hero,
  full: CLOUDINARY_PRESETS.full,
  original: CLOUDINARY_PRESETS.original,
}

type ParsedCloudinaryUploadUrl = {
  cloudName: string
  version: string
  publicId: string
}

function parseCloudinaryUploadUrl(src: string): ParsedCloudinaryUploadUrl | null {
  const match = src.match(CLOUDINARY_UPLOAD_REGEX)
  if (!match) return null

  const [, cloudName, uploadPath] = match
  const segments = uploadPath.split('/').filter(Boolean)
  const versionIndex = segments.findIndex((seg) => /^v\d+$/.test(seg))
  if (versionIndex === -1) return null

  const version = `${segments[versionIndex]}`
  const publicId = segments.slice(versionIndex + 1).join('/')
  if (!publicId) return null

  return { cloudName, version, publicId }
}

export function getOptimizedUrl(src: string, options: Partial<TransformationOptions> = {}): string {
  const parsed = parseCloudinaryUploadUrl(src)
  if (!parsed) return src

  // Construct transformation string
  const transformations: string[] = []

  // Scale/Crop
  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.crop) transformations.push(`c_${options.crop}`) // e.g., 'fill', 'scale'
  if (options.gravity) transformations.push(`g_${options.gravity}`)

  // Quality & Format
  transformations.push(`q_${options.quality ?? 'auto'}`)
  transformations.push(`f_${options.format ?? 'auto'}`)

  // Effects (e.g., blur for placeholders)
  if (options.effect) transformations.push(`e_${options.effect}`)

  const transformString = transformations.join(',')

  return `https://res.cloudinary.com/${parsed.cloudName}/image/upload/${transformString}/${parsed.version}/${parsed.publicId}`
}

export function getVariantUrl(src: string, variant: ImageVariant): string {
  return getOptimizedUrl(src, VARIANTS[variant])
}

export function getBlurPlaceholderUrl(src: string): string {
  return getOptimizedUrl(src, { width: 20, quality: 'auto', effect: 'blur:1000' })
}

export function isCloudinaryUploadUrl(src: string): boolean {
  return CLOUDINARY_UPLOAD_REGEX.test(src)
}
