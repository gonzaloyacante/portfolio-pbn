'use server'

import { prisma } from '@/lib/db'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { projectFormSchema, categorySchema } from '@/lib/validations'

// --- Projects ---

export async function uploadImageAndCreateProject(formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    categoryId: formData.get('categoryId'),
    date: formData.get('date'),
    excerpt: formData.get('excerpt'),
    videoUrl: formData.get('videoUrl'),
    duration: formData.get('duration'),
    client: formData.get('client'),
    location: formData.get('location'),
    tags: formData.get('tags'),
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    metaKeywords: formData.get('metaKeywords'),
    canonicalUrl: formData.get('canonicalUrl'),
    layout: formData.get('layout'),
    isFeatured: formData.get('isFeatured'),
    isPinned: formData.get('isPinned'),
  }

  const validation = projectFormSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data
  const { title, description, categoryId, date } = data

  // Handle images: could be Files (unused input) or Strings (hidden input URLs)
  const imageInputs = formData.getAll('images')
  const publicIdInputs = formData.getAll('images_public_id')

  const validImages: { url: string; publicId: string; order: number }[] = []

  // 1. Process pre-uploaded images (Strings)
  const urlInputs = imageInputs.filter(
    (item): item is string => typeof item === 'string' && item !== ''
  )

  if (urlInputs.length > 0) {
    urlInputs.forEach((url, index) => {
      const publicId = (publicIdInputs[index] as string) || ''
      validImages.push({ url, publicId, order: index })
    })
  }

  // 2. Process raw files (if any - fallback)
  const fileInputs = imageInputs.filter(
    (item): item is File => item instanceof File && item.size > 0
  )

  if (fileInputs.length > 0) {
    const uploaded = await Promise.all(
      fileInputs.map(async (file, index) => {
        const { url, publicId } = await uploadImage(file)
        return { url, publicId, order: validImages.length + index }
      })
    )
    validImages.push(...uploaded)
  }

  if (validImages.length === 0) {
    return { success: false, error: 'Se requieren imágenes' }
  }

  try {
    // Parse tags and keywords
    const tagList = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []
    const keywordList = data.metaKeywords
      ? data.metaKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : []

    // 2. Create Project in DB
    await prisma.project.create({
      data: {
        title,
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        description: description || '',
        date: date ? new Date(date) : new Date(),
        thumbnailUrl: validImages[0]?.url || '',
        categoryId,
        // New fields
        excerpt: data.excerpt,
        videoUrl: data.videoUrl,
        duration: data.duration,
        client: data.client,
        location: data.location,
        tags: tagList,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: keywordList,
        canonicalUrl: data.canonicalUrl,
        layout: data.layout || 'grid',
        isFeatured: data.isFeatured === 'true' || data.isFeatured === 'on',
        isPinned: data.isPinned === 'true' || data.isPinned === 'on',
        images: {
          create: validImages.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            order: img.order,
          })),
        },
      },
    })

    revalidatePath(ROUTES.public.projects)
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
    // Soft delete - mark as deleted instead of removing
    await prisma.project.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath(ROUTES.public.projects)
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
      },
    })

    revalidatePath(ROUTES.public.projects)
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

    revalidatePath(ROUTES.public.projects)
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

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    categoryId: formData.get('categoryId'),
    date: formData.get('date'),
    excerpt: formData.get('excerpt'),
    videoUrl: formData.get('videoUrl'),
    duration: formData.get('duration'),
    client: formData.get('client'),
    location: formData.get('location'),
    tags: formData.get('tags'),
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    metaKeywords: formData.get('metaKeywords'),
    canonicalUrl: formData.get('canonicalUrl'),
    layout: formData.get('layout'),
    isFeatured: formData.get('isFeatured'),
    isPinned: formData.get('isPinned'),
  }

  const validation = projectFormSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data
  const { title, description, categoryId, date } = data
  const newFiles = formData.getAll('newImages') as File[]

  try {
    // Parse tags and keywords
    const tagList = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []
    const keywordList = data.metaKeywords
      ? data.metaKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : []

    // 1. Update basic info
    await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description || '',
        date: date ? new Date(date) : undefined,
        categoryId,
        // New fields
        excerpt: data.excerpt,
        videoUrl: data.videoUrl,
        duration: data.duration,
        client: data.client,
        location: data.location,
        tags: tagList,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: keywordList,
        canonicalUrl: data.canonicalUrl,
        layout: data.layout,
        isFeatured: data.isFeatured === 'true' || data.isFeatured === 'on',
        isPinned: data.isPinned === 'true' || data.isPinned === 'on',
      },
    })

    // 2. Upload new images if any
    if (newFiles.length > 0 && newFiles[0].size > 0) {
      const currentImagesCount = await prisma.projectImage.count({ where: { projectId: id } })

      const uploadedImages = await Promise.all(
        newFiles.map(async (file, index) => {
          const { url, publicId } = await uploadImage(file)
          return { url, publicId, order: currentImagesCount + index }
        })
      )

      await prisma.projectImage.createMany({
        data: uploadedImages.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          order: img.order,
          projectId: id,
        })),
      })
    }

    revalidatePath(ROUTES.public.projects)
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

    revalidatePath(ROUTES.public.projects)
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
    const image = await prisma.projectImage.findUnique({ where: { id: imageId } })
    if (!image) throw new Error('Image not found')

    await deleteImage(image.publicId)
    await prisma.projectImage.delete({ where: { id: imageId } })

    revalidatePath(ROUTES.public.projects)
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

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    coverImageUrl: formData.get('coverImageUrl'),
    thumbnailUrl: formData.get('thumbnailUrl'),
  }

  const validation = categorySchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data

  try {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return { success: false, error: 'Ya existe una categoría con ese slug' }
    }

    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        coverImageUrl: data.coverImageUrl || null,
        thumbnailUrl: data.thumbnailUrl || null,
      },
    })

    revalidatePath(ROUTES.public.projects)
    revalidatePath(ROUTES.admin.categories)
    logger.info(`Category created: ${data.name}`)
    return { success: true }
  } catch (error) {
    logger.error('Error creating category:', { error })
    return { success: false, error: 'Error al crear la categoría' }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin()
  await checkApiRateLimit()

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    coverImageUrl: formData.get('coverImageUrl'),
  }

  const validation = categorySchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const { name, slug, description, coverImageUrl } = validation.data

  try {
    await prisma.category.update({
      where: { id },
      data: { name, slug, description, coverImageUrl },
    })
    revalidatePath(ROUTES.public.projects)
    revalidatePath(ROUTES.admin.projects)
    logger.info(`Category updated: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error updating category:', { error })
    return { success: false, error: 'Error al actualizar la categoría' }
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath(ROUTES.public.projects)
    revalidatePath(ROUTES.admin.projects)
    logger.info(`Category deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting category:', { error })
    return { success: false, error: 'Error al eliminar la categoría' }
  }
}
