import { revalidatePath, revalidateTag } from 'next/cache'

import { CACHE_TAGS } from '@/lib/cache-tags'
import { ROUTES } from '@/config/routes'
import { generateSlug } from '@/lib/string-utils'

import type { ServiceFormData } from './schema'

export function revalidatePublicServices(slugs: Array<string | null | undefined> = []) {
  revalidatePath(ROUTES.public.services)
  revalidatePath(ROUTES.public.sitemap)
  const uniqueSlugs = new Set(slugs.filter((slug): slug is string => Boolean(slug)))
  for (const slug of uniqueSlugs) {
    revalidatePath(ROUTES.public.serviceDetail(slug))
  }
  revalidateTag(CACHE_TAGS.services, 'max')
}

/**
 * Extrae los campos planos del FormData de creación/edición de un servicio.
 * El resultado se valida luego con ServiceSchema.
 */
export function parseServiceFormFields(formData: FormData) {
  return {
    name: formData.get('name'),
    slug: (() => {
      const slug = formData.get('slug')
      if (typeof slug === 'string' && slug.trim() !== '') return slug.trim()
      const name = formData.get('name')
      return typeof name === 'string' ? generateSlug(name) : ''
    })(),
    description: formData.get('description') || undefined,
    shortDesc: formData.get('shortDesc') || undefined,
    // Pricing
    price: formData.get('price') || null,
    priceLabel: formData.get('priceLabel') || 'desde',
    currency: formData.get('currency') || 'EUR',
    // Time
    duration: formData.get('duration') || undefined,
    durationMinutes: formData.get('durationMinutes') || null,
    isAvailable: formData.get('isAvailable') === 'true' || formData.get('isAvailable') === 'on',
    maxBookingsPerDay: formData.get('maxBookingsPerDay') || undefined,
    advanceNoticeDays: formData.get('advanceNoticeDays') || undefined,
    // Media
    imageUrl: formData.get('imageUrl') || undefined,
    galleryUrls: formData.get('galleryUrls') || undefined,
    videoUrl: formData.get('videoUrl') || undefined,
    // Display
    isActive: formData.get('isActive') === 'true' || formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'true' || formData.get('isFeatured') === 'on',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    // Experience
    requirements: formData.get('requirements') || undefined,
    cancellationPolicy: formData.get('cancellationPolicy') || undefined,
  }
}

/**
 * Lee los pricing tiers (campos individuales tierName/tierPrice/tierDescription)
 * y la lista de imágenes de galería (inputs múltiples `galleryUrls`, con fallback
 * a la lista separada por comas que devuelve ServiceSchema).
 */
export function parseTiersAndGallery(formData: FormData, data: ServiceFormData) {
  const tierNames = formData.getAll('tierName') as string[]
  const tierPrices = formData.getAll('tierPrice') as string[]
  const tierDescriptions = formData.getAll('tierDescription') as string[]
  const tiersData = tierNames
    .map((name, i) => ({
      name: name.trim(),
      price: (tierPrices[i] ?? '').trim(),
      description: tierDescriptions[i]?.trim() || null,
    }))
    .filter((t) => t.name.length > 0 || t.price.length > 0)

  // Prefer multiple inputs `galleryUrls` (from ImageUpload hidden inputs). Fallback to CSV string.
  const rawGalleryInputs = formData.getAll('galleryUrls').filter(Boolean) as string[]
  const galleryList = rawGalleryInputs.length
    ? rawGalleryInputs.map((u) => u.trim())
    : data.galleryUrls
      ? data.galleryUrls
          .split(',')
          .map((u) => u.trim())
          .filter(Boolean)
      : []

  return { tiersData, galleryList }
}
