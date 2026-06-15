import { z } from 'zod'

import { isCloudinaryUploadUrl } from '@/lib/cloudinary-helper'

// ============================================
// DATA MODELS
// ============================================

// Category
export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no debe exceder los 100 caracteres'),
  slug: z
    .string()
    .trim()
    .min(1, 'El slug es obligatorio')
    .max(120, 'El slug es muy largo')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string().trim().max(500, 'La descripción es muy larga').optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
})

// Category gallery: POST /api/admin/categories/[id]/gallery
export const categoryGalleryImagesSchema = z.object({
  images: z
    .array(
      z.object({
        url: z
          .string()
          .url('no se subió correctamente')
          .refine(isCloudinaryUploadUrl, 'no se subió correctamente'),
        publicId: z.string().trim().min(1, 'no se subió correctamente'),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      })
    )
    .min(1, 'Debés seleccionar al menos una imagen')
    .max(50, 'No se pueden agregar más de 50 imágenes a la vez'),
})

// ── Services ────────────────────────────────────────────────────────────────

export const pricingTierSchema = z.array(
  z.object({
    name: z.string().trim().max(150),
    price: z.string().trim().max(50),
    description: z.string().trim().max(500).optional().nullable(),
  })
)

const slugApiSchema = z
  .string()
  .trim()
  .min(1, 'El slug es obligatorio')
  .max(160)
  .regex(/^[a-z0-9-]+$/, 'Slug inválido')

const generatedOnServerSlugSchema = z
  .union([slugApiSchema, z.literal('')])
  .optional()
  .nullable()

export const serviceApiSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(150),
  slug: generatedOnServerSlugSchema,
  description: z.string().trim().max(2000).optional().nullable(),
  shortDesc: z.string().trim().max(300).optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  priceLabel: z.string().trim().max(50).optional().nullable(),
  currency: z.string().trim().max(10).optional().nullable(),
  duration: z.string().trim().max(100).optional().nullable(),
  durationMinutes: z.number().int().positive().optional().nullable(),
  imageUrl: z.string().trim().optional().nullable(),
  galleryUrls: z.array(z.string().trim().min(1)).optional(),
  videoUrl: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  maxBookingsPerDay: z.number().int().positive().optional().nullable(),
  advanceNoticeDays: z.number().int().min(0).optional().nullable(),
  requirements: z.string().trim().max(2000).optional().nullable(),
  cancellationPolicy: z.string().trim().max(2000).optional().nullable(),
  pricingTiers: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().trim().max(150),
        price: z.string().trim().max(50),
        description: z.string().trim().max(500).optional().nullable(),
      })
    )
    .optional(),
})

// ── Category (API — extends base categorySchema) ────────────────────────────

export const categoryApiSchema = categorySchema.extend({
  slug: generatedOnServerSlugSchema,
  isActive: z.boolean().optional(),
})

// ── Testimonials (API — extends base) ───────────────────────────────────────

export const testimonialApiSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
  text: z.string().trim().min(1, 'El texto es obligatorio').max(1500),
  excerpt: z.string().trim().max(300).optional().nullable(),
  position: z.string().trim().max(100).optional().nullable(),
  company: z.string().trim().max(100).optional().nullable(),
  email: z.string().trim().email().max(150).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  website: z.string().trim().url().max(200).optional().nullable(),
  avatarUrl: z.string().trim().optional().nullable(),
  rating: z.number().min(1).max(5).optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  source: z.string().trim().max(50).optional().nullable(),
  categoryId: z.string().trim().optional().nullable(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  isActive: z.boolean().optional(),
})

// ── Partial schemas for PATCH endpoints ─────────────────────────────────────

export const categoryPatchSchema = categorySchema
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial()

export const servicePatchSchema = serviceApiSchema
  .extend({
    slug: slugApiSchema.optional(),
    currency: z.string().optional(),
    durationMinutes: z.number().int().positive().optional().nullable(),
    isAvailable: z.boolean().optional(),
    maxBookingsPerDay: z.number().int().positive().optional().nullable(),
    advanceNoticeDays: z.number().int().min(0).optional().nullable(),
    sortOrder: z.number().optional(),
    requirements: z.string().optional().nullable(),
    cancellationPolicy: z.string().optional().nullable(),
  })
  .partial()

export const testimonialPatchSchema = testimonialApiSchema
  .extend({
    sortOrder: z.number().optional(),
  })
  .partial()
