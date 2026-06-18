'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { extractPublicIdUrl, deleteMultipleImages } from '@/lib/cloudinary'

import { ServiceSchema } from './schema'
import {
  parseServiceFormFields,
  parseTiersAndGallery,
  revalidatePublicServices,
} from './form-helpers'

/**
 * Update an existing service
 */
export async function updateService(id: string, formData: FormData) {
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
    const newImageUrl = data.imageUrl || galleryList[0] || null

    const previousService = await prisma.service.findUnique({
      where: { id },
      select: { imageUrl: true, galleryUrls: true, slug: true, deletedAt: true },
    })
    if (!previousService || previousService.deletedAt !== null) {
      return { success: false, error: 'Servicio no encontrado' }
    }

    await prisma.$transaction(async (tx) => {
      await tx.service.update({
        where: { id },
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
      await tx.servicePricingTier.deleteMany({ where: { serviceId: id } })
      if (tiersData.length > 0) {
        await tx.servicePricingTier.createMany({
          data: tiersData.map((t, idx) => ({
            serviceId: id,
            name: t.name,
            price: t.price,
            description: t.description ?? null,
            sortOrder: idx,
          })),
        })
      }
    })

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
    revalidatePublicServices([previousService?.slug, data.slug])
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
