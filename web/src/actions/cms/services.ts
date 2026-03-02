'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { z } from 'zod'

import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'

// ============================================
// VALIDATION SCHEMA
// ============================================

const ServiceSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z
    .string()
    .min(1, 'El slug es obligatorio')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string().optional(),
  shortDesc: z.string().optional(),

  // Pricing
  price: z.coerce.number().optional().nullable(),
  priceLabel: z.enum(['desde', 'fijo', 'consultar', 'gratis']).default('desde'),
  currency: z.string().default('EUR'),
  pricingTiers: z.string().optional(), // Receive as JSON string

  // Time & Availability
  duration: z.string().optional(),
  durationMinutes: z.coerce.number().optional().nullable(),
  isAvailable: z.boolean().default(true),
  maxBookingsPerDay: z.coerce.number().int().default(3),
  advanceNoticeDays: z.coerce.number().int().default(2),

  // Media
  imageUrl: z.string().url().optional().or(z.literal('')),
  galleryUrls: z.string().optional(), // Comma separated URLs
  videoUrl: z.string().url().optional().or(z.literal('')),
  iconName: z.string().optional(),
  color: z.string().optional(), // Brand color

  // Display
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),

  // Experience
  requirements: z.string().optional(),
  cancellationPolicy: z.string().optional(),
})

// ============================================
// PUBLIC GETTERS
// ============================================

/**
 * Get all active services for public view
 */
export const getActiveServices = unstable_cache(
  async () => {
    try {
      const services = await prisma.service.findMany({
        where: { isActive: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      })
      return services
    } catch (error) {
      logger.error('Error fetching active services:', { error })
      return []
    }
  },
  [CACHE_TAGS.services],
  { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.services] }
)

/**
 * Get a service by slug for public view
 */
export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const service = await prisma.service.findFirst({
        where: { slug, isActive: true, deletedAt: null },
      })
      return service
    } catch (error) {
      logger.error('Error fetching service by slug:', { error })
      return null
    }
  },
  [CACHE_TAGS.services],
  { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.services] }
)

/**
 * Get all services for admin view
 */
export const getServices = unstable_cache(
  async () => {
    try {
      const services = await prisma.service.findMany({
        orderBy: { sortOrder: 'asc' },
      })
      return services
    } catch (error) {
      logger.error('Error fetching services:', { error })
      return []
    }
  },
  [CACHE_TAGS.services],
  { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.services] }
)

// ============================================
// ADMIN ACTIONS
// ============================================

/**
 * Create a new service
 */
export async function createService(formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    shortDesc: formData.get('shortDesc'),
    // Pricing
    price: formData.get('price') || null,
    priceLabel: formData.get('priceLabel') || 'desde',
    currency: formData.get('currency') || 'EUR',
    pricingTiers: formData.get('pricingTiers'),
    // Time
    duration: formData.get('duration'),
    durationMinutes: formData.get('durationMinutes') || null,
    isAvailable: formData.get('isAvailable') === 'true' || formData.get('isAvailable') === 'on',
    maxBookingsPerDay: formData.get('maxBookingsPerDay'),
    advanceNoticeDays: formData.get('advanceNoticeDays'),
    // Media
    imageUrl: formData.get('imageUrl'),
    galleryUrls: formData.get('galleryUrls'),
    videoUrl: formData.get('videoUrl'),
    iconName: formData.get('iconName'),
    color: formData.get('color'),
    // Display
    isActive: formData.get('isActive') === 'true' || formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'true' || formData.get('isFeatured') === 'on',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    // SEO
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    metaKeywords: formData.get('metaKeywords'),
    // Experience
    requirements: formData.get('requirements'),
    cancellationPolicy: formData.get('cancellationPolicy'),
  }

  const validation = ServiceSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data

  try {
    // Check for duplicate slug
    const existing = await prisma.service.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return { success: false, error: 'Ya existe un servicio con ese slug' }
    }

    // Process specialized fields
    let tiersJson = undefined
    try {
      if (data.pricingTiers) tiersJson = JSON.parse(data.pricingTiers)
    } catch {}

    const galleryList = data.galleryUrls
      ? data.galleryUrls
          .split(',')
          .map((u) => u.trim())
          .filter(Boolean)
      : []
    const keywordList = data.metaKeywords
      ? data.metaKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : []

    await prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        shortDesc: data.shortDesc,
        price: data.price ? data.price : null,
        priceLabel: data.priceLabel,
        currency: data.currency,
        pricingTiers: tiersJson || undefined,
        duration: data.duration || null,
        durationMinutes: data.durationMinutes || null,
        isAvailable: data.isAvailable,
        maxBookingsPerDay: data.maxBookingsPerDay,
        advanceNoticeDays: data.advanceNoticeDays,
        imageUrl: data.imageUrl || null,
        galleryUrls: galleryList,
        videoUrl: data.videoUrl || null,
        iconName: data.iconName || null,
        color: data.color || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: keywordList,
        requirements: data.requirements,
        cancellationPolicy: data.cancellationPolicy,
      },
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.services, 'max')
    logger.info(`Service created: ${data.name}`)
    return { success: true }
  } catch (error) {
    logger.error('Error creating service:', { error })
    return { success: false, error: 'Error al crear el servicio' }
  }
}

/**
 * Update an existing service
 */
export async function updateService(id: string, formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    shortDesc: formData.get('shortDesc'),
    // Pricing
    price: formData.get('price') || null,
    priceLabel: formData.get('priceLabel') || 'desde',
    currency: formData.get('currency') || 'EUR',
    pricingTiers: formData.get('pricingTiers'),
    // Time
    duration: formData.get('duration'),
    durationMinutes: formData.get('durationMinutes') || null,
    isAvailable: formData.get('isAvailable') === 'true' || formData.get('isAvailable') === 'on',
    maxBookingsPerDay: formData.get('maxBookingsPerDay'),
    advanceNoticeDays: formData.get('advanceNoticeDays'),
    // Media
    imageUrl: formData.get('imageUrl'),
    galleryUrls: formData.get('galleryUrls'),
    videoUrl: formData.get('videoUrl'),
    iconName: formData.get('iconName'),
    color: formData.get('color'),
    // Display
    isActive: formData.get('isActive') === 'true' || formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'true' || formData.get('isFeatured') === 'on',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    // SEO
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    metaKeywords: formData.get('metaKeywords'),
    // Experience
    requirements: formData.get('requirements'),
    cancellationPolicy: formData.get('cancellationPolicy'),
  }

  const validation = ServiceSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data

  try {
    // Check for duplicate slug (excluding current)
    const existing = await prisma.service.findFirst({
      where: { slug: data.slug, NOT: { id } },
    })
    if (existing) {
      return { success: false, error: 'Ya existe otro servicio con ese slug' }
    }

    // Process specialized fields
    let tiersJson = undefined
    try {
      if (data.pricingTiers) tiersJson = JSON.parse(data.pricingTiers)
    } catch {}

    const galleryList = data.galleryUrls
      ? data.galleryUrls
          .split(',')
          .map((u) => u.trim())
          .filter(Boolean)
      : []
    const keywordList = data.metaKeywords
      ? data.metaKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : []

    await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        shortDesc: data.shortDesc,
        price: data.price ? data.price : null,
        priceLabel: data.priceLabel,
        currency: data.currency,
        pricingTiers: tiersJson || undefined,
        duration: data.duration || null,
        durationMinutes: data.durationMinutes || null,
        isAvailable: data.isAvailable,
        maxBookingsPerDay: data.maxBookingsPerDay,
        advanceNoticeDays: data.advanceNoticeDays,
        imageUrl: data.imageUrl || null,
        galleryUrls: galleryList,
        videoUrl: data.videoUrl || null,
        iconName: data.iconName || null,
        color: data.color || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: keywordList,
        requirements: data.requirements,
        cancellationPolicy: data.cancellationPolicy,
      },
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.services, 'max')
    logger.info(`Service updated: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error updating service:', { error })
    return { success: false, error: 'Error al actualizar el servicio' }
  }
}

/**
 * Delete a service
 */
export async function deleteService(id: string) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    await prisma.service.delete({ where: { id } })

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.services, 'max')
    logger.info(`Service deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting service:', { error })
    return { success: false, error: 'Error al eliminar el servicio' }
  }
}

/**
 * Toggle service active state
 */
export async function toggleService(id: string) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) {
      return { success: false, error: 'Servicio no encontrado' }
    }

    await prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.services, 'max')
    logger.info(`Service toggled: ${id} -> ${!service.isActive}`)
    return { success: true, isActive: !service.isActive }
  } catch (error) {
    logger.error('Error toggling service:', { error })
    return { success: false, error: 'Error al cambiar el estado del servicio' }
  }
}

/**
 * Reorder services
 */
export async function reorderServices(orderedIds: string[]) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.service.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    )

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.services, 'max')
    logger.info('Services reordered')
    return { success: true }
  } catch (error) {
    logger.error('Error reordering services:', { error })
    return { success: false, error: 'Error al reordenar los servicios' }
  }
}
