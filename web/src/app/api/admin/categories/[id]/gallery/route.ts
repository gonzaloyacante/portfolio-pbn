/**
 * GET    /api/admin/categories/[id]/gallery  — Todas las imágenes de una categoría
 * POST   /api/admin/categories/[id]/gallery  — Agregar imágenes a la galería
 * PUT    /api/admin/categories/[id]/gallery  — Actualizar orden de la galería
 * PATCH  /api/admin/categories/[id]/gallery  — Alternar isFeatured de una imagen
 * DELETE /api/admin/categories/[id]/gallery  — Eliminar imagen individual
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { deleteImage, extractPublicIdUrl } from '@/lib/cloudinary'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { ROUTES } from '@/config/routes'

type Params = { params: Promise<{ id: string }> }

function revalidateCategoryGallery(categoryId: string, categorySlug?: string) {
  revalidatePath(ROUTES.admin.categories)
  revalidatePath(ROUTES.admin.categoryGallery(categoryId))
  revalidatePath(ROUTES.public.portfolio, 'layout')
  if (categorySlug) {
    revalidatePath(`${ROUTES.public.portfolio}/${categorySlug}`)
  }
  revalidateTag(CACHE_TAGS.categoryImages, 'max')
}

async function normalizeCategoryImageOrder(categoryId: string) {
  await prisma.$executeRaw`
    WITH ranked AS (
      SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY "order" ASC, "createdAt" ASC) - 1 AS next_order
      FROM "category_images"
      WHERE "categoryId" = ${categoryId}
    )
    UPDATE "category_images" AS ci
    SET "order" = ranked.next_order
    FROM ranked
    WHERE ci.id = ranked.id
      AND ci."order" <> ranked.next_order;
  `
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id: categoryId } = await params

    // Verificar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true, deletedAt: true },
    })

    if (!category || category.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    const images = await prisma.categoryImage.findMany({
      where: { categoryId },
      select: {
        id: true,
        url: true,
        publicId: true,
        order: true,
        categoryId: true,
        width: true,
        height: true,
        isFeatured: true,
      },
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
    const images: { url: string; publicId: string; width?: number; height?: number }[] =
      body?.images

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El campo "images" es requerido y debe ser un array' },
        { status: 400 }
      )
    }

    // Verificar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, slug: true, deletedAt: true },
    })
    if (!category || category.deletedAt) {
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
      width: img.width ?? null,
      height: img.height ?? null,
      categoryId,
      order: currentCount + i,
    }))

    await prisma.categoryImage.createMany({ data: toCreate })

    // Revalidate
    revalidateCategoryGallery(categoryId, category.slug)

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
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, slug: true, deletedAt: true },
    })

    if (!category || category.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    if (order.length === 0) {
      await normalizeCategoryImageOrder(categoryId)

      revalidateCategoryGallery(categoryId, category.slug)
      return NextResponse.json({ success: true })
    }

    const targetIds = Array.from(new Set(order.map(({ id }) => id)))
    const existingIds = await prisma.categoryImage.findMany({
      where: { categoryId, id: { in: targetIds } },
      select: { id: true },
    })

    if (existingIds.length !== targetIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Uno o más imageId no pertenecen a la categoría',
        },
        { status: 400 }
      )
    }

    // Actualizar orden de forma acotada a la categoría
    await prisma.$transaction(
      order.map(({ id, order: newOrder }) =>
        prisma.categoryImage.updateMany({
          where: { id, categoryId },
          data: { order: newOrder },
        })
      )
    )

    revalidateCategoryGallery(categoryId, category.slug)
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('PUT category gallery order error', err as Record<string, unknown>)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el orden de la galería' },
      { status: 500 }
    )
  }
}

// ── DELETE (Eliminar imagen individual) ──────────────────────────────────────

/**
 * Body: { imageId: string, publicId: string }
 * Elimina la imagen de DB y de Cloudinary.
 */
export async function DELETE(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id: categoryId } = await params

    const body = await req.json()
    const imageId: string = body?.imageId
    const publicId: string = body?.publicId

    if (!imageId || !publicId) {
      return NextResponse.json(
        { success: false, error: 'Los campos "imageId" y "publicId" son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que la imagen pertenece a esta categoría
    const image = await prisma.categoryImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        categoryId: true,
        url: true,
        category: {
          select: {
            slug: true,
            coverImageUrl: true,
          },
        },
      },
    })

    if (!image || image.categoryId !== categoryId) {
      return NextResponse.json(
        { success: false, error: 'Imagen no encontrada en esta categoría' },
        { status: 404 }
      )
    }

    // Eliminar de Cloudinary
    await deleteImage(publicId)

    // Determinar si la imagen eliminada es la portada de la categoría
    const isCover =
      image.category.coverImageUrl != null &&
      (image.category.coverImageUrl === image.url ||
        extractPublicIdUrl(image.category.coverImageUrl) === publicId)

    // Eliminar de DB y, si corresponde, limpiar coverImageUrl en la misma transacción
    await prisma.$transaction([
      prisma.categoryImage.delete({ where: { id: imageId } }),
      ...(isCover
        ? [prisma.category.update({ where: { id: categoryId }, data: { coverImageUrl: null } })]
        : []),
    ])

    // Reordenar las imágenes restantes
    await normalizeCategoryImageOrder(categoryId)

    revalidateCategoryGallery(categoryId, image.category.slug)

    logger.info(`Category image deleted: ${imageId} (publicId: ${publicId})`)
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('DELETE category gallery image error', err as Record<string, unknown>)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la imagen' },
      { status: 500 }
    )
  }
}

// ── PATCH (Toggle isFeatured) ─────────────────────────────────────────────────

/**
 * Body: { imageId: string, isFeatured: boolean }
 * Alterna el campo `isFeatured` de una imagen de la galería.
 */
export async function PATCH(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id: categoryId } = await params
    const body = await req.json()
    const imageId: string = body?.imageId
    const isFeatured: boolean = body?.isFeatured

    if (!imageId || typeof isFeatured !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Los campos "imageId" e "isFeatured" son requeridos' },
        { status: 400 }
      )
    }

    const image = await prisma.categoryImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        categoryId: true,
        category: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!image || image.categoryId !== categoryId) {
      return NextResponse.json(
        { success: false, error: 'Imagen no encontrada en esta categoría' },
        { status: 404 }
      )
    }

    await prisma.categoryImage.update({
      where: { id: imageId },
      data: { isFeatured },
    })

    revalidatePath(ROUTES.home)
    revalidateCategoryGallery(categoryId, image.category.slug)

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('PATCH category gallery featured error', err as Record<string, unknown>)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar imagen destacada' },
      { status: 500 }
    )
  }
}
