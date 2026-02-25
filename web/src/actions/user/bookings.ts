'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { emailService } from '@/lib/email-service'
import { sendPushToAdmins } from '@/lib/push-service'
import { ROUTES } from '@/config/routes'

const BookingSchema = z.object({
  date: z.string().transform((str) => new Date(str)), // Input as ISO string
  clientName: z.string().min(1, 'Nombre requerido'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().optional(),
  serviceId: z.string().min(1, 'Servicio requerido'),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).default('PENDING'),
})

export async function createBooking(formData: FormData) {
  const rawData = {
    date: formData.get('date'),
    clientName: formData.get('clientName'),
    clientEmail: formData.get('clientEmail'),
    clientPhone: formData.get('clientPhone'),
    serviceId: formData.get('serviceId'),
    notes: formData.get('notes'),
  }

  const validation = BookingSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const data = validation.data

  try {
    const booking = await prisma.booking.create({
      data: {
        date: data.date,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        serviceId: data.serviceId,
        clientNotes: data.notes,
        status: 'PENDING',
      },
      include: { service: { select: { name: true } } },
    })

    // Send Email Notification to Admin & Client
    await Promise.all([
      emailService.notifyNewBooking({
        date: data.date,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        serviceId: data.serviceId,
        notes: data.notes,
      }),
      emailService.notifyClientBookingReceived({
        clientEmail: data.clientEmail,
        clientName: data.clientName,
        date: data.date,
      }),
    ]).catch((err) => {
      logger.error('Failed to send booking emails', { error: err })
      // Don't fail the written booking, just log error
    })

    // Push notification to all admin devices (fire-and-forget)
    const dateStr = data.date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    void sendPushToAdmins({
      title: '📅 Nueva reserva',
      body: `${data.clientName} — ${booking.service?.name ?? 'Servicio'} · ${dateStr}`,
      type: 'booking',
      id: booking.id,
      screen: 'calendar',
    })

    revalidatePath(ROUTES.admin.calendar)
    return { success: true }
  } catch (error) {
    logger.error('Error creating booking:', { error })
    return { success: false, error: 'Error al crear la reserva' }
  }
}

export async function getBookingsByRange(start: Date, end: Date) {
  try {
    return await prisma.booking.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        service: {
          select: { name: true, duration: true },
        },
      },
      orderBy: { date: 'asc' },
    })
  } catch (error) {
    logger.error('Error fetching bookings:', { error })
    return []
  }
}

export async function updateBookingStatus(
  id: string,
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
) {
  try {
    await prisma.booking.update({
      where: { id },
      data: { status },
    })
    revalidatePath(ROUTES.admin.calendar)
    return { success: true }
  } catch (error) {
    logger.error('Error updates booking status:', { error })
    return { success: false, error: 'Error al actualizar estado' }
  }
}
