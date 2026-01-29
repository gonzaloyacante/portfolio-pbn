'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'

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
  price: z.coerce.number().positive().optional().nullable(),
  priceLabel: z.enum(['desde', 'fijo', 'consultar']).default('desde'),
  duration: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  iconName: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
})

// ============================================
// PUBLIC ACTIONS
// ============================================

/**
 * Get active services for public display
 */
export async function getActiveServices(limit?: number) {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    })
    return services
  } catch (error) {
    logger.error('Error fetching active services:', { error })
    return []
  }
}

/**
 * Get featured services for homepage
 */
export async function getFeaturedServices(limit = 3) {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    })
    return services
  } catch (error) {
    logger.error('Error fetching featured services:', { error })
    return []
  }
}

/**
 * Get service by slug for detail page
 */
export async function getServiceBySlug(slug: string) {
  try {
    return await prisma.service.findUnique({
      where: { slug },
    })
  } catch (error) {
    logger.error('Error fetching service by slug:', { error })
    return null
  }
}

// ============================================
// ADMIN ACTIONS
// ============================================

/**
 * Get all services for admin
 */
export async function getAllServices() {
  try {
    return await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  } catch (error) {
    logger.error('Error fetching all services:', { error })
    return []
  }
}

/**
 * Create a new service
 */
export async function createService(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price') || null,
    priceLabel: formData.get('priceLabel') || 'desde',
    duration: formData.get('duration'),
    imageUrl: formData.get('imageUrl'),
    iconName: formData.get('iconName'),
    isActive: formData.get('isActive') === 'true',
    isFeatured: formData.get('isFeatured') === 'true',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
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

    await prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price ? data.price : null,
        priceLabel: data.priceLabel,
        duration: data.duration || null,
        imageUrl: data.imageUrl || null,
        iconName: data.iconName || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
      },
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services)
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
  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price') || null,
    priceLabel: formData.get('priceLabel') || 'desde',
    duration: formData.get('duration'),
    imageUrl: formData.get('imageUrl'),
    iconName: formData.get('iconName'),
    isActive: formData.get('isActive') === 'true',
    isFeatured: formData.get('isFeatured') === 'true',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
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

    await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price ? data.price : null,
        priceLabel: data.priceLabel,
        duration: data.duration || null,
        imageUrl: data.imageUrl || null,
        iconName: data.iconName || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
      },
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services)
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
  try {
    await prisma.service.delete({ where: { id } })

    revalidatePath(ROUTES.admin.services)
    revalidatePath(ROUTES.public.services)
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
    revalidatePath(ROUTES.public.services)
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
    revalidatePath(ROUTES.public.services)
    logger.info('Services reordered')
    return { success: true }
  } catch (error) {
    logger.error('Error reordering services:', { error })
    return { success: false, error: 'Error al reordenar los servicios' }
  }
}
