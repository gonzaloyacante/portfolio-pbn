/**
 * GET    /api/admin/contacts/[id]  — Obtener contacto completo (marca como leído)
 * PATCH  /api/admin/contacts/[id]  — Actualizar estado, respuesta, notas
 * DELETE /api/admin/contacts/[id]  — Soft delete
 */

import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { contactUpdateApiSchema } from '@/lib/validations'

type Params = { params: Promise<{ id: string }> }

const CONTACT_DETAIL_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  message: true,
  subject: true,
  responsePreference: true,
  instagramUser: true,
  status: true,
  priority: true,
  isRead: true,
  readAt: true,
  isReplied: true,
  repliedAt: true,
  replyText: true,
  isImportant: true,
  adminNote: true,
  tags: true,
  ipAddress: true,
  referrer: true,
  utmSource: true,
  utmMedium: true,
  utmCampaign: true,
  createdAt: true,
  updatedAt: true,
} as const

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const contact = await prisma.contact.findFirst({
      where: { id, deletedAt: null },
      select: CONTACT_DETAIL_SELECT,
    })

    if (!contact) {
      return NextResponse.json({ success: false, error: 'Contacto no encontrado' }, { status: 404 })
    }

    // Auto mark as read on first view
    if (!contact.isRead) {
      await prisma.contact.update({
        where: { id },
        data: { isRead: true, readAt: new Date() },
      })
    }

    return NextResponse.json({ success: true, data: { ...contact, isRead: true } })
  } catch (err) {
    logger.error('[admin-contact-get] Error', {
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
    const parsed = contactUpdateApiSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const { status, priority, isRead, isImportant, replyText, adminNote, tags } = parsed.data

    const existing = await prisma.contact.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contacto no encontrado' }, { status: 404 })
    }

    const replyData =
      replyText && !existing.isReplied ? { isReplied: true, repliedAt: new Date() } : {}

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(isRead !== undefined && { isRead, readAt: isRead ? new Date() : null }),
        ...(isImportant !== undefined && { isImportant }),
        ...(replyText !== undefined && { replyText }),
        ...(adminNote !== undefined && { adminNote }),
        ...(tags !== undefined && { tags }),
        ...replyData,
      },
      select: CONTACT_DETAIL_SELECT,
    })

    revalidatePath(ROUTES.admin.contacts)

    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    logger.error('[admin-contact-patch] Error', {
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
    const existing = await prisma.contact.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contacto no encontrado' }, { status: 404 })
    }

    await prisma.contact.update({ where: { id }, data: { deletedAt: new Date() } })

    revalidatePath(ROUTES.admin.contacts)

    return NextResponse.json({ success: true, message: 'Contacto eliminado' })
  } catch (err) {
    logger.error('[admin-contact-delete] Error', {
      id,
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
