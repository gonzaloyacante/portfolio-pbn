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
      projects: {
        where: { deletedAt: null, isActive: true },
        include: {
          images: {
            select: {
              id: true,
              url: true,
              alt: true,
              title: true,
              width: true,
              height: true,
              order: true,
              categoryGalleryOrder: true,
            },
          },
        },
      },
    },
  })

  if (!category) notFound()

  // Flatten all images from all projects and sort globally by categoryGalleryOrder
  // Images with a manual order come first; the rest fall back to project-level order
  const allImages = category.projects
    .flatMap((project) =>
      project.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || project.title,
        title: project.title,
        width: img.width,
        height: img.height,
        categoryGalleryOrder: img.categoryGalleryOrder,
        _order: img.order,
      }))
    )
    .sort((a, b) => {
      if (a.categoryGalleryOrder != null && b.categoryGalleryOrder != null) {
        return a.categoryGalleryOrder - b.categoryGalleryOrder
      }
      if (a.categoryGalleryOrder != null) return -1
      if (b.categoryGalleryOrder != null) return 1
      return (a._order ?? 0) - (b._order ?? 0)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ _order, ...img }) => img)

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
