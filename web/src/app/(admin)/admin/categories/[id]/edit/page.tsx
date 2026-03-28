import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateCategory } from '@/actions/cms/content'
import EditCategoryForm from './EditCategoryForm'

export const metadata = {
  title: 'Editar Categoría | Admin',
  description: 'Editar categoría existente',
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { projects: { where: { isActive: true, deletedAt: null } } },
      },
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <EditCategoryForm
      category={{
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        coverImageUrl: category.coverImageUrl,
        sortOrder: category.sortOrder,
        _count: category._count,
      }}
      updateAction={updateCategory}
    />
  )
}
