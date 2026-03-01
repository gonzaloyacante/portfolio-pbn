/**
 * GET   /api/admin/services  — Listar servicios
 * POST  /api/admin/services  — Crear servicio
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

const SERVICE_SELECT = {
  id: true,
  name: true,
  slug: true,
  shortDesc: true,
  price: true,
  priceLabel: true,
  currency: true,
  duration: true,
  imageUrl: true,
  iconName: true,
  color: true,
  isActive: true,
  isFeatured: true,
  isAvailable: true,
  sortOrder: true,
  bookingCount: true,
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
    const featured = searchParams.get('featured')
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
      ...(featured !== null && featured !== undefined && { isFeatured: featured === 'true' }),
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        select: SERVICE_SELECT,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: services,
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
    logger.error('[admin-services-get] Error', {
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
      name,
      slug,
      description,
      shortDesc,
      price,
      priceLabel = 'desde',
      currency = 'ARS',
      duration,
      imageUrl,
      iconName,
      color,
      isActive = true,
      isFeatured = false,
    } = body

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: name, slug' },
        { status: 400 }
      )
    }

    // Slug único — verificar en TODOS los registros (incluyendo soft-deleted)
    const existing = await prisma.service.findFirst({ where: { slug } })
    if (existing) {
      const msg =
        existing.deletedAt !== null
          ? 'El slug ya está en uso por un servicio eliminado. Vacía la papelera o usa otro slug.'
          : 'El slug ya está en uso'
      return NextResponse.json({ success: false, error: msg }, { status: 409 })
    }

    const agg = await prisma.service.aggregate({ _max: { sortOrder: true } })
    const nextOrder = (agg._max.sortOrder ?? 0) + 1

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        price: price ? parseFloat(price) : null,
        priceLabel,
        currency,
        duration,
        imageUrl,
        iconName,
        color,
        isActive,
        isFeatured,
        sortOrder: nextOrder,
      },
      select: SERVICE_SELECT,
    })

    try {
      revalidatePath(ROUTES.admin.services)
      revalidatePath(ROUTES.public.services)
      revalidateTag(CACHE_TAGS.services, 'max')
    } catch (revalErr) {
      logger.warn('[admin-services-post] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (err) {
    logger.error('[admin-services-post] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
