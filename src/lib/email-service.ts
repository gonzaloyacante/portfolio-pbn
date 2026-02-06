import { Resend } from 'resend'
import {
  getContactMessageEmail,
  getPasswordResetEmail,
  getLoginAlertEmail,
  getTestimonialAlertEmail,
} from './email-templates'
import { getContactSettings } from '@/actions/settings/contact'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
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
    console.warn('⚠️ No Admin Email configured in Settings or .env!')
    return 'admin@example.com' // Safe placeholder instead of personal email
  }

  return email
}

/**
 * Get the sender identity
 * Using a verified domain or resend default for now
 */
function getSender() {
  const fromName = 'Portfolio Paola Bolívar'
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
      console.warn('⚠️ RESEND_API_KEY missing. Logging email instead:')
      console.log({ to, subject })
      return { success: false, error: 'API Key missing' }
    }

    const data = await resend.emails.send({
      from: getSender(),
      to,
      replyTo,
      subject,
      html,
    })

    if (data.error) {
      console.error('Resend Error:', data.error)
      return { success: false, error: data.error.message }
    }

    return { success: true, id: data.data?.id }
  } catch (error) {
    console.error('Email Service Error:', error)
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
    const adminEmail = await getAdminEmail()

    return sendEmail({
      to: adminEmail,
      subject: `✨ Nuevo Mensaje de ${data.name}`,
      replyTo: data.email,
      html: getContactMessageEmail(data),
    })
  },

  /**
   * Send Password Reset Link to Admin
   */
  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`

    return sendEmail({
      to: email,
      subject: '🔐 Recuperar Contraseña - Portfolio Admin',
      html: getPasswordResetEmail({ resetUrl }),
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
    return sendEmail({
      to: params.email,
      subject: '🛡️ Seguridad: Nuevo Inicio de Sesión Detectado',
      html: getLoginAlertEmail({
        date: new Date().toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' }),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        location: params.location,
      }),
    })
  },

  /**
   * Notify Admin about a new testimonial
   */
  async notifyNewTestimonial(data: { name: string; rating: number; text: string; email?: string }) {
    const adminEmail = await getAdminEmail()

    return sendEmail({
      to: adminEmail,
      subject: `🌟 Nuevo Testimonio de ${data.name}`,
      html: getTestimonialAlertEmail(data),
    })
  },
}
