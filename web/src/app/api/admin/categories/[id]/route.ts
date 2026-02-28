/**
 * GET    /api/admin/categories/[id]  — Detalle de categoría
 * PATCH  /api/admin/categories/[id]  — Actualizar categoría
 * DELETE /api/admin/categories/[id]  — Soft delete
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

const CATEGORY_FULL_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  thumbnailUrl: true,
  coverImageUrl: true,
  iconName: true,
  color: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  ogImage: true,
  sortOrder: true,
  isActive: true,
  projectCount: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    const category = await prisma.category.findFirst({
      where: { id, deletedAt: null },
      select: CATEGORY_FULL_SELECT,
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: category })
  } catch (err) {
    logger.error('[admin-category-get] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    const body = await req.json()
    const {
      name,
      slug,
      description,
      thumbnailUrl,
      coverImageUrl,
      iconName,
      color,
      isActive,
      sortOrder,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
    } = body

    // Slug único (excluye la categoría actual)
    if (slug) {
      const existing = await prisma.category.findFirst({
        where: { slug, deletedAt: null, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'El slug ya está en uso' },
          { status: 409 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(iconName !== undefined && { iconName }),
        ...(color !== undefined && { color }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(metaKeywords !== undefined && { metaKeywords }),
        ...(ogImage !== undefined && { ogImage }),
      },
      select: CATEGORY_FULL_SELECT,
    })

    revalidatePath(ROUTES.public.projects)
    revalidatePath(ROUTES.admin.categories)
    revalidatePath(ROUTES.admin.projects)
    revalidateTag(CACHE_TAGS.categories, 'max')

    return NextResponse.json({ success: true, data: category })
  } catch (err) {
    logger.error('[admin-category-patch] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params

    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    revalidatePath(ROUTES.public.projects)
    revalidatePath(ROUTES.admin.categories)
    revalidatePath(ROUTES.admin.projects)
    revalidateTag(CACHE_TAGS.categories, 'max')

    return NextResponse.json({ success: true, message: 'Categoría eliminada' })
  } catch (err) {
    logger.error('[admin-category-delete] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
