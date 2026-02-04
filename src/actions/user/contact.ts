'use server'

import { prisma } from '@/lib/db'
import { recordAnalyticEvent } from '@/actions/analytics'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { contactFormSchema } from '@/lib/validations'
import { emailService } from '@/lib/email-service'
import { z } from 'zod'
import { ROUTES } from '@/config/routes'
import { createRateLimiter } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit-config'

/**
 * Acciones de contacto con validación robusta y rate limiting
 */

// Create rate limiter instance
const contactLimiter = createRateLimiter(RATE_LIMITS.CONTACT)

async function getClientIp(): Promise<string> {
  const headersList = await headers()

  // Intentar obtener IP de diferentes headers (proxies, CDNs)
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const cfConnectingIp = headersList.get('cf-connecting-ip') // Cloudflare

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return realIp || cfConnectingIp || 'unknown'
}

/**
 * Sanitizar texto para evitar XSS
 */
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

export async function sendContactEmail(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    message: formData.get('message') as string,
    responsePreference: formData.get('responsePreference') as 'EMAIL' | 'PHONE' | 'WHATSAPP',
    privacy: formData.get('privacy') === 'on', // Checkbox sends 'on'
  }

  try {
    // 🔐 VALIDACIÓN CON ZOD
    const validatedData = contactFormSchema.parse(rawData)

    // 🛡️ SANITIZACIÓN
    const sanitizedData = {
      name: sanitizeText(validatedData.name),
      email: validatedData.email.toLowerCase().trim(),
      phone: validatedData.phone ? sanitizeText(validatedData.phone) : undefined,
      message: sanitizeText(validatedData.message),
      responsePreference: validatedData.responsePreference,
    }

    // 🔐 OBTENER METADATA
    const headersList = await headers()
    const ipAddress = await getClientIp()
    const userAgent = headersList.get('user-agent') || 'unknown'
    const referrer = headersList.get('referer') || null

    // 🔐 RATE LIMITING
    const rateLimitResult = await contactLimiter.check(ipAddress)

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        message: RATE_LIMITS.CONTACT.errorMessage,
      }
    }

    // Registrar intento
    await contactLimiter.record(ipAddress, {
      email: sanitizedData.email,
      name: sanitizedData.name,
    })

    // 💾 GUARDAR EN BD
    const newContact = await prisma.contact.create({
      data: {
        ...sanitizedData,
        ipAddress,
        userAgent,
        referrer,
        // Default status is NEW, priority MEDIUM
      },
    })

    // 📊 ANALÍTICA
    await recordAnalyticEvent('CONTACT_SUBMIT', newContact.id, 'Contact', {
      metadata: {
        email: sanitizedData.email, // Safe metadata
        referrer,
      },
    })

    // 📧 ENVIAR NOTIFICACIÓN AL ADMIN
    try {
      await emailService.notifyNewContact({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        message: sanitizedData.message,
        preference: sanitizedData.responsePreference,
      })
    } catch (emailError) {
      console.error('Error enviando notificación de email:', emailError)
      // No fallamos la request si el email falla, pero lo logueamos
    }

    return { success: true, message: '¡Mensaje enviado! Te responderemos pronto.' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return { success: false, message: firstError?.message || 'Datos inválidos' }
    }

    console.error('Error al guardar contacto:', error)
    return { success: false, message: 'Error al enviar el mensaje. Intenta de nuevo.' }
  }
}

// Admin actions
export async function getContacts() {
  return await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUnreadContactsCount() {
  return await prisma.contact.count({
    where: { isRead: false },
  })
}

export async function markContactAsRead(id: string) {
  await prisma.contact.update({
    where: { id },
    data: { isRead: true },
  })
  revalidatePath(ROUTES.admin.contacts)
}

export async function markContactAsReplied(id: string, adminNote?: string) {
  await prisma.contact.update({
    where: { id },
    data: {
      isReplied: true,
      isRead: true,
      adminNote,
    },
  })
  revalidatePath(ROUTES.admin.contacts)
}

export async function deleteContact(id: string) {
  await prisma.contact.delete({
    where: { id },
  })
  revalidatePath(ROUTES.admin.contacts)
}
