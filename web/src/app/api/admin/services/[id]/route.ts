/**
 * GET    /api/admin/services/[id]  — Detalle de servicio
 * PATCH  /api/admin/services/[id]  — Actualizar servicio
 * DELETE /api/admin/services/[id]  — Soft delete
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

const SERVICE_FULL_SELECT = {
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
  iconName: true,
  color: true,
  isActive: true,
  isFeatured: true,
  isAvailable: true,
  maxBookingsPerDay: true,
  advanceNoticeDays: true,
  sortOrder: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  requirements: true,
  cancellationPolicy: true,
  bookingCount: true,
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
    const service = await prisma.service.findFirst({
      where: { id, deletedAt: null },
      select: SERVICE_FULL_SELECT,
    })

    if (!service) {
      return NextResponse.json({ success: false, error: 'Servicio no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: service })
  } catch (err) {
    logger.error('[admin-service-get] Error', {
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
      shortDesc,
      price,
      priceLabel,
      currency,
      duration,
      durationMinutes,
      imageUrl,
      iconName,
      color,
      isActive,
      isFeatured,
      isAvailable,
      maxBookingsPerDay,
      advanceNoticeDays,
      sortOrder,
      metaTitle,
      metaDescription,
      metaKeywords,
      requirements,
      cancellationPolicy,
    } = body

    if (slug) {
      const existing = await prisma.service.findFirst({
        where: { slug, deletedAt: null, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'El slug ya está en uso' },
          { status: 409 }
        )
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(price !== undefined && { price: price !== null ? parseFloat(price) : null }),
        ...(priceLabel !== undefined && { priceLabel }),
        ...(currency !== undefined && { currency }),
        ...(duration !== undefined && { duration }),
        ...(durationMinutes !== undefined && { durationMinutes }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(iconName !== undefined && { iconName }),
        ...(color !== undefined && { color }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(maxBookingsPerDay !== undefined && { maxBookingsPerDay }),
        ...(advanceNoticeDays !== undefined && { advanceNoticeDays }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(metaKeywords !== undefined && { metaKeywords }),
        ...(requirements !== undefined && { requirements }),
        ...(cancellationPolicy !== undefined && { cancellationPolicy }),
      },
      select: SERVICE_FULL_SELECT,
    })

    try {
      revalidatePath(ROUTES.admin.services)
      revalidatePath(ROUTES.public.services)
      revalidateTag(CACHE_TAGS.services, 'max')
    } catch (revalErr) {
      logger.warn('[admin-service-patch] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, data: service })
  } catch (err) {
    logger.error('[admin-service-patch] Error', {
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

    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    try {
      revalidatePath(ROUTES.admin.services)
      revalidatePath(ROUTES.public.services)
      revalidateTag(CACHE_TAGS.services, 'max')
    } catch (revalErr) {
      logger.warn('[admin-service-delete] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, message: 'Servicio eliminado' })
  } catch (err) {
    logger.error('[admin-service-delete] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
