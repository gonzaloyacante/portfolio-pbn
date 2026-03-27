/**
 * GET    /api/admin/categories/[id]  — Detalle de categoría
 * PATCH  /api/admin/categories/[id]  — Actualizar categoría
 * DELETE /api/admin/categories/[id]  — Soft delete
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { generateThumbnailUrl } from '@/lib/cloudinary'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { categoryPatchSchema } from '@/lib/validations'

type Params = { params: Promise<{ id: string }> }

const CATEGORY_FULL_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  thumbnailUrl: true,
  coverImageUrl: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  ogImage: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { projects: { where: { deletedAt: null } } } },
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

    const { _count, ...cat } = category
    return NextResponse.json({ success: true, data: { ...cat, projectCount: _count.projects } })
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
    const body = await req.json().catch(() => null)
    const parsed = categoryPatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const {
      name,
      slug,
      description,
      thumbnailUrl,
      coverImageUrl,
      isActive,
      sortOrder,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
    } = parsed.data

    // Slug único — verificar en TODOS los registros excluyendo el actual
    if (slug) {
      const existing = await prisma.category.findFirst({
        where: { slug, NOT: { id } },
      })
      if (existing) {
        const msg =
          existing.deletedAt !== null
            ? 'El slug ya está en uso por una categoría eliminada. Vacía la papelera o usa otro slug.'
            : 'El slug ya está en uso'
        return NextResponse.json({ success: false, error: msg }, { status: 409 })
      }
    }

    // Si se actualiza coverImageUrl sin thumbnailUrl explícito → regenerar thumbnail.
    const resolvedThumbnailUrl =
      thumbnailUrl !== undefined
        ? thumbnailUrl
        : coverImageUrl !== undefined
          ? coverImageUrl
            ? generateThumbnailUrl(coverImageUrl)
            : null
          : undefined

    // Neon HTTP adapter no soporta transacciones implícitas al usar _count en mutations.
    // Actualizamos sin _count y luego consultamos el count por separado.
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(resolvedThumbnailUrl !== undefined && { thumbnailUrl: resolvedThumbnailUrl }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(metaKeywords !== undefined && { metaKeywords }),
        ...(ogImage !== undefined && { ogImage }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        thumbnailUrl: true,
        coverImageUrl: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        ogImage: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    const projectCount = await prisma.project.count({ where: { categoryId: id, deletedAt: null } })

    try {
      revalidatePath(ROUTES.public.projects, 'layout')
      revalidatePath(ROUTES.admin.categories)
      revalidatePath(ROUTES.admin.projects)
      revalidateTag(CACHE_TAGS.categories, 'max')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    } catch (revalErr) {
      logger.warn('[admin-category-patch] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, data: { ...category, projectCount } })
  } catch (err) {
    logger.error('[admin-category-patch] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params

    // Mangle del slug para liberar la restricción @unique y permitir re-creación futura
    const cat = await prisma.category.findUnique({ where: { id }, select: { slug: true } })
    const mangledSlug = cat ? `${cat.slug}_deleted_${Date.now()}` : undefined

    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), ...(mangledSlug && { slug: mangledSlug }) },
    })

    try {
      revalidatePath(ROUTES.public.projects, 'layout')
      revalidatePath(ROUTES.admin.categories)
      revalidatePath(ROUTES.admin.projects)
      revalidateTag(CACHE_TAGS.categories, 'max')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    } catch (revalErr) {
      logger.warn('[admin-category-delete] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, message: 'Categoría eliminada' })
  } catch (err) {
    logger.error('[admin-category-delete] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
