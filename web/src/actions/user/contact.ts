'use server'

import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import { recordAnalyticEvent } from '@/actions/analytics'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { contactFormSchema } from '@/lib/validations'
import { emailService } from '@/lib/email-service'
import { sendPushToAdmins } from '@/lib/push-service'
import { z } from 'zod'
import { ROUTES } from '@/config/routes'
import { createRateLimiter } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit-config'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

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

/** Sanitizar texto para evitar XSS */
function sanitizeText(text: string): string {
  return text
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
    .replaceAll('/', '&#x2F;')
    .trim()
}

export async function sendContactEmail(formData: FormData) {
  const recaptchaToken = formData.get('recaptchaToken') as string
  const isHuman = await verifyRecaptchaToken(recaptchaToken)
  if (!isHuman) {
    return { success: false, message: 'Verificación de seguridad fallida. Inténtalo de nuevo.' }
  }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    message: formData.get('message') as string,
    responsePreference: formData.get('responsePreference') as
      | 'EMAIL'
      | 'PHONE'
      | 'WHATSAPP'
      | 'INSTAGRAM',
    instagramUser: (formData.get('instagramUser') as string | undefined) || undefined,
    privacy: formData.get('privacy') === 'on',
  }

  try {
    const validatedData = contactFormSchema.parse(rawData)
    const sanitized = buildSanitizedData(validatedData)
    const meta = await extractRequestMeta()

    const rateLimitResult = await checkContactRateLimit(sanitized, meta.ipAddress)
    if (!rateLimitResult.allowed) {
      return { success: false, message: RATE_LIMITS.CONTACT.errorMessage }
    }

    const newContact = await persistContact(sanitized, meta)
    await trackContactAnalytics(newContact.id, sanitized, meta.referrer)
    await notifyAdminOfContact(sanitized)
    void notifyPushNewContact(newContact.id, sanitized)

    return { success: true, message: '¡Mensaje enviado! Te responderemos pronto.' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return { success: false, message: firstError?.message || 'Datos inválidos' }
    }
    logger.error('Error al guardar contacto:', { error })
    return { success: false, message: 'Error al enviar el mensaje. Intenta de nuevo.' }
  }
}

type ValidatedContactData = z.infer<typeof contactFormSchema>

function buildSanitizedData(data: ValidatedContactData) {
  return {
    name: sanitizeText(data.name),
    email: data.email ? data.email.toLowerCase().trim() : '',
    phone: data.phone ? sanitizeText(data.phone) : undefined,
    message: sanitizeText(data.message),
    responsePreference: data.responsePreference,
    instagramUser: data.instagramUser ? sanitizeText(data.instagramUser) : undefined,
  }
}

type SanitizedData = ReturnType<typeof buildSanitizedData>

async function extractRequestMeta() {
  const headersList = await headers()
  return {
    ipAddress: await getClientIp(),
    userAgent: headersList.get('user-agent') || 'unknown',
    referrer: headersList.get('referer') || null,
  }
}

async function checkContactRateLimit(sanitized: SanitizedData, ipAddress: string) {
  const result = await contactLimiter.check(ipAddress)
  if (result.allowed) {
    await contactLimiter.record(ipAddress, { email: sanitized.email, name: sanitized.name })
  }
  return result
}

async function persistContact(
  sanitized: SanitizedData,
  meta: Awaited<ReturnType<typeof extractRequestMeta>>
) {
  return prisma.contact.create({
    data: {
      ...sanitized,
      ipAddress: meta.ipAddress,
      referrer: meta.referrer,
    },
  })
}

async function trackContactAnalytics(
  contactId: string,
  sanitized: SanitizedData,
  referrer: string | null
) {
  await recordAnalyticEvent('CONTACT_SUBMIT', contactId, 'Contact', {
    metadata: { email: sanitized.email, referrer },
  })
}

async function notifyAdminOfContact(sanitized: SanitizedData) {
  try {
    await emailService.notifyNewContact({
      name: sanitized.name,
      email: sanitized.email ?? '',
      phone: sanitized.phone,
      message: sanitized.message,
      preference: sanitized.responsePreference,
    })
  } catch (emailError) {
    logger.error('Error enviando notificación de email:', { error: emailError })
  }
}

async function notifyPushNewContact(contactId: string, sanitized: SanitizedData) {
  const preview =
    sanitized.message.length > 80 ? `${sanitized.message.substring(0, 80)}…` : sanitized.message
  await sendPushToAdmins({
    title: '📬 Nuevo mensaje de contacto',
    body: `${sanitized.name}: "${preview}"`,
    type: 'contact',
    id: contactId,
    screen: 'contacts',
  })
}

// Admin actions
export async function getContacts() {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)

  return await prisma.contact.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 500,
  })
}

export async function getUnreadContactsCount() {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)

  return await prisma.contact.count({
    where: { isRead: false, deletedAt: null },
  })
}

export async function markContactAsRead(id: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)

  await prisma.contact.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  })
  revalidatePath(ROUTES.admin.contacts)
}

export async function markContactAsReplied(id: string, adminNote?: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)

  await prisma.contact.update({
    where: { id },
    data: {
      isReplied: true,
      repliedAt: new Date(),
      isRead: true,
      readAt: new Date(),
      adminNote,
    },
  })
  revalidatePath(ROUTES.admin.contacts)
}

export async function deleteContact(id: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)

  await prisma.contact.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
  revalidatePath(ROUTES.admin.contacts)
}

export async function exportContactsToCSV(): Promise<string> {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)

  const contacts = await prisma.contact.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: {
      name: true,
      email: true,
      phone: true,
      message: true,
      subject: true,
      responsePreference: true,
      status: true,
      isRead: true,
      createdAt: true,
    },
  })

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`

  const header = 'Nombre,Email,Teléfono,Asunto,Mensaje,Preferencia contacto,Estado,Leído,Fecha\n'
  const rows = contacts.map((c) =>
    [
      escape(c.name),
      escape(c.email),
      escape(c.phone ?? ''),
      escape(c.subject ?? ''),
      escape(c.message),
      escape(c.responsePreference),
      escape(c.status),
      c.isRead ? 'Sí' : 'No',
      escape(c.createdAt.toISOString()),
    ].join(',')
  )
  return header + rows.join('\n')
}
