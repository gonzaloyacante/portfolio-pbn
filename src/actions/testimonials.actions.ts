'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { logger } from '@/lib/logger'

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
  email: z.string().email().optional().or(z.literal('')),
  rating: z.number().min(1).max(5).default(5),
  isActive: z.boolean().optional(),
})

export async function createTestimonial(formData: FormData) {
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

    revalidatePath('/')
    revalidatePath('/sobre-mi')
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

    revalidatePath('/admin/testimonios')
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
  const rawData = {
    name: formData.get('name'),
    text: formData.get('text'),
    position: formData.get('position'),
    rating: parseInt(formData.get('rating') as string),
    isActive: formData.get('isActive') === 'true',
  }

  const validation = TestimonialSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }
  const { name, text, position, rating, isActive } = validation.data

  try {
    await prisma.testimonial.update({
      where: { id },
      data: { name, text, position, rating, isActive },
    })

    revalidatePath('/')
    revalidatePath('/sobre-mi')
    logger.info(`Testimonial updated: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error updating testimonial:', { error })
    return { success: false, error: 'Error al actualizar el testimonio' }
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } })

    revalidatePath('/')
    revalidatePath('/sobre-mi')
    logger.info(`Testimonial deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting testimonial:', { error })
    return { success: false, error: 'Error al eliminar el testimonio' }
  }
}

export async function toggleTestimonial(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } })
    if (!testimonial) {
      return { success: false, error: 'Testimonio no encontrado' }
    }

    await prisma.testimonial.update({
      where: { id },
      data: { isActive: !testimonial.isActive },
    })

    revalidatePath('/')
    revalidatePath('/sobre-mi')
    revalidatePath('/admin/testimonios')
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
export async function getActiveTestimonials(limit = 6) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return testimonials
  } catch (error) {
    logger.error('Error fetching testimonials:', { error })
    return []
  }
}
