/**
 * GET   /api/admin/services  — Listar servicios
 * POST  /api/admin/services  — Crear servicio
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
import { generateSlug } from '@/lib/string-utils'
import { serviceApiSchema } from '@/lib/validations'

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
  isActive: true,
  isFeatured: true,
  isAvailable: true,
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
    const active = normalizeBooleanParam(searchParams.get('active'))
    const featured = normalizeBooleanParam(searchParams.get('featured'))

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(active !== undefined && { isActive: active }),
      ...(featured !== undefined && { isFeatured: featured }),
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
        data: services.map((s) => ({
          ...s,
          thumbnailUrl: s.imageUrl ? generateThumbnailUrl(s.imageUrl) : null,
        })),
        pagination: buildPaginationMeta(page, limit, total),
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
    const body = await req.json().catch(() => null)
    const parsed = serviceApiSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const {
      name,
      description,
      shortDesc,
      price,
      priceLabel = 'desde',
      currency,
      duration,
      durationMinutes,
      imageUrl,
      galleryUrls,
      videoUrl,
      isActive = true,
      isFeatured = false,
      isAvailable = true,
      maxBookingsPerDay,
      advanceNoticeDays,
      requirements,
      cancellationPolicy,
      pricingTiers,
    } = parsed.data as typeof parsed.data & { priceLabel?: string; currency?: string }

    const slug = parsed.data.slug?.trim() || generateSlug(name)
    const resolvedCurrency = currency || 'EUR'

    // Slug único — verificar en TODOS los registros (incluyendo soft-deleted)
    const existing = await prisma.service.findFirst({ where: { slug } })
    if (existing) {
      const msg =
        existing.deletedAt !== null
          ? 'El slug ya está en uso por un servicio eliminado. Vacía la papelera o usa otro slug.'
          : 'El slug ya está en uso'
      return NextResponse.json({ success: false, error: msg }, { status: 409 })
    }

    const service = await prisma.$transaction(async (tx) => {
      const agg = await tx.service.aggregate({
        _max: { sortOrder: true },
        where: { deletedAt: null },
      })
      const nextOrder = (agg._max.sortOrder ?? 0) + 1

      const created = await tx.service.create({
        data: {
          name,
          slug,
          description,
          shortDesc,
          price: price ?? null,
          priceLabel,
          currency: resolvedCurrency,
          duration,
          durationMinutes: durationMinutes ?? null,
          imageUrl,
          galleryUrls: galleryUrls ?? [],
          videoUrl,
          isActive,
          isFeatured,
          isAvailable,
          maxBookingsPerDay: maxBookingsPerDay ?? undefined,
          advanceNoticeDays: advanceNoticeDays ?? undefined,
          sortOrder: nextOrder,
          requirements,
          cancellationPolicy,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          shortDesc: true,
          price: true,
          priceLabel: true,
          currency: true,
          duration: true,
          durationMinutes: true,
          imageUrl: true,
          isActive: true,
          isFeatured: true,
          isAvailable: true,
          maxBookingsPerDay: true,
          advanceNoticeDays: true,
          sortOrder: true,
          requirements: true,
          cancellationPolicy: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (pricingTiers && pricingTiers.length > 0) {
        await tx.servicePricingTier.createMany({
          data: pricingTiers.map((tier, idx) => ({
            serviceId: created.id,
            name: tier.name,
            price: tier.price,
            description: tier.description ?? null,
            sortOrder: idx,
          })),
        })
      }

      return created
    })

    try {
      revalidatePath(ROUTES.admin.services)
      revalidatePath(ROUTES.public.services)
      revalidatePath(ROUTES.public.serviceDetail(service.slug))
      revalidatePath(ROUTES.public.sitemap)
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
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
