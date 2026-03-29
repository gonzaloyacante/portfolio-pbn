'use server'

import { prisma } from '@/lib/db'
import { deleteCategory } from '@/actions/cms/content'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'

import { z } from 'zod'

const ReorderCategoriesSchema = z.array(z.string().cuid()).min(1)

export async function deleteCategoryAction(categoryId: string): Promise<void> {
  await requireAdmin()
  await checkApiRateLimit()
  await deleteCategory(categoryId)
  revalidatePath(ROUTES.admin.categories)
  // _revalidatePublicContent ya fue llamado dentro de deleteCategory
}

export async function reorderCategories(categoryIds: string[]): Promise<void> {
  await requireAdmin()
  await checkApiRateLimit()

  const parsed = ReorderCategoriesSchema.safeParse(categoryIds)
  if (!parsed.success) {
    throw new Error('IDs de categoría inválidos')
  }

  await prisma.$transaction(
    parsed.data.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )
  revalidatePath(ROUTES.admin.categories)
  revalidatePath(ROUTES.public.projects, 'layout')
  revalidateTag(CACHE_TAGS.categories, 'max')
  revalidateTag(CACHE_TAGS.projects, 'max')
}

export async function getCategoryImages(categoryId: string) {
  await requireAdmin()
  try {
    const projects = await prisma.project.findMany({
      where: { categoryId, deletedAt: null },
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
  } catch {
    return { success: false, error: 'Database error' }
  }
}
