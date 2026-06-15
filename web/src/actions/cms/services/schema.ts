import { z } from 'zod'

// ============================================
// VALIDATION SCHEMA
// ============================================

export const ServiceSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(150, 'Nombre muy largo'),
  slug: z
    .string()
    .trim()
    .optional()
    .nullable()
    .default('')
    .transform((value) => value ?? '')
    .pipe(
      z
        .string()
        .max(160, 'Slug muy largo')
        .regex(/^[a-z0-9-]*$/, 'Solo letras minúsculas, números y guiones')
    ),
  description: z.string().trim().max(2000, 'Descripción muy larga').optional().nullable(),
  shortDesc: z.string().trim().max(300, 'Resumen muy largo').optional().nullable(),

  // Pricing
  price: z.coerce.number().optional().nullable(),
  priceLabel: z.enum(['desde', 'fijo', 'consultar', 'gratis']).default('desde'),
  currency: z.string().default('EUR'),

  // Time & Availability
  duration: z.string().optional().nullable(),
  durationMinutes: z.coerce.number().optional().nullable(),
  isAvailable: z.boolean().default(true),
  maxBookingsPerDay: z.coerce.number().int().default(3),
  advanceNoticeDays: z.coerce.number().int().default(2),

  // Media
  imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
  galleryUrls: z.string().optional().nullable(), // Comma separated URLs
  videoUrl: z.string().url().optional().or(z.literal('')).nullable(),

  // Display
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),

  // Experience
  requirements: z.string().optional().nullable(),
  cancellationPolicy: z.string().optional().nullable(),
})

export type ServiceFormData = z.infer<typeof ServiceSchema>
