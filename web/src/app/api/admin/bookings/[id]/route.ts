/**
 * GET    /api/admin/bookings/[id]  — Obtener reserva completa
 * PATCH  /api/admin/bookings/[id]  — Actualizar reserva
 * DELETE /api/admin/bookings/[id]  — Soft delete
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

const BOOKING_DETAIL_SELECT = {
  id: true,
  date: true,
  endDate: true,
  status: true,
  clientName: true,
  clientEmail: true,
  clientPhone: true,
  clientNotes: true,
  guestCount: true,
  adminNotes: true,
  confirmedAt: true,
  confirmedBy: true,
  cancelledAt: true,
  cancelledBy: true,
  cancellationReason: true,
  totalAmount: true,
  paidAmount: true,
  paymentStatus: true,
  paymentMethod: true,
  paymentRef: true,
  reminderSentAt: true,
  reminderCount: true,
  feedbackSent: true,
  feedbackRating: true,
  feedbackText: true,
  serviceId: true,
  service: { select: { name: true, slug: true } },
  createdAt: true,
  updatedAt: true,
} as const

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const booking = await prisma.booking.findFirst({
      where: { id, deletedAt: null },
      select: BOOKING_DETAIL_SELECT,
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Reserva no encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        totalAmount: booking.totalAmount?.toString() ?? null,
        paidAmount: booking.paidAmount?.toString() ?? null,
      },
    })
  } catch (err) {
    logger.error('[admin-booking-get] Error', {
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
      date, endDate, status, clientName, clientEmail, clientPhone,
      clientNotes, guestCount, adminNotes, cancellationReason,
      totalAmount, paidAmount, paymentStatus, paymentMethod, paymentRef,
    } = body

    const existing = await prisma.booking.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Reserva no encontrada' }, { status: 404 })
    }

    const statusData: Record<string, unknown> = {}
    if (status && status !== existing.status) {
      if (status === 'CONFIRMED') {
        statusData.confirmedAt = new Date()
        statusData.confirmedBy = auth.payload?.email ?? 'admin'
      } else if (status === 'CANCELLED') {
        statusData.cancelledAt = new Date()
        statusData.cancelledBy = 'admin'
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        ...(date !== undefined && { date: new Date(date) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(status !== undefined && { status }),
        ...(clientName !== undefined && { clientName }),
        ...(clientEmail !== undefined && { clientEmail }),
        ...(clientPhone !== undefined && { clientPhone }),
        ...(clientNotes !== undefined && { clientNotes }),
        ...(guestCount !== undefined && { guestCount }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(cancellationReason !== undefined && { cancellationReason }),
        ...(totalAmount !== undefined && { totalAmount: totalAmount ? parseFloat(totalAmount) : null }),
        ...(paidAmount !== undefined && { paidAmount: paidAmount ? parseFloat(paidAmount) : null }),
        ...(paymentStatus !== undefined && { paymentStatus }),
        ...(paymentMethod !== undefined && { paymentMethod }),
        ...(paymentRef !== undefined && { paymentRef }),
        ...statusData,
      },
      select: BOOKING_DETAIL_SELECT,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        totalAmount: updated.totalAmount?.toString() ?? null,
        paidAmount: updated.paidAmount?.toString() ?? null,
      },
    })
  } catch (err) {
    logger.error('[admin-booking-patch] Error', {
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
    const existing = await prisma.booking.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Reserva no encontrada' }, { status: 404 })
    }

    await prisma.booking.update({ where: { id }, data: { deletedAt: new Date() } })

    return NextResponse.json({ success: true, message: 'Reserva eliminada' })
  } catch (err) {
    logger.error('[admin-booking-delete] Error', {
      id,
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
