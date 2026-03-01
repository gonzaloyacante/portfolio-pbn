/**
 * GET  /api/admin/bookings  — Listar reservas (con filtro por rango de fechas)
 * POST /api/admin/bookings  — Crear reserva manual
 */

import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

const BOOKING_SELECT = {
  id: true,
  date: true,
  endDate: true,
  status: true,
  clientName: true,
  clientEmail: true,
  clientPhone: true,
  guestCount: true,
  totalAmount: true,
  paymentStatus: true,
  serviceId: true,
  service: { select: { name: true } },
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
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') ?? '100', 10)))
    const search = searchParams.get('search') ?? undefined
    const status = searchParams.get('status') ?? undefined
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const serviceId = searchParams.get('serviceId') ?? undefined
    const skip = (page - 1) * limit

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { clientName: { contains: search, mode: 'insensitive' as const } },
          { clientEmail: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
      ...(serviceId && { serviceId }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        select: BOOKING_SELECT,
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: bookings.map((b) => ({
          ...b,
          totalAmount: b.totalAmount?.toString() ?? null,
        })),
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
    logger.error('[admin-bookings-get] Error', {
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
      date,
      endDate,
      clientName,
      clientEmail,
      clientPhone,
      clientNotes,
      guestCount = 1,
      serviceId,
      adminNotes,
      totalAmount,
      paymentStatus = 'PENDING',
      paymentMethod,
      status = 'PENDING',
    } = body

    if (!date || !clientName || !clientEmail || !serviceId) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: date, clientName, clientEmail, serviceId' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        clientName,
        clientEmail,
        clientPhone,
        clientNotes,
        guestCount,
        serviceId,
        adminNotes,
        status,
        paymentStatus,
        paymentMethod,
        totalAmount: totalAmount ? parseFloat(totalAmount) : null,
      },
      select: BOOKING_SELECT,
    })

    revalidatePath(ROUTES.admin.calendar)

    return NextResponse.json(
      {
        success: true,
        data: { ...booking, totalAmount: booking.totalAmount?.toString() ?? null },
      },
      { status: 201 }
    )
  } catch (err) {
    logger.error('[admin-bookings-post] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
