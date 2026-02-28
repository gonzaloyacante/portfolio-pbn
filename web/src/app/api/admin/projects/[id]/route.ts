/**
 * GET    /api/admin/projects/[id]  — Detalle de proyecto
 * PATCH  /api/admin/projects/[id]  — Actualizar proyecto
 * DELETE /api/admin/projects/[id]  — Soft delete
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

const PROJECT_FULL_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  excerpt: true,
  thumbnailUrl: true,
  videoUrl: true,
  date: true,
  duration: true,
  client: true,
  location: true,
  tags: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  ogImage: true,
  categoryId: true,
  sortOrder: true,
  isFeatured: true,
  isPinned: true,
  isActive: true,
  viewCount: true,
  likeCount: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  images: {
    select: { id: true, url: true, alt: true, order: true },
    orderBy: [{ order: 'asc' as const }],
  },
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    const project = await prisma.project.findFirst({
      where: { id, isDeleted: false },
      select: PROJECT_FULL_SELECT,
    })

    if (!project) {
      return NextResponse.json({ success: false, error: 'Proyecto no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (err) {
    logger.error('[admin-project-get] Error', {
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

    const existing = await prisma.project.findFirst({ where: { id, isDeleted: false } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Proyecto no encontrado' }, { status: 404 })
    }

    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await prisma.project.findFirst({
        where: { slug: body.slug, isDeleted: false, id: { not: id } },
      })
      if (slugConflict) {
        return NextResponse.json(
          { success: false, error: 'Ya existe un proyecto con ese slug' },
          { status: 409 }
        )
      }
    }

    const {
      title,
      slug,
      description,
      excerpt,
      thumbnailUrl,
      videoUrl,
      date,
      duration,
      client,
      location,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      categoryId,
      isFeatured,
      isPinned,
      isActive,
    } = body

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(excerpt !== undefined && { excerpt }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(duration !== undefined && { duration }),
        ...(client !== undefined && { client }),
        ...(location !== undefined && { location }),
        ...(tags !== undefined && { tags }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(metaKeywords !== undefined && { metaKeywords }),
        ...(ogImage !== undefined && { ogImage }),
        ...(categoryId !== undefined && { categoryId }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isPinned !== undefined && { isPinned }),
        ...(isActive !== undefined && { isActive }),
        updatedBy: auth.payload.userId,
      },
      select: PROJECT_FULL_SELECT,
    })

    try {
      revalidatePath(ROUTES.public.projects)
      revalidatePath(ROUTES.admin.projects)
      revalidatePath(`${ROUTES.admin.projects}/${id}`)
      revalidatePath(ROUTES.home, 'layout')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    } catch (revalErr) {
      logger.warn('[admin-project-patch] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (err) {
    logger.error('[admin-project-patch] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
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

    const existing = await prisma.project.findFirst({ where: { id, isDeleted: false } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Proyecto no encontrado' }, { status: 404 })
    }

    await prisma.project.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: auth.payload.userId,
        isActive: false,
      },
    })

    try {
      revalidatePath(ROUTES.public.projects)
      revalidatePath(ROUTES.admin.projects)
      revalidatePath(ROUTES.admin.trash)
      revalidatePath(ROUTES.home, 'layout')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    } catch (revalErr) {
      logger.warn('[admin-project-delete] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, message: 'Proyecto eliminado' })
  } catch (err) {
    logger.error('[admin-project-delete] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
