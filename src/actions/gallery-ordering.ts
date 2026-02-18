'use server'

import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/security-server'

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
    // Security: Require admin
    await requireAdmin()

    // Validate input
    const validated = updateGalleryOrderSchema.parse(input)
    const { categoryId, imageOrders } = validated

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return { success: false, error: 'Categoría no encontrada' }
    }

    // Batch update all images in a transaction
    await prisma.$transaction(
      imageOrders.map(({ imageId, order }) =>
        prisma.projectImage.update({
          where: { id: imageId },
          data: { categoryGalleryOrder: order },
        })
      )
    )

    // Revalidate category page
    revalidatePath(`/proyectos/${category.slug}`)
    revalidatePath(`/cms/categorias/${categoryId}`)

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
 * Reset gallery order for a category (set all to NULL)
 */
export async function resetCategoryGalleryOrder(categoryId: string) {
  try {
    // Security: Require admin
    await requireAdmin()

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        projects: {
          include: { images: true },
        },
      },
    })

    if (!category) {
      return { success: false, error: 'Categoría no encontrada' }
    }

    // Get all image IDs from all projects in this category
    const imageIds = category.projects.flatMap((project) => project.images.map((img) => img.id))

    if (imageIds.length === 0) {
      return { success: false, error: 'No hay imágenes en esta categoría' }
    }

    // Reset all to NULL
    await prisma.projectImage.updateMany({
      where: { id: { in: imageIds } },
      data: { categoryGalleryOrder: null },
    })

    // Revalidate
    revalidatePath(`/proyectos/${category.slug}`)
    revalidatePath(`/cms/categorias/${categoryId}`)

    return { success: true }
  } catch (error) {
    logger.error('[resetCategoryGalleryOrder] Error:', { error: error })
    return { success: false, error: 'Error al restablecer el orden de la galería' }
  }
}
