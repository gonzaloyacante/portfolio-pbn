import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/security-server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require admin auth
    await requireAdmin()

    const { id } = await params

    // Fetch category with its images ordered by position
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    const images = category.images.map((img) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId,
      order: img.order,
    }))

    return NextResponse.json({ success: true, images })
  } catch (error) {
    logger.error('[API /categories/[id]/images] Error:', { error: error })
    return NextResponse.json({ success: false, error: 'Error al cargar imágenes' }, { status: 500 })
  }
}
