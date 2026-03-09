/**
 * GET  /api/admin/categories/[id]/gallery  — Todas las imágenes de proyectos de una categoría
 * PUT  /api/admin/categories/[id]/gallery  — Actualizar orden de la galería
 *
 * El orden `categoryGalleryOrder` es independiente del orden dentro del proyecto.
 * Nulos al final: las imágenes sin orden asignado aparecen al último.
 */

import { NextResponse } from 'next/server'

import { generateThumbnailUrl } from '@/lib/cloudinary'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id: categoryId } = await params

    // Verificar que la categoría existe
    const category = await prisma.category.findFirst({
      where: { id: categoryId, deletedAt: null },
      select: { id: true, name: true },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Obtener todos los ProjectImage de los proyectos de esta categoría,
    // ordenados primero por categoryGalleryOrder (nulls al final), luego por order
    // (mismo criterio que la galería pública y el endpoint /api/categories/[id]/images)
    const images = await prisma.projectImage.findMany({
      where: {
        project: {
          categoryId,
          deletedAt: null,
        },
      },
      select: {
        id: true,
        url: true,
        publicId: true,
        alt: true,
        caption: true,
        width: true,
        height: true,
        isCover: true,
        isHero: true,
        categoryGalleryOrder: true,
        order: true,
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [
        // Nulls al final: imágenes con orden asignado primero
        { categoryGalleryOrder: { sort: 'asc', nulls: 'last' } },
        // Fallback: orden dentro del proyecto (igual que la galería pública)
        { order: 'asc' },
      ],
    })

    const data = images.map((img) => ({
      id: img.id,
      url: img.url,
      thumbnailUrl: generateThumbnailUrl(img.url),
      publicId: img.publicId,
      alt: img.alt ?? img.project.title,
      caption: img.caption,
      width: img.width,
      height: img.height,
      isCover: img.isCover,
      isHero: img.isHero,
      categoryGalleryOrder: img.categoryGalleryOrder,
      projectId: img.project.id,
      projectTitle: img.project.title,
      projectSlug: img.project.slug,
    }))

    return NextResponse.json({ success: true, data })
  } catch (err) {
    logger.error('GET category gallery error', err as Record<string, unknown>)
    return NextResponse.json(
      { success: false, error: 'Error al obtener la galería' },
      { status: 500 }
    )
  }
}

// ── PUT ───────────────────────────────────────────────────────────────────────

/**
 * Body: { order: [{ id: string, order: number }] }
 * Actualiza categoryGalleryOrder para cada imagen indicada.
 */
export async function PUT(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id: categoryId } = await params

    const body = await req.json()
    const order: { id: string; order: number }[] = body?.order

    if (!Array.isArray(order)) {
      return NextResponse.json(
        { success: false, error: 'El campo "order" es requerido y debe ser un array' },
        { status: 400 }
      )
    }

    // Verificar que la categoría existe
    const category = await prisma.category.findFirst({
      where: { id: categoryId, deletedAt: null },
      select: { id: true },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Array vacío = resetear todo el orden (poner null a todas las imágenes)
    if (order.length === 0) {
      await prisma.projectImage.updateMany({
        where: { project: { categoryId, deletedAt: null } },
        data: { categoryGalleryOrder: null },
      })
      return NextResponse.json({ success: true })
    }

    // Actualizar el orden de cada imagen en una transaction
    await prisma.$transaction(
      order.map(({ id, order: galleryOrder }) =>
        prisma.projectImage.updateMany({
          where: {
            id,
            project: { categoryId },
          },
          data: { categoryGalleryOrder: galleryOrder },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('PUT category gallery order error', err as Record<string, unknown>)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el orden de la galería' },
      { status: 500 }
    )
  }
}
