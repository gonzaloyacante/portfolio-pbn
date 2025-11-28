'use server'

import { prisma } from '@/lib/db'
import { recordAnalyticEvent } from '@/actions/analytics.actions'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

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

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  // Validación de campos
  if (!name || !email || !message) {
    return { success: false, message: 'Todos los campos son requeridos' }
  }

  // Validar longitud
  if (name.length < 2 || name.length > 100) {
    return { success: false, message: 'El nombre debe tener entre 2 y 100 caracteres' }
  }

  if (message.length < 10 || message.length > 1000) {
    return { success: false, message: 'El mensaje debe tener entre 10 y 1000 caracteres' }
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Email inválido' }
  }

  // Obtener IP del cliente
  const ipAddress = await getClientIp()

  try {
    // 🔐 RATE LIMITING: Verificar si la IP puede enviar mensajes
    const canSend = await checkRateLimit(ipAddress)

    if (!canSend) {
      return {
        success: false,
        message: `Por favor espera ${RATE_LIMIT_MINUTES} minutos antes de enviar otro mensaje.`,
      }
    }

    // Guardar en base de datos
    await prisma.contact.create({
      data: {
        name,
        email,
        message,
        ipAddress,
      },
    })

    // Record analytic event
    await recordAnalyticEvent('CONTACT_SUBMIT')

    return { success: true, message: '¡Mensaje enviado! Te responderemos pronto.' }
  } catch (error) {
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
