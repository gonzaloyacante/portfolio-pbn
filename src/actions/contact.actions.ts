'use server'

import { prisma } from '@/lib/db'
import { recordAnalyticEvent } from '@/actions/analytics.actions'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { contactFormSchema } from '@/lib/validations'
import { z } from 'zod'

/**
 * Acciones de contacto con validación robusta y rate limiting
 */

// Rate limiting: 15 minutos entre mensajes desde la misma IP
const RATE_LIMIT_MINUTES = 15

async function checkRateLimit(ipAddress: string): Promise<boolean> {
  const fifteenMinutesAgo = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000)

  const recentContact = await prisma.contact.findFirst({
    where: {
      ipAddress,
      createdAt: {
        gte: fifteenMinutesAgo,
      },
    },
  })

  return !recentContact // true si puede enviar, false si está bloqueado
}

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
    message: formData.get('message') as string,
  }

  try {
    // 🔐 VALIDACIÓN CON ZOD
    const validatedData = contactFormSchema.parse(rawData)

    // 🛡️ SANITIZACIÓN
    const sanitizedData = {
      name: sanitizeText(validatedData.name),
      email: validatedData.email.toLowerCase().trim(),
      message: sanitizeText(validatedData.message),
    }

    // 🔐 OBTENER IP
    const ipAddress = await getClientIp()

    // 🔐 RATE LIMITING
    const canSend = await checkRateLimit(ipAddress)

    if (!canSend) {
      return {
        success: false,
        message: `Por favor espera ${RATE_LIMIT_MINUTES} minutos antes de enviar otro mensaje.`,
      }
    }

    // 💾 GUARDAR EN BD
    await prisma.contact.create({
      data: {
        ...sanitizedData,
        ipAddress,
      },
    })

    // 📊 ANALÍTICA
    await recordAnalyticEvent('CONTACT_SUBMIT')

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
  revalidatePath('/admin/contactos')
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
  revalidatePath('/admin/contactos')
}

export async function deleteContact(id: string) {
  await prisma.contact.delete({
    where: { id },
  })
  revalidatePath('/admin/contactos')
}
