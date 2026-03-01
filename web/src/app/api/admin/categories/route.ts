/**
 * GET   /api/admin/categories  — Listar categorías
 * POST  /api/admin/categories  — Crear categoría
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

const CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  thumbnailUrl: true,
  iconName: true,
  color: true,
  sortOrder: true,
  isActive: true,
  projectCount: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} as const

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))
    const search = searchParams.get('search') ?? undefined
    const active = searchParams.get('active')
    const skip = (page - 1) * limit

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(active !== null && active !== undefined && { isActive: active === 'true' }),
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        select: CATEGORY_SELECT,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.category.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: categories,
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
    logger.error('[admin-categories-get] Error', {
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
    const { name, slug, description, thumbnailUrl, iconName, color, isActive = true } = body

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: name, slug' },
        { status: 400 }
      )
    }

    // Slug único — verificar en TODOS los registros (incluyendo soft-deleted)
    // para evitar P2002 al crear (el @unique de DB no discrimina deletedAt)
    const existing = await prisma.category.findFirst({ where: { slug } })
    if (existing) {
      const msg =
        existing.deletedAt !== null
          ? 'El slug ya está en uso por una categoría eliminada. Vacía la papelera o usa otro slug.'
          : 'El slug ya está en uso'
      return NextResponse.json({ success: false, error: msg }, { status: 409 })
    }

    // Calcular siguiente sortOrder
    const agg = await prisma.category.aggregate({ _max: { sortOrder: true } })
    const nextOrder = (agg._max.sortOrder ?? 0) + 1

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        thumbnailUrl,
        iconName,
        color,
        isActive,
        sortOrder: nextOrder,
      },
      select: CATEGORY_SELECT,
    })

    try {
      revalidatePath(ROUTES.public.projects, 'layout')
      revalidatePath(ROUTES.admin.categories)
      revalidateTag(CACHE_TAGS.categories, 'max')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    } catch (revalErr) {
      logger.warn('[admin-categories-post] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (err) {
    logger.error('[admin-categories-post] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
