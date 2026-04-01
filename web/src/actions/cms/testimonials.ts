'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { headers } from 'next/headers'

import { logger } from '@/lib/logger'
import { emailService } from '@/lib/email-service'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { createRateLimiter } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit-config'

// Rate limiter para el formulario público de testimonios
const publicTestimonialLimiter = createRateLimiter(RATE_LIMITS.TESTIMONIAL)

import { z } from 'zod'

const TestimonialSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
  text: z
    .string()
    .trim()
    .min(20, 'El testimonio debe tener al menos 20 caracteres')
    .max(1000, 'El testimonio no puede superar los 1000 caracteres'),
  position: z.string().trim().max(100).optional(),
  company: z.string().trim().max(100).optional(),
  website: z.string().trim().url().max(200).optional().or(z.literal('')),
  avatarUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  email: z.string().trim().email().max(150).optional().or(z.literal('')),
  phone: z.string().trim().max(30).optional(),
  rating: z.number().min(1).max(5).default(5),
  // Admin fields
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  moderationNote: z.string().optional(),
})

export async function createTestimonial(formData: FormData) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  const rawData = {
    name: formData.get('name'),
    text: formData.get('text'),
    position: formData.get('position'),
    rating: parseInt(formData.get('rating') as string) || 5,
  }

  const validation = TestimonialSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const { name, text, position, rating } = validation.data

  try {
    await prisma.testimonial.create({
      // Los testimonios creados por admin se aprueban automáticamente
      data: { name, text, position, rating, isActive: true, status: 'APPROVED' },
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about, 'layout')
    revalidateTag(CACHE_TAGS.testimonials, 'max')
    logger.info(`Testimonial created: ${name}`)
    return { success: true }
  } catch (error) {
    logger.error('Error creating testimonial:', { error })
    return { success: false, error: 'Error al crear el testimonio' }
  }
}

/**
 * Create testimonial from public form (goes to moderation)
 */
export async function submitPublicTestimonial(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    text: formData.get('text'),
    email: formData.get('email'),
    position: formData.get('position'),
    company: formData.get('company'),
    rating: parseInt(formData.get('rating') as string) || 5,
  }

  const validation = TestimonialSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const { name, text, email, position, company, rating } = validation.data

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

  const rateCheck = await publicTestimonialLimiter.check(ip)
  if (!rateCheck.allowed) {
    const minutesLeft = Math.ceil((rateCheck.resetIn ?? 900) / 60)
    return {
      success: false,
      error: `Por favor espera ${minutesLeft} minutos antes de enviar otro testimonio`,
    }
  }

  try {
    await prisma.testimonial.create({
      data: {
        name,
        text,
        email: email || null,
        position: position || null,
        company: company || null,
        rating,
        isActive: false,
      },
    })

    await publicTestimonialLimiter.record(ip)

    // 📧 NOTIFICAR AL ADMIN
    try {
      await emailService.notifyNewTestimonial({
        name,
        rating,
        text,
        email: email ? (email as string) : undefined,
      })
    } catch (emailError) {
      logger.error('Error sending testimonial email:', { error: emailError })
    }

    revalidatePath(ROUTES.admin.testimonials)
    revalidateTag(CACHE_TAGS.testimonials, 'max')
    logger.info(`Public testimonial submitted: ${name}`)
    return {
      success: true,
      message: '¡Gracias por tu testimonio! Será publicado después de ser revisado.',
    }
  } catch (error) {
    logger.error('Error submitting public testimonial:', { error })
    return { success: false, error: 'Error al enviar el testimonio. Intenta de nuevo.' }
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  const rawData = {
    name: formData.get('name'),
    text: formData.get('text'),
    position: formData.get('position'),
    company: formData.get('company'),
    website: formData.get('website'),
    avatarUrl: formData.get('avatarUrl'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    rating: parseInt(formData.get('rating') as string),
    isActive: formData.get('isActive') === 'true',
    isVerified: formData.get('isVerified') === 'true',
    isFeatured: formData.get('isFeatured') === 'true',
    status: formData.get('status'),
    moderationNote: formData.get('moderationNote'),
  }

  const validation = TestimonialSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const data = validation.data

  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        text: data.text,
        position: data.position,
        company: data.company,
        website: data.website,
        avatarUrl: data.avatarUrl,
        email: data.email,
        phone: data.phone,
        rating: data.rating,
        isActive: data.isActive,
        verified: data.isVerified, // Schema uses 'verified' boolean
        featured: data.isFeatured, // Schema uses 'featured' boolean
        status: data.status,
        moderationNote: data.moderationNote,
        moderatedAt: new Date(),
      },
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about, 'layout')
    revalidatePath(ROUTES.admin.testimonials)
    revalidateTag(CACHE_TAGS.testimonials, 'max')
    logger.info(`Testimonial updated: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error updating testimonial:', { error })
    return { success: false, error: 'Error al actualizar el testimonio' }
  }
}

export async function deleteTestimonial(id: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  try {
    await prisma.testimonial.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about, 'layout')
    revalidatePath(ROUTES.admin.testimonials)
    revalidateTag(CACHE_TAGS.testimonials, 'max')
    logger.info(`Testimonial soft deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting testimonial:', { error })
    return { success: false, error: 'Error al eliminar el testimonio' }
  }
}

export async function toggleTestimonial(id: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } })
    if (!testimonial) {
      return { success: false, error: 'Testimonio no encontrado' }
    }

    await prisma.testimonial.update({
      where: { id },
      data: { isActive: !testimonial.isActive },
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about, 'layout')
    revalidatePath(ROUTES.admin.testimonials)
    revalidateTag(CACHE_TAGS.testimonials, 'max')
    logger.info(`Testimonial toggled: ${id} -> ${!testimonial.isActive}`)
    return { success: true, isActive: !testimonial.isActive }
  } catch (error) {
    logger.error('Error toggling testimonial:', { error })
    return { success: false, error: 'Error al cambiar el estado del testimonio' }
  }
}

/**
 * Get active testimonials for public display
 */
export const getActiveTestimonials = unstable_cache(
  async (limit = 6) => {
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: { isActive: true, status: 'APPROVED', deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
      return testimonials
    } catch (error) {
      logger.error('Error fetching testimonials:', { error })
      return []
    }
  },
  [CACHE_TAGS.testimonials],
  { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.testimonials] }
)
