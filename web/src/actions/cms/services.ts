'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { z } from 'zod'

import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { extractPublicIdUrl, deleteMultipleImages } from '@/lib/cloudinary'

// ============================================
// VALIDATION SCHEMA
// ============================================

const ServiceSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(150, 'Nombre muy largo'),
  slug: z
    .string()
    .trim()
    .min(1, 'El slug es obligatorio')
    .max(160, 'Slug muy largo')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string().trim().max(2000, 'Descripción muy larga').optional(),
  shortDesc: z.string().trim().max(300, 'Resumen muy largo').optional(),

  // Pricing
  price: z.coerce.number().optional().nullable(),
  priceLabel: z.enum(['desde', 'fijo', 'consultar', 'gratis']).default('desde'),
  currency: z.string().default('EUR'),

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

  // Display
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),

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
        include: {
          pricingTiers: { orderBy: { sortOrder: 'asc' } },
        },
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
        where: { deletedAt: null },
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
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    shortDesc: formData.get('shortDesc'),
    // Pricing
    price: formData.get('price') || null,
    priceLabel: formData.get('priceLabel') || 'desde',
    currency: formData.get('currency') || 'EUR',
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
    // Display
    isActive: formData.get('isActive') === 'true' || formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'true' || formData.get('isFeatured') === 'on',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
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
    // Read pricing tiers from individual form fields (no JSON blobs)
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

    const service = await prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        shortDesc: data.shortDesc,
        price: data.price ? data.price : null,
        priceLabel: data.priceLabel,
        currency: data.currency,
        duration: data.duration || null,
        durationMinutes: data.durationMinutes || null,
        isAvailable: data.isAvailable,
        maxBookingsPerDay: data.maxBookingsPerDay,
        advanceNoticeDays: data.advanceNoticeDays,
        imageUrl: data.imageUrl || galleryList[0] || null,
        galleryUrls: galleryList,
        videoUrl: data.videoUrl || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        requirements: data.requirements,
        cancellationPolicy: data.cancellationPolicy,
      },
      select: { id: true },
    })

    if (tiersData.length > 0) {
      await prisma.servicePricingTier.createMany({
        data: tiersData.map((t, idx) => ({
          serviceId: service.id,
          name: t.name,
          price: t.price,
          description: t.description ?? null,
          sortOrder: idx,
        })),
      })
    }

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.services, 'max')
    logger.info(`Service created: ${data.name}`)
    return { success: true }
  } catch (error: unknown) {
    // Handle duplicate slug (P2002 unique constraint violation)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return { success: false, error: 'Ya existe un servicio con ese slug' }
    }
    logger.error('Error creating service:', { error })
    return { success: false, error: 'Error al crear el servicio' }
  }
}

/**
 * Update an existing service
 */
export async function updateService(id: string, formData: FormData) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    shortDesc: formData.get('shortDesc'),
    // Pricing
    price: formData.get('price') || null,
    priceLabel: formData.get('priceLabel') || 'desde',
    currency: formData.get('currency') || 'EUR',
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
    // Display
    isActive: formData.get('isActive') === 'true' || formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'true' || formData.get('isFeatured') === 'on',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
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
    // Read pricing tiers from individual form fields (no JSON blobs)
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

    const rawGalleryInputs = formData.getAll('galleryUrls').filter(Boolean) as string[]
    const galleryList = rawGalleryInputs.length
      ? rawGalleryInputs.map((u) => u.trim())
      : data.galleryUrls
        ? data.galleryUrls
            .split(',')
            .map((u) => u.trim())
            .filter(Boolean)
        : []

    const newImageUrl = data.imageUrl || galleryList[0] || null

    const previousService = await prisma.service.findUnique({
      where: { id },
      select: { imageUrl: true, galleryUrls: true },
    })

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
        duration: data.duration || null,
        durationMinutes: data.durationMinutes || null,
        isAvailable: data.isAvailable,
        maxBookingsPerDay: data.maxBookingsPerDay,
        advanceNoticeDays: data.advanceNoticeDays,
        imageUrl: newImageUrl,
        galleryUrls: galleryList,
        videoUrl: data.videoUrl || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        requirements: data.requirements,
        cancellationPolicy: data.cancellationPolicy,
      },
    })

    // Always sync tiers to match the submitted form state
    await prisma.servicePricingTier.deleteMany({ where: { serviceId: id } })
    if (tiersData.length > 0) {
      await prisma.servicePricingTier.createMany({
        data: tiersData.map((t, idx) => ({
          serviceId: id,
          name: t.name,
          price: t.price,
          description: t.description ?? null,
          sortOrder: idx,
        })),
      })
    }

    // Cloud Wipe and permanently delete them from Cloudinary
    if (previousService) {
      const publicIdsToDelete: string[] = []

      // Check if main imageUrl was replaced/removed
      if (previousService.imageUrl && previousService.imageUrl !== newImageUrl) {
        const pId = extractPublicIdUrl(previousService.imageUrl)
        if (pId) publicIdsToDelete.push(pId)
      }

      // Check if any gallery image was removed
      const newGallerySet = new Set(galleryList)
      previousService.galleryUrls.forEach((oldUrl) => {
        if (!newGallerySet.has(oldUrl)) {
          const pId = extractPublicIdUrl(oldUrl)
          if (pId && !publicIdsToDelete.includes(pId)) publicIdsToDelete.push(pId)
        }
      })

      if (publicIdsToDelete.length > 0) {
        deleteMultipleImages(publicIdsToDelete).catch((err: Error) =>
          logger.warn('[updateService] Orphan sweep failed', {
            id,
            publicIds: publicIdsToDelete,
            error: err.message,
          })
        )
      }
    }

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.services, 'max')
    logger.info(`Service updated: ${id}`)
    return { success: true }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return { success: false, error: 'Ya existe otro servicio con ese slug' }
    }
    logger.error('Error updating service:', { error })
    return { success: false, error: 'Error al actualizar el servicio' }
  }
}

/**
 * Delete a service
 */
export async function deleteService(id: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  try {
    // Soft delete: marcar como eliminado y liberar slug único para reutilización
    const svc = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
    const mangledSlug = svc ? `${svc.slug}_deleted_${Date.now()}` : undefined
    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, ...(mangledSlug && { slug: mangledSlug }) },
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services, 'layout')
    revalidateTag(CACHE_TAGS.services, 'max')
    logger.info(`Service soft deleted: ${id}`)
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
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

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
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

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
