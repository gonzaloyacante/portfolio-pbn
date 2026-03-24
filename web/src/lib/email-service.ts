import { logger } from '@/lib/logger'
import { Resend } from 'resend'
import {
  getContactMessageEmail,
  getPasswordResetEmail,
  getLoginAlertEmail,
  getTestimonialAlertEmail,
  getBookingAlertEmail,
  getBookingConfirmationEmail,
} from './email-templates'
import { getContactSettings } from '@/actions/settings/contact'
import { getSiteSettings } from '@/actions/settings/site'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

/**
 * Get branding info (owner name + site name) from admin settings
 */
async function getSenderBranding() {
  const [contact, site] = await Promise.all([getContactSettings(), getSiteSettings()])
  return {
    ownerName: contact?.ownerName || undefined,
    siteName: site?.siteName || undefined,
  }
}

/**
 * Get the administrator email dynamically
 */
async function getAdminEmail() {
  const settings = await getContactSettings()
  // Use settings email, or fallback to Env var.
  // CRITICAL: Do not hardcode personal emails here.
  const email = settings?.email || process.env.ADMIN_EMAIL

  if (!email) {
    logger.warn('⚠️ No Admin Email configured in Settings or .env!')
    return 'admin@example.com' // Safe placeholder instead of personal email
  }

  return email
}

/**
 * Get the sender identity
 * Using a verified domain or resend default for now
 */
async function getSender() {
  const { ownerName } = await getSenderBranding()
  const fromName = ownerName || 'Portfolio'
  const fromEmail = 'onboarding@resend.dev' // Replace with proper domain when verified, e.g., 'notificaciones@paolabolivar.es'

  if (process.env.EMAIL_FROM) {
    return process.env.EMAIL_FROM
  }

  return `${fromName} <${fromEmail}>`
}

/**
 * Core send function
 */
async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn('RESEND_API_KEY missing. Logging email instead:', { to, subject })
      logger.info('Email skipped (no API key)', { to, subject })
      return { success: false, error: 'API Key missing' }
    }

    const data = await resend.emails.send({
      from: await getSender(),
      to,
      replyTo,
      subject,
      html,
    })

    if (data.error) {
      logger.error('Resend Error:', data.error)
      return { success: false, error: data.error.message }
    }

    return { success: true, id: data.data?.id }
  } catch (error) {
    logger.error('Email Service Error:', { error: error })
    return { success: false, error: 'Internal error sending email' }
  }
}

export const emailService = {
  /**
   * Notify Admin about a new contact form submission
   */
  async notifyNewContact(data: {
    name: string
    email: string
    phone?: string
    message: string
    preference: string
  }) {
    const [adminEmail, branding] = await Promise.all([getAdminEmail(), getSenderBranding()])

    return sendEmail({
      to: adminEmail,
      subject: `✨ Nuevo Mensaje de ${data.name}`,
      replyTo: data.email,
      html: getContactMessageEmail({ ...data, ...branding }),
    })
  },

  /**
   * Send Password Reset Link to Admin
   */
  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`
    const branding = await getSenderBranding()

    return sendEmail({
      to: email,
      subject: '🔐 Recuperar Contraseña - Portfolio Admin',
      html: getPasswordResetEmail({ resetUrl, ...branding }),
    })
  },

  /**
   * Alert Admin about a new login
   */
  async sendLoginAlert(params: {
    email: string
    ipAddress: string
    userAgent: string
    location?: string
  }) {
    const branding = await getSenderBranding()
    return sendEmail({
      to: params.email,
      subject: '🛡️ Seguridad: Nuevo Inicio de Sesión Detectado',
      html: getLoginAlertEmail({
        date: new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        location: params.location,
        ...branding,
      }),
    })
  },

  /**
   * Notify Admin about a new testimonial
   */
  async notifyNewTestimonial(data: { name: string; rating: number; text: string; email?: string }) {
    const [adminEmail, branding] = await Promise.all([getAdminEmail(), getSenderBranding()])

    return sendEmail({
      to: adminEmail,
      subject: `🌟 Nuevo Testimonio de ${data.name}`,
      html: getTestimonialAlertEmail({ ...data, ...branding }),
    })
  },

  /**
   * Notify Admin about a new Booking
   */
  async notifyNewBooking(data: {
    date: Date
    clientName: string
    clientEmail: string
    clientPhone?: string
    serviceId: string
    notes?: string
  }) {
    const [adminEmail, branding] = await Promise.all([getAdminEmail(), getSenderBranding()])

    return sendEmail({
      to: adminEmail,
      subject: `📅 Nueva Reserva: ${data.clientName}`,
      html: getBookingAlertEmail({ ...data, ...branding }),
      replyTo: data.clientEmail,
    })
  },

  /**
   * Notify Client that booking is received (Pending)
   */
  async notifyClientBookingReceived(data: { clientEmail: string; clientName: string; date: Date }) {
    const branding = await getSenderBranding()
    return sendEmail({
      to: data.clientEmail,
      subject: '📅 Reserva Recibida - Pendiente de Confirmación',
      html: getBookingConfirmationEmail({
        clientName: data.clientName,
        date: data.date,
        ...branding,
      }),
    })
  },
}
