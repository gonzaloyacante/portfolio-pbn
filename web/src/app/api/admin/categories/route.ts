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
import { normalizePagination, normalizeSearchTerm } from '@/lib/search-utils'
import { categoryApiSchema } from '@/lib/validations'

const CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  coverImageUrl: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { images: true } },
} as const

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const { page, limit, skip } = normalizePagination(
      searchParams.get('page'),
      searchParams.get('limit'),
      { defaultLimit: 50, maxLimit: 100 }
    )
    const search = normalizeSearchTerm(searchParams.get('search'))
    const active = searchParams.get('active')

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

    const mapped = categories.map(({ _count, ...cat }) => ({
      ...cat,
      imageCount: _count.images,
    }))

    return NextResponse.json({
      success: true,
      data: {
        data: mapped,
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
    const body = await req.json().catch(() => null)
    const parsed = categoryApiSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, slug, description, isActive = true } = parsed.data
    const coverImageUrl = parsed.data.coverImageUrl ?? undefined

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

    // Neon HTTP adapter no soporta transacciones implícitas al usar _count en mutations.
    // Creamos sin _count y devolvemos imageCount: 0 (categoría nueva siempre tiene 0 imagenes).
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        coverImageUrl,
        isActive,
        sortOrder: nextOrder,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        coverImageUrl: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    try {
      revalidatePath(ROUTES.public.portfolio, 'layout')
      revalidatePath(ROUTES.admin.categories)
      revalidateTag(CACHE_TAGS.categories, 'max')
    } catch (revalErr) {
      logger.warn('[admin-categories-post] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json(
      { success: true, data: { ...category, imageCount: 0 } },
      { status: 201 }
    )
  } catch (err) {
    logger.error('[admin-categories-post] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
