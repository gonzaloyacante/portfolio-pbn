'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { headers } from 'next/headers'

import { logger } from '@/lib/logger'
import { emailService } from '@/lib/email-service'
import { ROUTES } from '@/config/routes'
import { auth } from '@/lib/auth'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'

// Rate limiting cache (simple in-memory, for production use Redis)
const recentSubmissions = new Map<string, number>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes

import { z } from 'zod'

const TestimonialSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  text: z
    .string()
    .min(20, 'El testimonio debe tener al menos 20 caracteres')
    .max(500, 'El testimonio no puede superar los 500 caracteres'),
  position: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
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
  await checkApiRateLimit()

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
      data: { name, text, position, rating, isActive: true },
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about)
    revalidateTag(CACHE_TAGS.testimonials, 'max')
    logger.info(`Testimonial created: ${name}`)
    return { success: true }
  } catch (error) {
    logger.error('Error creating testimonial:', { error })
    return { success: false, error: 'Error al crear el testimonio' }
  }
}

function cleanOldRateLimitEntries(now: number) {
  for (const [key, time] of recentSubmissions.entries()) {
    if (now - time > RATE_LIMIT_WINDOW) {
      recentSubmissions.delete(key)
    }
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
    rating: parseInt(formData.get('rating') as string) || 5,
  }

  const validation = TestimonialSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const { name, text, email, rating } = validation.data

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const lastSubmission = recentSubmissions.get(ip)

  if (lastSubmission && now - lastSubmission < RATE_LIMIT_WINDOW) {
    const minutesLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - lastSubmission)) / 60000)
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
        position: email ? `Cliente verificado (${email})` : 'Cliente',
        rating,
        isActive: false,
      },
    })

    recentSubmissions.set(ip, now)
    cleanOldRateLimitEntries(now)

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
  await checkApiRateLimit()

  const rawData = {
    name: formData.get('name'),
    text: formData.get('text'),
    position: formData.get('position'),
    company: formData.get('company'),
    website: formData.get('website'),
    avatarUrl: formData.get('avatarUrl'),
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
  const session = await auth()

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
        rating: data.rating,
        isActive: data.isActive,
        verified: data.isVerified, // Schema uses 'verified' boolean
        featured: data.isFeatured, // Schema uses 'featured' boolean
        status: data.status,
        moderationNote: data.moderationNote,
        moderatedAt: new Date(),
        moderatedBy: session?.user?.id || 'system',
      },
    })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about)
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
  await checkApiRateLimit()

  try {
    await prisma.testimonial.delete({ where: { id } })

    revalidatePath(ROUTES.home)
    revalidatePath(ROUTES.public.about)
    revalidateTag(CACHE_TAGS.testimonials, 'max')
    logger.info(`Testimonial deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting testimonial:', { error })
    return { success: false, error: 'Error al eliminar el testimonio' }
  }
}

export async function toggleTestimonial(id: string) {
  await requireAdmin()
  await checkApiRateLimit()

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
    revalidatePath(ROUTES.public.about)
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
        where: { isActive: true, status: 'APPROVED' },
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
