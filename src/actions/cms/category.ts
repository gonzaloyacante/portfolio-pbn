'use server'

import { prisma } from '@/lib/db'
import { deleteCategory } from '@/actions/cms/content'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'

export async function deleteCategoryAction(categoryId: string): Promise<void> {
  await requireAdmin()
  await deleteCategory(categoryId)
  revalidatePath(ROUTES.admin.categories)
  revalidatePath(ROUTES.public.projects)
}

export async function reorderCategories(categoryIds: string[]): Promise<void> {
  await requireAdmin()
  await Promise.all(
    categoryIds.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )
  revalidatePath(ROUTES.admin.categories)
  revalidatePath(ROUTES.public.projects)
}

export async function getCategoryImages(categoryId: string) {
  await requireAdmin()
  try {
    const projects = await prisma.project.findMany({
      where: { categoryId, isDeleted: false },
      select: {
        title: true,
        images: {
          select: {
            id: true,
            url: true,
            publicId: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    // Flatten images with project context
    const images = projects.flatMap((p) =>
      p.images.map((img) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        projectTitle: p.title,
      }))
    )

    return { success: true, data: images }
  } catch (error) {
    return { success: false, error: 'Error al obtener imágenes de la categoría' }
  }
}
