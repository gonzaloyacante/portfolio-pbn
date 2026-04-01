'use server'

import { prisma } from '@/lib/db'
import {
  uploadImage,
  deleteImage,
  deleteMultipleImages,
  generateThumbnailUrl,
  extractPublicIdUrl,
} from '@/lib/cloudinary'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { projectFormSchema, categorySchema } from '@/lib/validations'
import { generateSlug } from '@/lib/string-utils'

/**
 * Invalida toda la caché pública relacionada con proyectos y categorías.
 * Debe llamarse después de cualquier mutación que afecte contenido público.
 */
function _revalidatePublicContent() {
  // Full Route Cache: invalida /proyectos y TODAS sus subrutas dinámicas
  revalidatePath(ROUTES.public.projects, 'layout')
  // También invalida la home ya que muestra FeaturedProjects
  revalidatePath(ROUTES.home)
  // Data Cache: invalida las consultas cacheadas con unstable_cache
  revalidateTag(CACHE_TAGS.projects, 'max')
  revalidateTag(CACHE_TAGS.featuredProjects, 'max')
  revalidateTag(CACHE_TAGS.categories, 'max')
}

// ── Private helpers ───────────────────────────────────────────────────────────

type _ImageEntry = { url: string; publicId: string; order: number }

/** Splits a comma-separated field into a trimmed, non-empty string array. */
function _splitCsv(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Extracts all raw project fields from a FormData. */
function _readProjectFormData(formData: FormData) {
  return {
    title: formData.get('title'),
    description: formData.get('description'),
    categoryId: formData.get('categoryId'),
    date: formData.get('date'),
    excerpt: formData.get('excerpt'),
    videoUrl: formData.get('videoUrl'),
    duration: formData.get('duration'),
    client: formData.get('client'),
    isFeatured: formData.get('isFeatured'),
    isPinned: formData.get('isPinned'),
    isActive: formData.get('isActive'),
  }
}

/**
 * Collects images from FormData into ordered entries.
 * Handles pre-uploaded URL strings and raw File objects.
 */
async function _processFormImages(formData: FormData, startOrder = 0): Promise<_ImageEntry[]> {
  const imageInputs = formData.getAll('images')
  const publicIdInputs = formData.getAll('images_public_id')
  const result: _ImageEntry[] = []

  const urlInputs = imageInputs.filter(
    (item): item is string => typeof item === 'string' && item !== ''
  )
  urlInputs.forEach((url, i) => {
    result.push({ url, publicId: (publicIdInputs[i] as string) || '', order: startOrder + i })
  })

  const files = imageInputs.filter((item): item is File => item instanceof File && item.size > 0)
  if (files.length > 0) {
    const uploaded = await Promise.all(
      files.map(async (file, i) => {
        const { url, publicId } = await uploadImage(file)
        return { url, publicId, order: startOrder + result.length + i }
      })
    )
    result.push(...uploaded)
  }

  return result
}

// --- Projects ---

export async function uploadImageAndCreateProject(formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  const validation = projectFormSchema.safeParse(_readProjectFormData(formData))
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data
  const { title, description, categoryId, date } = data

  const validImages = await _processFormImages(formData)
  if (validImages.length === 0) {
    return { success: false, error: 'Se requieren imágenes' }
  }

  try {
    await prisma.project.create({
      data: {
        title,
        slug: generateSlug(title),
        description: description || '',
        date: date ? new Date(date) : new Date(),
        thumbnailUrl: validImages[0]?.url || '',
        categoryId,
        excerpt: data.excerpt,
        videoUrl: data.videoUrl,
        duration: data.duration,
        client: data.client,
        isFeatured: data.isFeatured === 'true' || data.isFeatured === 'on',
        isPinned: data.isPinned === 'true' || data.isPinned === 'on',
        isActive:
          data.isActive === undefined
            ? true
            : data.isActive === 'true' || data.isActive === 'on' || data.isActive === true,
        images: {
          create: validImages.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            order: img.order,
          })),
        },
      },
    })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.projects)
    logger.info(`Project created: ${title}`)
    return { success: true }
  } catch (error) {
    logger.error('Error creating project:', { error })
    return { success: false, error: 'Error al crear el proyecto' }
  }
}

export async function deleteProject(id: string) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    // Fetch project to retrieve its original slug
    const project = await prisma.project.findUnique({
      where: { id },
      select: { slug: true },
    })
    if (!project) throw new Error('Project not found')

    const mangledSlug = `${project.slug}_deleted_${Date.now()}`

    // Soft delete - mark as deleted instead of removing
    await prisma.project.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        isActive: false,
        slug: mangledSlug, // Mangle slug to allow creating new project with same name
      },
    })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.projects)
    revalidatePath(ROUTES.admin.trash)
    logger.info(`Project soft deleted: ${id}`)
    return { success: true, message: 'Proyecto movido a la papelera' }
  } catch (error) {
    logger.error('Error soft deleting project:', { error })
    return { success: false, error: 'Error al eliminar el proyecto' }
  }
}

export async function restoreProject(id: string) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    await prisma.project.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        isActive: true,
      },
    })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.projects)
    revalidatePath(ROUTES.admin.trash)
    logger.info(`Project restored: ${id}`)
    return { success: true, message: 'Proyecto restaurado con éxito' }
  } catch (error) {
    logger.error('Error restoring project:', { error })
    return { success: false, error: 'Error al restaurar el proyecto' }
  }
}

export async function permanentlyDeleteProject(id: string) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!project) throw new Error('Project not found')

    // Delete images from Cloudinary
    await Promise.all(project.images.map((img) => deleteImage(img.publicId)))

    // Delete from DB
    await prisma.project.delete({ where: { id } })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.projects)
    logger.info(`Project permanently deleted: ${id}`)
    return { success: true, message: 'Proyecto eliminado permanentemente' }
  } catch (error) {
    logger.error('Error permanently deleting project:', { error })
    return { success: false, error: 'Error al eliminar permanentemente el proyecto' }
  }
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  const validation = projectFormSchema.safeParse(_readProjectFormData(formData))
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data
  const { title, description, categoryId, date } = data
  const newFiles = formData.getAll('newImages') as File[]

  try {
    // 1. Update core project fields
    await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description || '',
        date: date ? new Date(date) : undefined,
        categoryId,
        excerpt: data.excerpt,
        videoUrl: data.videoUrl,
        duration: data.duration,
        client: data.client,
        isFeatured: data.isFeatured === 'true' || data.isFeatured === 'on',
        isPinned: data.isPinned === 'true' || data.isPinned === 'on',
        isActive:
          data.isActive === undefined
            ? undefined
            : data.isActive === 'true' || data.isActive === 'on' || data.isActive === true,
      },
    })

    // 2. Append new images (pre-uploaded URLs via _processFormImages + legacy raw files)
    const currentCount = await prisma.projectImage.count({ where: { projectId: id } })
    const newImages = await _processFormImages(formData, currentCount)

    if (newFiles.length > 0 && newFiles[0].size > 0) {
      const offset = currentCount + newImages.length
      const uploaded = await Promise.all(
        newFiles.map(async (file, i) => {
          const { url, publicId } = await uploadImage(file)
          return { url, publicId, order: offset + i }
        })
      )
      newImages.push(...uploaded)
    }

    if (newImages.length > 0) {
      await prisma.projectImage.createMany({
        data: newImages.map((img) => ({ ...img, projectId: id })),
      })
    }

    _revalidatePublicContent()
    revalidatePath(`${ROUTES.admin.projects}/${id}`)
    revalidatePath(ROUTES.admin.projects)
    logger.info(`Project updated: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error updating project:', { error })
    return { success: false, error: 'Error al actualizar el proyecto' }
  }
}

export async function reorderProjectImages(
  projectId: string,
  items: { id: string; order: number }[]
) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.projectImage.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    _revalidatePublicContent()
    revalidatePath(`${ROUTES.admin.projects}/${projectId}`)
    logger.info(`Images reordered for project: ${projectId}`)
    return { success: true }
  } catch (error) {
    logger.error('Error reordering images:', { error })
    return { success: false, error: 'Error al reordenar imágenes' }
  }
}

export async function deleteProjectImage(imageId: string) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    const image = await prisma.projectImage.findUnique({
      where: { id: imageId },
      select: { publicId: true, url: true, projectId: true },
    })
    if (!image) throw new Error('Image not found')

    // Delete from DB first to avoid orphaned records if Cloudinary fails
    await prisma.projectImage.delete({ where: { id: imageId } })

    // Recompute thumbnailUrl: use first remaining image or clear it
    const firstRemaining = await prisma.projectImage.findFirst({
      where: { projectId: image.projectId },
      orderBy: [{ isCover: 'desc' as const }, { order: 'asc' as const }],
      select: { url: true },
    })
    await prisma.project.update({
      where: { id: image.projectId },
      data: { thumbnailUrl: firstRemaining?.url ?? '' },
    })

    // Delete from Cloudinary non-blocking — failure doesn't affect the response
    deleteImage(image.publicId).catch((err: Error) => {
      logger.warn('deleteProjectImage: Cloudinary delete failed (non-blocking)', {
        publicId: image.publicId,
        error: err.message,
      })
    })

    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.projects)
    logger.info(`Image deleted: ${imageId}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting image:', { error })
    return { success: false, error: 'Error al eliminar imagen' }
  }
}

// --- Categories ---

export async function createCategory(formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  // File inputs (even empty ones) send File objects via native form submit.
  // Filter them out — only accept string URLs from hidden inputs.
  const _toStringOrNull = (v: FormDataEntryValue | null): string | null =>
    typeof v === 'string' && v !== '' ? v : null

  const rawData = {
    name: formData.get('name'),
    // Auto-generate slug on the server using the robust generateSlug utility
    // (which handles Spanish characters, accents and ñ correctly via NFD normalization)
    slug: (() => {
      const s = formData.get('slug')
      if (typeof s === 'string' && s.trim() !== '') return s.trim()
      const n = formData.get('name')
      return typeof n === 'string' ? generateSlug(n) : ''
    })(),
    description: formData.get('description'),
    coverImageUrl: _toStringOrNull(formData.get('coverImageUrl')),
    thumbnailUrl: _toStringOrNull(formData.get('thumbnailUrl')),
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
        thumbnailUrl: data.thumbnailUrl || null,
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
    thumbnailUrl: _toStringOrNull(formData.get('thumbnailUrl')),
  }

  const validation = categorySchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const { name, slug, description, coverImageUrl } = validation.data
  // Auto-generate thumbnailUrl from coverImageUrl if not explicitly provided
  const thumbnailUrl =
    validation.data.thumbnailUrl ?? (coverImageUrl ? generateThumbnailUrl(coverImageUrl) : null)

  try {
    const previousCategory = await prisma.category.findUnique({
      where: { id },
      select: { coverImageUrl: true },
    })

    await prisma.category.update({
      where: { id },
      data: { name, slug, description, coverImageUrl: coverImageUrl || null, thumbnailUrl },
    })

    // Cloud Wipe: If the cover image changed, delete the old one from Cloudinary
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
    revalidatePath(ROUTES.admin.projects)
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
    // Verificar que no tenga proyectos activos antes de eliminar
    const projectCount = await prisma.project.count({
      where: { categoryId: id, deletedAt: null },
    })
    if (projectCount > 0) {
      return {
        success: false,
        error: `No se puede eliminar la categoría porque contiene ${projectCount} proyecto${projectCount !== 1 ? 's' : ''}. Reasígnalos o elimínalos primero.`,
      }
    }

    // Soft delete: marcar como eliminada y liberar slug único para reutilización
    const cat = await prisma.category.findUnique({ where: { id }, select: { slug: true } })
    const mangledSlug = cat ? `${cat.slug}_deleted_${Date.now()}` : undefined
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), ...(mangledSlug && { slug: mangledSlug }) },
    })
    _revalidatePublicContent()
    revalidatePath(ROUTES.admin.projects)
    revalidatePath(ROUTES.admin.categories)
    logger.info(`Category soft deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting category:', { error })
    return { success: false, error: 'Error al eliminar la categoría' }
  }
}
