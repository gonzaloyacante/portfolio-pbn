/**
 * GET   /api/admin/testimonials  — Listar testimonios
 * POST  /api/admin/testimonials  — Crear testimonio
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

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
    const status = searchParams.get('status') ?? undefined
    const featured = searchParams.get('featured')
    const skip = (page - 1) * limit

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
      ...(featured !== null && featured !== undefined && { featured: featured === 'true' }),
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
        data: testimonials,
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
    const body = await req.json()
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
      projectId,
      status = 'PENDING',
      isActive = true,
    } = body

    if (!name || !text) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: name, text' },
        { status: 400 }
      )
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
        projectId,
        status,
        isActive,
        sortOrder: nextOrder,
      },
      select: TESTIMONIAL_SELECT,
    })

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 })
  } catch (err) {
    logger.error('[admin-testimonials-post] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
