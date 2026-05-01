'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'

// ── Validation ────────────────────────────────────────────────────────────────

const BookingUpdateSchema = z.object({
  date: z.string().trim().min(1, 'La fecha es obligatoria'),
  endDate: z.string().trim().optional().nullable(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  clientName: z.string().trim().min(1, 'El nombre del cliente es obligatorio').max(100),
  clientEmail: z.string().trim().email('Email inválido').max(150),
  clientPhone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{1,14}$/, 'Teléfono inválido (ej: +54911...)')
    .max(30)
    .optional()
    .nullable()
    .or(z.literal('')),
  clientNotes: z.string().trim().max(1000).optional().nullable(),
  guestCount: z.coerce.number().int().min(1).optional().nullable(),
  adminNotes: z.string().trim().max(1000).optional().nullable(),
  serviceId: z.string().trim().min(1, 'El servicio es obligatorio'),
  totalAmount: z.coerce.number().optional().nullable(),
  paymentStatus: z.string().max(50).optional().nullable(),
  paymentMethod: z.string().max(50).optional().nullable(),
  cancellationReason: z.string().trim().max(500).optional().nullable(),
})

// ── Types ──────────────────────────────────────────────────────────────────────

export type BookingForEdit = {
  id: string
  date: string
  endDate: string | null
  status: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  clientNotes: string | null
  guestCount: number | null
  adminNotes: string | null
  cancellationReason: string | null
  totalAmount: string | null
  paidAmount: string | null
  paymentStatus: string | null
  paymentMethod: string | null
  serviceId: string
  service: { id: string; name: string }
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getBookingForEdit(id: string): Promise<BookingForEdit> {
  await requireAdmin()

  const booking = await prisma.booking.findUnique({
    where: { id },
    select: {
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
      cancellationReason: true,
      totalAmount: true,
      paidAmount: true,
      paymentStatus: true,
      paymentMethod: true,
      deletedAt: true,
      serviceId: true,
      service: { select: { id: true, name: true } },
    },
  })

  if (!booking || booking.deletedAt !== null) notFound()

  const { deletedAt: _deletedAt, ...bookingData } = booking
  return {
    ...bookingData,
    date: booking.date.toISOString(),
    endDate: booking.endDate?.toISOString() ?? null,
    totalAmount: booking.totalAmount?.toString() ?? null,
    paidAmount: booking.paidAmount?.toString() ?? null,
  }
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function updateBookingAdmin(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string[]> }> {
  await requireAdmin()
  await checkApiRateLimit('update-booking')

  const raw = {
    date: formData.get('date'),
    endDate: formData.get('endDate') || null,
    status: formData.get('status'),
    clientName: formData.get('clientName'),
    clientEmail: formData.get('clientEmail'),
    clientPhone: formData.get('clientPhone') || null,
    clientNotes: formData.get('clientNotes') || null,
    guestCount: formData.get('guestCount') || null,
    adminNotes: formData.get('adminNotes') || null,
    serviceId: formData.get('serviceId'),
    totalAmount: formData.get('totalAmount') || null,
    paymentStatus: formData.get('paymentStatus') || null,
    paymentMethod: formData.get('paymentMethod') || null,
    cancellationReason: formData.get('cancellationReason') || null,
  }

  const parsed = BookingUpdateSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Datos inválidos',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data

  try {
    const existing = await prisma.booking.findUnique({
      where: { id },
      select: { status: true, deletedAt: true },
    })
    if (!existing || existing.deletedAt !== null) {
      return { success: false, error: 'Reserva no encontrada' }
    }

    const statusData: Record<string, unknown> = {}
    if (data.status && data.status !== existing.status) {
      if (data.status === 'CONFIRMED') statusData.confirmedAt = new Date()
      else if (data.status === 'CANCELLED') statusData.cancelledAt = new Date()
    }

    await prisma.booking.update({
      where: { id },
      data: {
        date: new Date(data.date),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status ?? existing.status,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone ?? null,
        clientNotes: data.clientNotes ?? null,
        guestCount: data.guestCount ?? null,
        adminNotes: data.adminNotes ?? null,
        serviceId: data.serviceId,
        totalAmount: data.totalAmount ?? null,
        paymentStatus: data.paymentStatus ?? null,
        paymentMethod: data.paymentMethod ?? null,
        cancellationReason: data.cancellationReason ?? null,
        ...statusData,
      },
    })

    revalidatePath(ROUTES.admin.calendar)

    logger.info(`Booking updated by admin: ${id}`)
    return { success: true }
  } catch (err) {
    logger.error('updateBookingAdmin error', err as Record<string, unknown>)
    return { success: false, error: 'Error al actualizar la reserva' }
  }
}

// ── Bulk update ───────────────────────────────────────────────────────────────

const bulkStatusSchema = z.object({
  ids: z.array(z.string().cuid()).min(1).max(100),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
})

export async function bulkUpdateBookingStatus(ids: string[], status: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  const parsed = bulkStatusSchema.safeParse({ ids, status })
  if (!parsed.success) return { success: false, error: 'Datos inválidos' }

  try {
    const result = await prisma.booking.updateMany({
      where: { id: { in: parsed.data.ids }, deletedAt: null },
      data: {
        status: parsed.data.status,
        ...(parsed.data.status === 'CONFIRMED' && { confirmedAt: new Date() }),
        ...(parsed.data.status === 'CANCELLED' && { cancelledAt: new Date() }),
      },
    })

    revalidatePath(ROUTES.admin.calendar)
    logger.info(`Bulk booking status update: ${result.count} bookings → ${status}`)
    return { success: true, count: result.count }
  } catch (err) {
    logger.error('bulkUpdateBookingStatus error', err as Record<string, unknown>)
    return { success: false, error: 'Error al actualizar las reservas' }
  }
}
