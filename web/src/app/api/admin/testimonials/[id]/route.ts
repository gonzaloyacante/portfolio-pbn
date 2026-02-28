/**
 * GET    /api/admin/testimonials/[id]  — Obtener testimonio completo
 * PATCH  /api/admin/testimonials/[id]  — Actualizar testimonio
 * DELETE /api/admin/testimonials/[id]  — Eliminar (soft delete)
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

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
  projectId: true,
  status: true,
  moderatedBy: true,
  moderatedAt: true,
  isActive: true,
  sortOrder: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} as const

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const testimonial = await prisma.testimonial.findFirst({
      where: { id, deletedAt: null },
      select: TESTIMONIAL_DETAIL_SELECT,
    })

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: testimonial })
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
      rating,
      verified,
      featured,
      source,
      projectId,
      status,
      isActive,
      sortOrder,
    } = body

    const existing = await prisma.testimonial.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Testimonio no encontrado' },
        { status: 404 }
      )
    }

    const moderationData =
      status && status !== existing.status
        ? { moderatedBy: auth.payload?.email ?? 'admin', moderatedAt: new Date() }
        : {}

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
        ...(projectId !== undefined && { projectId }),
        ...(status !== undefined && { status }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...moderationData,
      },
      select: TESTIMONIAL_DETAIL_SELECT,
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about)
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
    const existing = await prisma.testimonial.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Testimonio no encontrado' },
        { status: 404 }
      )
    }

    await prisma.testimonial.update({ where: { id }, data: { deletedAt: new Date() } })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about)
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
