'use server'

import { prisma } from '@/lib/db'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

// --- Projects ---

import { z } from 'zod'

// Schemas
const ProjectSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  date: z.string().optional(),
})

const CategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().optional(),
})

// --- Projects ---

export async function uploadImageAndCreateProject(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    categoryId: formData.get('categoryId'),
    date: formData.get('date'),
  }

  const validation = ProjectSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const { title, description, categoryId, date } = validation.data
  const files = formData.getAll('images') as File[]

  if (files.length === 0) {
    return { success: false, error: 'Se requieren imágenes' }
  }

  try {
    // 1. Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const { url, publicId } = await uploadImage(file)
        return { url, publicId, order: index }
      })
    )

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
        thumbnailUrl: uploadedImages[0]?.url || '',
        categoryId,
        images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            order: img.order,
          })),
        },
      },
    })

    revalidatePath('/proyectos')
    revalidatePath('/admin/gestion/projects')
    logger.info(`Project created: ${title}`)
    return { success: true }
  } catch (error) {
    logger.error('Error creating project:', { error })
    return { success: false, error: 'Error al crear el proyecto' }
  }
}

export async function deleteProject(id: string) {
  try {
    // Soft delete - mark as deleted instead of removing
    await prisma.project.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/proyectos')
    revalidatePath('/admin/gestion/projects')
    revalidatePath('/admin/papelera')
    logger.info(`Project soft deleted: ${id}`)
    return { success: true, message: 'Proyecto movido a la papelera' }
  } catch (error) {
    logger.error('Error soft deleting project:', { error })
    return { success: false, error: 'Error al eliminar el proyecto' }
  }
}

export async function restoreProject(id: string) {
  try {
    await prisma.project.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/proyectos')
    revalidatePath('/admin/gestion/projects')
    revalidatePath('/admin/papelera')
    logger.info(`Project restored: ${id}`)
    return { success: true, message: 'Proyecto restaurado con éxito' }
  } catch (error) {
    logger.error('Error restoring project:', { error })
    return { success: false, error: 'Error al restaurar el proyecto' }
  }
}

export async function permanentDeleteProject(id: string) {
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

    revalidatePath('/proyectos')
    revalidatePath('/admin/gestion/projects')
    logger.info(`Project permanently deleted: ${id}`)
    return { success: true, message: 'Proyecto eliminado permanentemente' }
  } catch (error) {
    logger.error('Error permanently deleting project:', { error })
    return { success: false, error: 'Error al eliminar permanentemente el proyecto' }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    categoryId: formData.get('categoryId'),
    date: formData.get('date'),
  }

  const validation = ProjectSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const { title, description, categoryId, date } = validation.data
  const newFiles = formData.getAll('newImages') as File[]

  try {
    // 1. Update basic info
    await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description || '',
        date: date ? new Date(date) : undefined,
        categoryId,
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

    revalidatePath('/proyectos')
    revalidatePath(`/admin/gestion/projects/${id}`)
    revalidatePath('/admin/gestion/projects')
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
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.projectImage.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    revalidatePath('/proyectos')
    revalidatePath(`/admin/gestion/projects/${projectId}`)
    logger.info(`Images reordered for project: ${projectId}`)
    return { success: true }
  } catch (error) {
    logger.error('Error reordering images:', { error })
    return { success: false, error: 'Error al reordenar imágenes' }
  }
}

export async function deleteProjectImage(imageId: string) {
  try {
    const image = await prisma.projectImage.findUnique({ where: { id: imageId } })
    if (!image) throw new Error('Image not found')

    await deleteImage(image.publicId)
    await prisma.projectImage.delete({ where: { id: imageId } })

    revalidatePath('/proyectos')
    logger.info(`Image deleted: ${imageId}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting image:', { error })
    return { success: false, error: 'Error al eliminar imagen' }
  }
}

// --- Categories ---

export async function createCategory(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
  }

  const validation = CategorySchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const { name, slug, description } = validation.data

  try {
    await prisma.category.create({
      data: { name, slug, description },
    })
    revalidatePath('/proyectos')
    revalidatePath('/admin/gestion/categories')
    logger.info(`Category created: ${name}`)
    return { success: true }
  } catch (error) {
    logger.error('Error creating category:', { error })
    return { success: false, error: 'Error al crear la categoría' }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
  }

  const validation = CategorySchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const { name, slug, description } = validation.data

  try {
    await prisma.category.update({
      where: { id },
      data: { name, slug, description },
    })
    revalidatePath('/proyectos')
    revalidatePath('/admin/gestion/categories')
    logger.info(`Category updated: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error updating category:', { error })
    return { success: false, error: 'Error al actualizar la categoría' }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath('/proyectos')
    revalidatePath('/admin/gestion/categories')
    logger.info(`Category deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting category:', { error })
    return { success: false, error: 'Error al eliminar la categoría' }
  }
}
