'use server'

import { prisma } from '@/lib/db'
import {
  uploadImage,
  deleteImage,
  deleteMultipleImages,
  extractPublicIdUrl,
} from '@/lib/cloudinary'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { categorySchema } from '@/lib/validations'
import { generateSlug } from '@/lib/string-utils'

/**
 * Invalida toda la caché pública relacionada con categorías e imágenes.
 * Debe llamarse después de cualquier mutación que afecte contenido público.
 */
function _revalidatePublicContent() {
  revalidatePath(ROUTES.public.portfolio, 'layout')
  revalidatePath(ROUTES.home)
  revalidateTag(CACHE_TAGS.categories, 'max')
  revalidateTag(CACHE_TAGS.categoryImages, 'max')
}

// --- Categories ---

export async function createCategory(formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  const _toStringOrNull = (v: FormDataEntryValue | null): string | null =>
    typeof v === 'string' && v !== '' ? v : null

  const rawData = {
    name: formData.get('name'),
    slug: (() => {
      const s = formData.get('slug')
      if (typeof s === 'string' && s.trim() !== '') return s.trim()
      const n = formData.get('name')
      return typeof n === 'string' ? generateSlug(n) : ''
    })(),
    description: formData.get('description'),
    coverImageUrl: _toStringOrNull(formData.get('coverImageUrl')),
  }

  const validation = categorySchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data

  try {
    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        coverImageUrl: data.coverImageUrl || null,
      },
    })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.categories)
    logger.info(`Category created: ${data.name}`)
    return { success: true }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return { success: false, error: 'Ya existe una categoría con ese slug' }
    }
    logger.error('Error creating category:', { error })
    return { success: false, error: 'Error al crear la categoría' }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  const _toStringOrNull = (v: FormDataEntryValue | null): string | null =>
    typeof v === 'string' && v !== '' ? v : null

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    coverImageUrl: _toStringOrNull(formData.get('coverImageUrl')),
  }

  const validation = categorySchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const { name, slug, description, coverImageUrl } = validation.data

  try {
    const previousCategory = await prisma.category.findUnique({
      where: { id },
      select: { coverImageUrl: true },
    })

    await prisma.category.update({
      where: { id },
      data: { name, slug, description, coverImageUrl: coverImageUrl || null },
    })

    if (
      previousCategory?.coverImageUrl &&
      previousCategory.coverImageUrl !== (coverImageUrl || null)
    ) {
      const pId = extractPublicIdUrl(previousCategory.coverImageUrl)
      if (pId) {
        deleteMultipleImages([pId]).catch((err: Error) =>
          logger.warn('[updateCategory] Orphan sweep failed', {
            id,
            publicId: pId,
            error: err.message,
          })
        )
      }
    }

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.categories)
    logger.info(`Category updated: ${id}`)
    return { success: true }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return { success: false, error: 'Ya existe otra categoría con ese slug' }
    }
    logger.error('Error updating category:', { error })
    return { success: false, error: 'Error al actualizar la categoría' }
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    const cat = await prisma.category.findUnique({ where: { id }, select: { slug: true } })
    const mangledSlug = cat ? `${cat.slug}_deleted_${Date.now()}` : undefined
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), ...(mangledSlug && { slug: mangledSlug }) },
    })
    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.categories)
    logger.info(`Category soft deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting category:', { error })
    return { success: false, error: 'Error al eliminar la categoría' }
  }
}

// --- Category Images ---

export async function addCategoryImages(
  categoryId: string,
  files: File[]
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    const currentCount = await prisma.categoryImage.count({ where: { categoryId } })
    const uploaded = await Promise.all(
      files.map(async (file, i) => {
        const { url, publicId } = await uploadImage(file)
        return { url, publicId, order: currentCount + i, categoryId }
      })
    )
    await prisma.categoryImage.createMany({ data: uploaded })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.categories)
    logger.info(`${files.length} image(s) added to category: ${categoryId}`)
    return { success: true }
  } catch (error) {
    logger.error('Error adding category images:', { error })
    return { success: false, error: 'Error al subir imágenes' }
  }
}

/**
 * Guarda imágenes ya subidas a Cloudinary en la galería de una categoría.
 * Diseñado para el flujo del panel admin web donde la subida a Cloudinary
 * ocurre primero (via /api/upload) y luego se persisten los metadatos en DB.
 */
export async function saveGalleryImages(
  categoryId: string,
  images: { url: string; publicId: string; width?: number; height?: number }[]
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    if (!categoryId || images.length === 0) {
      return { success: false, error: 'Categoría e imágenes son requeridos' }
    }

    // Verificar que la categoría existe y no está eliminada
    const category = await prisma.category.findFirst({
      where: { id: categoryId, deletedAt: null },
      select: { id: true, slug: true },
    })
    if (!category) {
      return { success: false, error: 'Categoría no encontrada' }
    }

    const currentCount = await prisma.categoryImage.count({ where: { categoryId } })

    const toCreate = images.map((img, i) => ({
      url: img.url,
      publicId: img.publicId,
      width: img.width ?? null,
      height: img.height ?? null,
      categoryId,
      order: currentCount + i,
    }))

    await prisma.categoryImage.createMany({ data: toCreate })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.categories)
    revalidatePath(ROUTES.admin.categoryGallery(categoryId))
    if (category.slug) {
      revalidatePath(`${ROUTES.public.portfolio}/${category.slug}`)
    }
    revalidateTag(CACHE_TAGS.categoryImages, 'max')

    logger.info(`${images.length} image(s) saved to category gallery: ${categoryId}`)
    return { success: true }
  } catch (error) {
    logger.error('Error saving gallery images:', { error })
    return { success: false, error: 'Error al guardar imágenes en la galería' }
  }
}

export async function deleteCategoryImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    const image = await prisma.categoryImage.findUnique({
      where: { id: imageId },
      select: { publicId: true, categoryId: true },
    })
    if (!image) throw new Error('Image not found')

    await prisma.categoryImage.delete({ where: { id: imageId } })

    deleteImage(image.publicId).catch((err: Error) => {
      logger.warn('deleteCategoryImage: Cloudinary delete failed (non-blocking)', {
        publicId: image.publicId,
        error: err.message,
      })
    })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.categories)
    logger.info(`Category image deleted: ${imageId}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting category image:', { error })
    return { success: false, error: 'Error al eliminar imagen' }
  }
}

export async function reorderCategoryImages(
  categoryId: string,
  items: { id: string; order: number }[]
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.categoryImage.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.categories)
    logger.info(`Images reordered for category: ${categoryId}`)
    return { success: true }
  } catch (error) {
    logger.error('Error reordering category images:', { error })
    return { success: false, error: 'Error al reordenar imágenes' }
  }
}
