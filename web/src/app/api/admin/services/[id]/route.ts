/**
 * GET    /api/admin/services/[id]  — Detalle de servicio
 * PATCH  /api/admin/services/[id]  — Actualizar servicio
 * DELETE /api/admin/services/[id]  — Soft delete
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { generateThumbnailUrl, extractPublicIdUrl, deleteMultipleImages } from '@/lib/cloudinary'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { servicePatchSchema } from '@/lib/validations'

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

    return NextResponse.json({
      success: true,
      data: {
        ...service,
        thumbnailUrl: service.imageUrl ? generateThumbnailUrl(service.imageUrl) : null,
      },
    })
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
    const body = await req.json().catch(() => null)
    const parsed = servicePatchSchema.safeParse(body)
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
      shortDesc,
      price,
      priceLabel,
      currency,
      duration,
      durationMinutes,
      imageUrl,
      isActive,
      isFeatured,
      isAvailable,
      maxBookingsPerDay,
      advanceNoticeDays,
      sortOrder,
      requirements,
      cancellationPolicy,
    } = parsed.data

    if (slug) {
      const existing = await prisma.service.findFirst({
        where: { slug, NOT: { id } },
      })
      if (existing) {
        const msg =
          existing.deletedAt !== null
            ? 'El slug ya está en uso por un servicio eliminado. Vacía la papelera o usa otro slug.'
            : 'El slug ya está en uso'
        return NextResponse.json({ success: false, error: msg }, { status: 409 })
      }
    }

    const previousService = await prisma.service.findUnique({
      where: { id },
      select: { imageUrl: true },
    })

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(price !== undefined && { price }),
        ...(priceLabel !== undefined && { priceLabel }),
        ...(currency !== undefined && { currency }),
        ...(duration !== undefined && { duration }),
        ...(durationMinutes !== undefined && { durationMinutes }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(maxBookingsPerDay !== undefined && { maxBookingsPerDay }),
        ...(advanceNoticeDays !== undefined && { advanceNoticeDays }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(requirements !== undefined && { requirements }),
        ...(cancellationPolicy !== undefined && { cancellationPolicy }),
      },
      select: SERVICE_FULL_SELECT,
    })

    // Cloud Wipe: If the main image changed, delete the old one from Cloudinary
    if (imageUrl !== undefined) {
      if (previousService?.imageUrl && previousService.imageUrl !== (imageUrl || null)) {
        const pId = extractPublicIdUrl(previousService.imageUrl)
        if (pId) {
          deleteMultipleImages([pId]).catch((err: Error) =>
            logger.warn('[admin-service-patch] Orphan sweep failed', {
              id,
              publicId: pId,
              error: err.message,
            })
          )
        }
      }
    }

    try {
      revalidatePath(ROUTES.admin.services)
      revalidatePath(ROUTES.public.services, 'layout')
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
    const svc = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
    const mangledSlug = svc ? `${svc.slug}_deleted_${Date.now()}` : undefined

    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, ...(mangledSlug && { slug: mangledSlug }) },
    })

    try {
      revalidatePath(ROUTES.admin.services)
      revalidatePath(ROUTES.public.services, 'layout')
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
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
