/**
 * GET  /api/admin/categories/[id]/gallery  — Todas las imágenes de una categoría
 * PUT  /api/admin/categories/[id]/gallery  — Actualizar orden de la galería
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { ROUTES } from '@/config/routes'

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

    const images = await prisma.categoryImage.findMany({
      where: { categoryId },
      select: { id: true, url: true, publicId: true, order: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, data: images })
  } catch (err) {
    logger.error('GET category gallery error', err as Record<string, unknown>)
    return NextResponse.json(
      { success: false, error: 'Error al obtener la galería' },
      { status: 500 }
    )
  }
}

// ── POST (Agregar imágenes a la galería) ───────────────────────────────────
export async function POST(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id: categoryId } = await params

    const body = await req.json()
    const images: { url: string; publicId: string }[] = body?.images

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El campo "images" es requerido y debe ser un array' },
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

    // Calcular el siguiente índice de orden disponible
    const currentCount = await prisma.categoryImage.count({ where: { categoryId } })

    const toCreate = images.map((img, i) => ({
      url: img.url,
      publicId: img.publicId,
      categoryId,
      order: currentCount + i,
    }))

    await prisma.categoryImage.createMany({ data: toCreate })

    // Revalidate
    revalidatePath(ROUTES.admin.categories)
    revalidateTag(CACHE_TAGS.categoryImages, 'max')

    logger.info(`${images.length} image(s) added to category: ${categoryId}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST category gallery add error', err as Record<string, unknown>)
    return NextResponse.json(
      { success: false, error: 'Error al agregar imágenes a la galería' },
      { status: 500 }
    )
  }
}

// ── PUT ───────────────────────────────────────────────────────────────────────

/**
 * Body: { order: [{ id: string, order: number }] }
 * Actualiza el campo `order` de cada CategoryImage indicada.
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

    if (order.length === 0) {
      return NextResponse.json({ success: true })
    }

    // Actualizar el orden de cada imagen en una transaction
    await prisma.$transaction(
      order.map(({ id, order: newOrder }) =>
        prisma.categoryImage.update({
          where: { id },
          data: { order: newOrder },
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
