/**
 * GET    /api/admin/contacts/[id]  — Obtener contacto completo (marca como leído)
 * PATCH  /api/admin/contacts/[id]  — Actualizar estado, respuesta, notas
 * DELETE /api/admin/contacts/[id]  — Soft delete
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

const CONTACT_DETAIL_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  message: true,
  subject: true,
  responsePreference: true,
  leadScore: true,
  leadSource: true,
  status: true,
  priority: true,
  assignedTo: true,
  isRead: true,
  readAt: true,
  readBy: true,
  isReplied: true,
  repliedAt: true,
  repliedBy: true,
  replyText: true,
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
    const body = await req.json()
    const { status, priority, assignedTo, isRead, replyText, adminNote, tags } = body

    const existing = await prisma.contact.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contacto no encontrado' }, { status: 404 })
    }

    const replyData = replyText && !existing.isReplied
      ? { isReplied: true, repliedAt: new Date(), repliedBy: auth.payload?.email ?? 'admin' }
      : {}

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(isRead !== undefined && { isRead, readAt: isRead ? new Date() : null }),
        ...(replyText !== undefined && { replyText }),
        ...(adminNote !== undefined && { adminNote }),
        ...(tags !== undefined && { tags }),
        ...replyData,
      },
      select: CONTACT_DETAIL_SELECT,
    })

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

    return NextResponse.json({ success: true, message: 'Contacto eliminado' })
  } catch (err) {
    logger.error('[admin-contact-delete] Error', {
      id,
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
