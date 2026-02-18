import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/security-server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require admin auth
    await requireAdmin()

    const { id } = await params

    // Fetch category with all images from all projects
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        projects: {
          where: { isActive: true, isDeleted: false },
          include: {
            images: {
              orderBy: [
                { categoryGalleryOrder: 'asc' }, // Manual order first
                { order: 'asc' }, // Fallback to project order
              ],
            },
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Flatten all images from all projects
    const images = category.projects.flatMap((project) =>
      project.images.map((img) => ({
        id: img.id,
        url: img.url,
        width: img.width,
        height: img.height,
        title: project.title,
        projectSlug: project.slug,
      }))
    )

    return NextResponse.json({ success: true, images })
  } catch (error) {
    logger.error('[API /categories/[id]/images] Error:', { error: error })
    return NextResponse.json({ success: false, error: 'Error al cargar imágenes' }, { status: 500 })
  }
}
