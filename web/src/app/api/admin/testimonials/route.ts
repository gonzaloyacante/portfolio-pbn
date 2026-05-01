/**
 * GET   /api/admin/testimonials  — Listar testimonios
 * POST  /api/admin/testimonials  — Crear testimonio
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { generateThumbnailUrl } from '@/lib/cloudinary'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import {
  buildPaginationMeta,
  normalizeBooleanParam,
  normalizePagination,
  normalizeSearchTerm,
} from '@/lib/search-utils'
import { testimonialApiSchema } from '@/lib/validations'

const TESTIMONIAL_SELECT = {
  id: true,
  name: true,
  text: true,
  excerpt: true,
  position: true,
  company: true,
  avatarUrl: true,
  rating: true,
  verified: true,
  featured: true,
  status: true,
  isActive: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
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
    const status = searchParams.get('status') ?? undefined
    const featured = normalizeBooleanParam(searchParams.get('featured'))
    const active = normalizeBooleanParam(searchParams.get('active'))

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { text: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(active !== undefined && { isActive: active }),
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        select: TESTIMONIAL_SELECT,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: testimonials.map((t) => ({
          ...t,
          thumbnailUrl: t.avatarUrl ? generateThumbnailUrl(t.avatarUrl) : null,
        })),
        pagination: buildPaginationMeta(page, limit, total),
      },
    })
  } catch (err) {
    logger.error('[admin-testimonials-get] Error', {
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
    const parsed = testimonialApiSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const {
      name,
      text,
      excerpt,
      position,
      company,
      email,
      phone,
      website,
      avatarUrl,
      rating = 5,
      verified = false,
      featured = false,
      source,
      categoryId,
      status = 'PENDING',
      isActive = true,
    } = parsed.data as typeof parsed.data & {
      rating?: number
      verified?: boolean
      featured?: boolean
      status?: string
      isActive?: boolean
    }

    const agg = await prisma.testimonial.aggregate({ _max: { sortOrder: true } })
    const nextOrder = (agg._max.sortOrder ?? 0) + 1

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        text,
        excerpt,
        position,
        company,
        email,
        phone,
        website,
        avatarUrl,
        rating,
        verified,
        featured,
        source,
        categoryId,
        status,
        isActive,
        sortOrder: nextOrder,
      },
      select: TESTIMONIAL_SELECT,
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about, 'layout')
    revalidateTag(CACHE_TAGS.testimonials, 'max')

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 })
  } catch (err) {
    logger.error('[admin-testimonials-post] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
