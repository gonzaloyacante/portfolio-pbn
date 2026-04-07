'use server'

import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { z } from 'zod'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { ROUTES } from '@/config/routes'

// Validation Schema
const imageOrderSchema = z.object({
  imageId: z.string().cuid(),
  order: z.number().int().min(0),
})

const updateGalleryOrderSchema = z.object({
  categoryId: z.string().cuid(),
  imageOrders: z.array(imageOrderSchema).min(1),
})

/**
 * Update the manual order of images in a category gallery
 */
export async function updateCategoryGalleryOrder(input: z.infer<typeof updateGalleryOrderSchema>) {
  try {
    await requireAdmin()
    const rl = await checkApiRateLimit()
    if (rl) return { success: false, error: rl.error }

    const validated = updateGalleryOrderSchema.parse(input)
    const { categoryId, imageOrders } = validated

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return { success: false, error: 'Categoría no encontrada' }
    }

    await prisma.$transaction(
      imageOrders.map(({ imageId, order }) =>
        prisma.categoryImage.update({
          where: { id: imageId },
          data: { order },
        })
      )
    )

    revalidatePath(`${ROUTES.public.portfolio}/${category.slug}`, 'layout')
    revalidatePath(ROUTES.admin.categories)
    revalidateTag(CACHE_TAGS.categoryImages, 'max')

    return { success: true }
  } catch (error) {
    logger.error('[updateCategoryGalleryOrder] Error:', { error: error })

    if (error instanceof z.ZodError) {
      return { success: false, error: 'Datos inválidos' }
    }

    return { success: false, error: 'Error al actualizar el orden de la galería' }
  }
}

/**
 * Reset gallery order for a category (sequential from 0)
 */
export async function resetCategoryGalleryOrder(categoryId: string) {
  try {
    await requireAdmin()
    const rl2 = await checkApiRateLimit()
    if (rl2) return { success: false, error: rl2.error }

    const images = await prisma.categoryImage.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
      select: { id: true },
    })

    if (images.length === 0) {
      return { success: false, error: 'No hay imágenes en esta categoría' }
    }

    await prisma.$transaction(
      images.map((img, index) =>
        prisma.categoryImage.update({
          where: { id: img.id },
          data: { order: index },
        })
      )
    )

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { slug: true },
    })

    if (category) {
      revalidatePath(`${ROUTES.public.portfolio}/${category.slug}`, 'layout')
    }
    revalidatePath(ROUTES.admin.categories)
    revalidateTag(CACHE_TAGS.categoryImages, 'max')

    return { success: true }
  } catch (error) {
    logger.error('[resetCategoryGalleryOrder] Error:', { error: error })
    return { success: false, error: 'Error al restablecer el orden de la galería' }
  }
}

/**
 * Toggle the isFeatured flag for a single gallery image
 */
export async function toggleCategoryImageFeatured(imageId: string, isFeatured: boolean) {
  try {
    await requireAdmin()
    const rl = await checkApiRateLimit()
    if (rl) return { success: false, error: rl.error }

    z.string().cuid().parse(imageId)
    z.boolean().parse(isFeatured)

    const image = await prisma.categoryImage.update({
      where: { id: imageId },
      data: { isFeatured },
      include: { category: { select: { slug: true } } },
    })

    revalidatePath(ROUTES.home)
    revalidatePath(`${ROUTES.public.portfolio}/${image.category.slug}`)
    revalidateTag(CACHE_TAGS.categoryImages, 'max')

    return { success: true }
  } catch (error) {
    logger.error('[toggleCategoryImageFeatured] Error:', { error })
    return { success: false, error: 'Error al actualizar la imagen' }
  }
}
