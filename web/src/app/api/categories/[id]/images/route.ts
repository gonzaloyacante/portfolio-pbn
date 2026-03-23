import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/security-server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require admin auth
    await requireAdmin()

    const { id } = await params

    // Fetch category with all projects and their images (we'll assemble ordering server-side)
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        projects: {
          where: { isActive: true, deletedAt: null },
          include: { images: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Build gallery order to match public page behavior:
    // - First: all images that have `categoryGalleryOrder` (ascending)
    // - Then: all remaining images, interleaved across projects, ordered by their per-image `order`
    type RawImg = {
      id: string
      url: string
      width?: number | null
      height?: number | null
      title?: string | null
      projectSlug?: string | null
      _catOrder?: number | null
      _order?: number | null
    }

    const imagesFlat: RawImg[] = category.projects.flatMap((project) =>
      (project.images || []).map((img) => ({
        id: img.id,
        url: img.url,
        width: img.width ?? null,
        height: img.height ?? null,
        title: project.title ?? null,
        projectSlug: project.slug ?? null,
        _catOrder: img.categoryGalleryOrder ?? null,
        _order: img.order ?? 0,
      }))
    )

    imagesFlat.sort((a, b) => {
      const aCat = a._catOrder
      const bCat = b._catOrder
      if (aCat != null && bCat != null) return aCat - bCat
      if (aCat != null) return -1
      if (bCat != null) return 1
      return (a._order ?? 0) - (b._order ?? 0)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const images = imagesFlat.map(({ _catOrder: _c, _order: _o, ...rest }) => rest)

    return NextResponse.json({ success: true, images })
  } catch (error) {
    logger.error('[API /categories/[id]/images] Error:', { error: error })
    return NextResponse.json({ success: false, error: 'Error al cargar imágenes' }, { status: 500 })
  }
}
