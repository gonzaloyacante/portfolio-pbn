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
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)
  await deleteCategory(categoryId)
  revalidatePath(ROUTES.admin.categories)
  // _revalidatePublicContent ya fue llamado dentro de deleteCategory
}

export async function reorderCategories(categoryIds: string[]): Promise<void> {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)

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
  revalidatePath(ROUTES.public.portfolio, 'layout')
  revalidateTag(CACHE_TAGS.categories, 'max')
  revalidateTag(CACHE_TAGS.categoryImages, 'max')
}

export async function getCategoryImages(categoryId: string) {
  await requireAdmin()
  try {
    const images = await prisma.categoryImage.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        url: true,
        publicId: true,
        order: true,
        width: true,
        height: true,
        isFeatured: true,
      },
    })
    return { success: true, data: images }
  } catch {
    return { success: false, error: 'Database error' }
  }
}
