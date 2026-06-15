import { z } from 'zod'

// ── Bookings ────────────────────────────────────────────────────────────────

const dateTimeStringSchema = z
  .string()
  .trim()
  .min(1, 'La fecha es obligatoria')
  .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Fecha inválida')

export const bookingApiSchema = z.object({
  date: dateTimeStringSchema,
  endDate: dateTimeStringSchema.optional().nullable(),
  clientName: z.string().trim().min(1, 'El nombre del cliente es obligatorio').max(100),
  clientEmail: z.string().trim().email('Email inválido').max(150),
  clientPhone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{1,14}$/, 'Teléfono internacional inválido (+34...)')
    .max(30)
    .optional()
    .nullable(),
  clientNotes: z.string().trim().max(1000).optional().nullable(),
  guestCount: z.coerce.number().int().positive().optional().nullable(),
  serviceId: z.string().trim().min(1, 'El servicio es obligatorio'),
  adminNotes: z.string().trim().max(1000).optional().nullable(),
  totalAmount: z.coerce.number().optional().nullable(),
  paymentStatus: z.string().trim().max(50).optional().nullable(),
  paymentMethod: z.string().trim().max(50).optional().nullable(),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'CANCELLED', 'COMPLETED', 'NO_SHOW'])
    .optional(),
})

export const bookingPatchSchema = bookingApiSchema
  .extend({
    cancellationReason: z.string().optional().nullable(),
    paidAmount: z.coerce.number().optional().nullable(),
    paymentRef: z.string().optional().nullable(),
  })
  .partial()
