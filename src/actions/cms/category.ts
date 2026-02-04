'use server'

import { prisma } from '@/lib/db'
import { deleteCategory } from '@/actions/cms/content'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'

export async function deleteCategoryAction(categoryId: string): Promise<void> {
  await deleteCategory(categoryId)
  revalidatePath(ROUTES.admin.categories)
  revalidatePath(ROUTES.public.projects)
}

export async function reorderCategories(categoryIds: string[]): Promise<void> {
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
