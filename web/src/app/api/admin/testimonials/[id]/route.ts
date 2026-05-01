/**
 * GET    /api/admin/testimonials/[id]  — Obtener testimonio completo
 * PATCH  /api/admin/testimonials/[id]  — Actualizar testimonio
 * DELETE /api/admin/testimonials/[id]  — Eliminar (soft delete)
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { generateThumbnailUrl } from '@/lib/cloudinary'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { testimonialPatchSchema } from '@/lib/validations'

type Params = { params: Promise<{ id: string }> }

const TESTIMONIAL_DETAIL_SELECT = {
  id: true,
  name: true,
  text: true,
  excerpt: true,
  email: true,
  phone: true,
  position: true,
  company: true,
  website: true,
  avatarUrl: true,
  rating: true,
  verified: true,
  featured: true,
  source: true,
  categoryId: true,
  status: true,
  moderatedAt: true,
  moderationNote: true,
  isActive: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: { ...TESTIMONIAL_DETAIL_SELECT, deletedAt: true },
    })

    if (!testimonial || testimonial.deletedAt !== null) {
      return NextResponse.json(
        { success: false, error: 'Testimonio no encontrado' },
        { status: 404 }
      )
    }

    const { deletedAt: _deletedAt, ...testimonialData } = testimonial

    return NextResponse.json({
      success: true,
      data: {
        ...testimonialData,
        thumbnailUrl: testimonialData.avatarUrl
          ? generateThumbnailUrl(testimonialData.avatarUrl)
          : null,
      },
    })
  } catch (err) {
    logger.error('[admin-testimonial-get] Error', {
      id,
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const body = await req.json().catch(() => null)
    const parsed = testimonialPatchSchema.safeParse(body)
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
      rating,
      verified,
      featured,
      source,
      categoryId,
      status,
      isActive,
      sortOrder,
    } = parsed.data

    const existing = await prisma.testimonial.findUnique({
      where: { id },
      select: { status: true, deletedAt: true },
    })
    if (!existing || existing.deletedAt !== null) {
      return NextResponse.json(
        { success: false, error: 'Testimonio no encontrado' },
        { status: 404 }
      )
    }

    const moderationData = status && status !== existing.status ? { moderatedAt: new Date() } : {}

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(text !== undefined && { text }),
        ...(excerpt !== undefined && { excerpt }),
        ...(position !== undefined && { position }),
        ...(company !== undefined && { company }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(website !== undefined && { website }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(rating !== undefined && { rating }),
        ...(verified !== undefined && { verified }),
        ...(featured !== undefined && { featured }),
        ...(source !== undefined && { source }),
        ...(categoryId !== undefined && { categoryId }),
        ...(status !== undefined && { status }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...moderationData,
      },
      select: TESTIMONIAL_DETAIL_SELECT,
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about, 'layout')
    revalidatePath(ROUTES.admin.testimonials)
    revalidateTag(CACHE_TAGS.testimonials, 'max')

    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    logger.error('[admin-testimonial-patch] Error', {
      id,
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const result = await prisma.testimonial.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, error: 'Testimonio no encontrado' },
        { status: 404 }
      )
    }

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about, 'layout')
    revalidateTag(CACHE_TAGS.testimonials, 'max')

    return NextResponse.json({ success: true, message: 'Testimonio eliminado' })
  } catch (err) {
    logger.error('[admin-testimonial-delete] Error', {
      id,
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
