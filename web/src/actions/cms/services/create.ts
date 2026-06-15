'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'

import { ServiceSchema } from './schema'
import {
  parseServiceFormFields,
  parseTiersAndGallery,
  revalidatePublicServices,
} from './form-helpers'

/**
 * Create a new service
 */
export async function createService(formData: FormData) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  const validation = ServiceSchema.safeParse(parseServiceFormFields(formData))
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data

  try {
    const { tiersData, galleryList } = parseTiersAndGallery(formData, data)

    await prisma.$transaction(async (tx) => {
      // Compute next sortOrder atomically if none provided
      let finalSortOrder = data.sortOrder
      if (finalSortOrder === 0) {
        const maxResult = await tx.service.aggregate({
          _max: { sortOrder: true },
          where: { deletedAt: null },
        })
        finalSortOrder = (maxResult._max.sortOrder ?? 0) + 1
      }

      const service = await tx.service.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          shortDesc: data.shortDesc,
          price: data.price ?? null,
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
          sortOrder: finalSortOrder,
          requirements: data.requirements,
          cancellationPolicy: data.cancellationPolicy,
        },
        select: { id: true },
      })

      if (tiersData.length > 0) {
        await tx.servicePricingTier.createMany({
          data: tiersData.map((t, idx) => ({
            serviceId: service.id,
            name: t.name,
            price: t.price,
            description: t.description ?? null,
            sortOrder: idx,
          })),
        })
      }
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePublicServices([data.slug])
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
