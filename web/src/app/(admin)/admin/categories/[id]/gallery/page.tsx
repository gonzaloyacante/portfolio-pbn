import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/security-server'
import CategoryGalleryEditor from '@/components/features/categories/CategoryGalleryEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editor de Galería | Admin',
  description: 'Reordena las fotos de la galería pública de esta categoría',
}

// No cache: siempre muestra el orden más reciente
export const dynamic = 'force-dynamic'

export default async function CategoryGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id, deletedAt: null },
    include: {
      images: { orderBy: { order: 'asc' } },
    },
  })

  if (!category) notFound()

  const allImages = category.images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: category.name,
    title: category.name,
    width: img.width,
    height: img.height,
    isFeatured: img.isFeatured,
  }))

  return (
    <div className="mx-auto max-w-7xl">
      <CategoryGalleryEditor
        categoryId={category.id}
        categoryName={category.name}
        initialImages={allImages}
      />
    </div>
  )
}
