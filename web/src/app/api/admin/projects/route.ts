/**
 * GET  /api/admin/projects  — Lista paginada con filtros
 * POST /api/admin/projects  — Crear proyecto
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

// ── Helpers ───────────────────────────────────────────────────────────────────

const PROJECT_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  thumbnailUrl: true,
  date: true,
  sortOrder: true,
  isFeatured: true,
  isPinned: true,
  isActive: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
} as const

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))
    const search = searchParams.get('search')?.trim() || undefined
    const categoryId = searchParams.get('categoryId') || undefined
    const active = searchParams.get('active')
    const featured = searchParams.get('featured')
    const skip = (page - 1) * limit

    const where = {
      isDeleted: false,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(active !== null && active !== undefined && { isActive: active === 'true' }),
      ...(featured !== null && featured !== undefined && { isFeatured: featured === 'true' }),
    }

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        select: PROJECT_SELECT,
        orderBy: [{ isPinned: 'desc' }, { sortOrder: 'asc' }, { date: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    })
  } catch (err) {
    logger.error('[admin-projects-list] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const body = await req.json()
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
      tags = [],
      metaTitle,
      metaDescription,
      metaKeywords = [],
      categoryId,
      isFeatured = false,
      isPinned = false,
    } = body

    if (!title || !slug || !description || !thumbnailUrl || !categoryId || !date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campos requeridos: title, slug, description, thumbnailUrl, categoryId, date',
        },
        { status: 400 }
      )
    }

    const existing = await prisma.project.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un proyecto con ese slug' },
        { status: 409 }
      )
    }

    const maxOrder = await prisma.project.aggregate({
      _max: { sortOrder: true },
      where: { isDeleted: false },
    })

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        excerpt,
        thumbnailUrl,
        videoUrl,
        date: new Date(date),
        duration,
        client,
        location,
        tags,
        metaTitle,
        metaDescription,
        metaKeywords,
        categoryId,
        isFeatured,
        isPinned,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
        createdBy: auth.payload.userId,
      },
      select: PROJECT_SELECT,
    })

    try {
      revalidatePath(ROUTES.public.projects, 'layout')
      revalidatePath(ROUTES.admin.projects)
      revalidatePath(ROUTES.home)
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    } catch (revalErr) {
      logger.warn('[admin-projects-create] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (err) {
    logger.error('[admin-projects-create] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
