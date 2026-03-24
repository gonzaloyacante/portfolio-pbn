import { EMAIL_BRAND_COLORS, EMAIL_NEUTRAL_COLORS } from '@/lib/design-tokens'
import { ROUTES } from '@/config/routes'

/** Escapes HTML special characters to prevent XSS in email templates. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export const EMAIL_STYLES = {
  fontFamily: "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;",
  body: `margin: 0; padding: 0; background-color: ${EMAIL_NEUTRAL_COLORS.bodyBg}; width: 100%;`,
  container: `max-width: 600px; margin: 40px auto; background-color: ${EMAIL_NEUTRAL_COLORS.containerBg}; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid ${EMAIL_NEUTRAL_COLORS.border};`,
  header: `text-align: center; padding-bottom: 32px; border-bottom: 1px solid ${EMAIL_NEUTRAL_COLORS.border}; margin-bottom: 32px;`,
  logo: `color: ${EMAIL_NEUTRAL_COLORS.headingText}; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;`,
  subhead: `color: ${EMAIL_NEUTRAL_COLORS.subheadText}; margin: 8px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;`,
  content: 'text-align: left;',
  heading: `margin: 0 0 24px 0; color: ${EMAIL_NEUTRAL_COLORS.headingText}; font-size: 20px; font-weight: 700; line-height: 1.25;`,
  text: `font-size: 16px; color: ${EMAIL_NEUTRAL_COLORS.bodyText}; line-height: 1.625; margin-bottom: 24px;`,
  box: `background-color: ${EMAIL_NEUTRAL_COLORS.boxBg}; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid ${EMAIL_NEUTRAL_COLORS.border};`,
  label: `font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${EMAIL_NEUTRAL_COLORS.subheadText}; margin-bottom: 4px; display: block;`,
  value: `font-size: 16px; color: ${EMAIL_NEUTRAL_COLORS.headingText}; font-weight: 500; margin: 0;`,
  buttonContainer: 'text-align: center; margin: 40px 0;',
  button: (color: string) =>
    `display: inline-block; background-color: ${color}; color: ${EMAIL_NEUTRAL_COLORS.buttonText}; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px ${color}40; transition: all 0.2s;`,
  footer: `text-align: center; padding-top: 32px; border-top: 1px solid ${EMAIL_NEUTRAL_COLORS.border}; color: ${EMAIL_NEUTRAL_COLORS.footerText}; font-size: 12px; margin-top: 32px;`,
  link: `color: ${EMAIL_NEUTRAL_COLORS.linkText}; text-decoration: underline;`,
  warningBox: `background-color: ${EMAIL_NEUTRAL_COLORS.warningBg}; color: ${EMAIL_NEUTRAL_COLORS.warningText}; padding: 16px; border-radius: 8px; font-size: 14px; margin-top: 24px; border: 1px solid ${EMAIL_NEUTRAL_COLORS.warningBorder};`,
}

export const COLORS = {
  primary: EMAIL_BRAND_COLORS.primary,
  secondary: EMAIL_BRAND_COLORS.secondary,
  success: EMAIL_BRAND_COLORS.success,
  warning: EMAIL_BRAND_COLORS.warning,
  danger: EMAIL_BRAND_COLORS.danger,
}

interface BaseTemplateProps {
  title: string
  children: string
  ownerName?: string
  siteName?: string
}

function generateEmailHtml({ title, children, ownerName, siteName }: BaseTemplateProps): string {
  const displayName = ownerName || 'Paola Bolívar Nievas'
  const displaySite = siteName || 'Portfolio Profesional'
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
    }
  </style>
</head>
<body style="${EMAIL_STYLES.fontFamily} ${EMAIL_STYLES.body}">
  <div style="${EMAIL_STYLES.container}" class="container">
    <div style="${EMAIL_STYLES.header}">
      <h1 style="${EMAIL_STYLES.logo}">${displayName}</h1>
      <p style="${EMAIL_STYLES.subhead}">${displaySite}</p>
    </div>

    <div style="${EMAIL_STYLES.content}">
      <h2 style="${EMAIL_STYLES.heading}">${title}</h2>
      ${children}
    </div>

    <div style="${EMAIL_STYLES.footer}">
      <p style="margin-bottom: 8px;">© ${new Date().getFullYear()} ${displayName}. Todos los derechos reservados.</p>
      <p style="margin: 0;">Este correo fue enviado automáticamente desde tu portfolio.</p>
    </div>
  </div>
</body>
</html>`
}

// =============================================================================
// TEMPLATES
// =============================================================================

/**
 * 1. New Contact Message (Admin Notification)
 */
export const getContactMessageEmail = (params: {
  name: string
  email: string
  phone?: string
  message: string
  preference: string
  ownerName?: string
  siteName?: string
}) => {
  return generateEmailHtml({
    title: '✨ Nuevo Mensaje de Contacto',
    ownerName: params.ownerName,
    siteName: params.siteName,
    children: `
      <p style="${EMAIL_STYLES.text}">
        Recibiste un nuevo mensaje a través del formulario de contacto de tu sitio web.
        Aquí están los detalles:
      </p>

      <div style="${EMAIL_STYLES.box}">
        <div style="margin-bottom: 20px;">
          <span style="${EMAIL_STYLES.label}">Nombre</span>
          <p style="${EMAIL_STYLES.value}">${esc(params.name)}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <span style="${EMAIL_STYLES.label}">Email</span>
          <p style="${EMAIL_STYLES.value}">
            <a href="mailto:${esc(params.email)}" style="color: inherit; text-decoration: none;">${esc(params.email)}</a>
          </p>
        </div>

        ${
          params.phone
            ? `
        <div style="margin-bottom: 20px;">
          <span style="${EMAIL_STYLES.label}">Teléfono</span>
          <p style="${EMAIL_STYLES.value}">
             <a href="tel:${esc(params.phone)}" style="color: inherit; text-decoration: none;">${esc(params.phone)}</a>
          </p>
        </div>`
            : ''
        }

        <div style="margin-bottom: 20px;">
          <span style="${EMAIL_STYLES.label}">Preferencia de Contacto</span>
          <p style="${EMAIL_STYLES.value}">${esc(params.preference)}</p>
        </div>

        <div>
          <span style="${EMAIL_STYLES.label}">Mensaje</span>
          <p style="${EMAIL_STYLES.value}; white-space: pre-wrap;">"${esc(params.message)}"</p>
        </div>
      </div>

      <div style="${EMAIL_STYLES.buttonContainer}">
        <a href="mailto:${params.email}" style="${EMAIL_STYLES.button(COLORS.primary)}">
          Responder por Email
        </a>
      </div>
    `,
  })
}

/**
 * 2. Password Reset Email (Admin)
 */
export const getPasswordResetEmail = (params: {
  resetUrl: string
  ipAddress?: string // Optional security context
  ownerName?: string
  siteName?: string
}) => {
  return generateEmailHtml({
    title: '🔐 Recuperación de Contraseña',
    ownerName: params.ownerName,
    siteName: params.siteName,
    children: `
      <p style="${EMAIL_STYLES.text}">
        Recibimos una solicitud para restablecer la contraseña de tu cuenta de administrador.
        Si fuiste tú, puedes continuar haciendo clic en el siguiente botón:
      </p>

      <div style="${EMAIL_STYLES.buttonContainer}">
        <a href="${params.resetUrl}" style="${EMAIL_STYLES.button(COLORS.secondary)}">
          Restablecer Contraseña
        </a>
      </div>

      <p style="${EMAIL_STYLES.text}; font-size: 14px; color: ${EMAIL_NEUTRAL_COLORS.subheadText}; text-align: center;">
        Este enlace expirará en 1 hora por seguridad.
      </p>

      ${
        params.ipAddress
          ? `
      <div style="text-align: center; margin-top: 32px; font-size: 12px; color: ${EMAIL_NEUTRAL_COLORS.footerText};">
        Solicitado desde IP: ${esc(params.ipAddress)}
      </div>`
          : ''
      }

      <div style="${EMAIL_STYLES.warningBox}">
        <strong>¿No fuiste tú?</strong><br/>
        Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no cambiará.
      </div>
    `,
  })
}

/**
 * 3. New Login Alert (Security)
 */
export const getLoginAlertEmail = (params: {
  date: string
  ipAddress: string
  userAgent: string
  location?: string
  ownerName?: string
  siteName?: string
}) => {
  return generateEmailHtml({
    title: '🛡️ Alerta de Nuevo Inicio de Sesión',
    ownerName: params.ownerName,
    siteName: params.siteName,
    children: `
      <p style="${EMAIL_STYLES.text}">
        Detectamos un nuevo inicio de sesión en tu panel de administración.
        Por seguridad, te notificamos los detalles de la conexión:
      </p>

      <div style="${EMAIL_STYLES.box}">
        <div style="margin-bottom: 16px;">
          <span style="${EMAIL_STYLES.label}">Fecha y Hora</span>
          <p style="${EMAIL_STYLES.value}">${params.date}</p>
        </div>

        <div style="margin-bottom: 16px;">
          <span style="${EMAIL_STYLES.label}">Dirección IP</span>
          <p style="${EMAIL_STYLES.value}">${esc(params.ipAddress)}</p>
        </div>

        ${
          params.location
            ? `
        <div style="margin-bottom: 16px;">
          <span style="${EMAIL_STYLES.label}">Ubicación Aproximada</span>
          <p style="${EMAIL_STYLES.value}">${esc(params.location)}</p>
        </div>`
            : ''
        }

        <div>
          <span style="${EMAIL_STYLES.label}">Dispositivo / Navegador</span>
          <p style="${EMAIL_STYLES.value}; font-size: 14px;">${esc(params.userAgent)}</p>
        </div>
      </div>

      <div style="${EMAIL_STYLES.warningBox}">
        <strong>¿No reconoces esta actividad?</strong><br/>
        Si no iniciaste sesión recientemente, te recomendamos cambiar tu contraseña inmediatamente y contactar al desarrollador.
      </div>

      <div style="${EMAIL_STYLES.buttonContainer}">
         <a href="${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.admin.account}" style="${EMAIL_STYLES.button(COLORS.danger)}">
          Revisar Seguridad
        </a>
      </div>
    `,
  })
}

/**
 * 4. New Testimonial Alert (Admin)
 */
/**
 * 4. New Testimonial Alert (Admin)
 */
export const getTestimonialAlertEmail = (params: {
  name: string
  rating: number
  text: string
  email?: string
  ownerName?: string
  siteName?: string
}) => {
  return generateEmailHtml({
    title: '🌟 Nuevo Testimonio Recibido',
    ownerName: params.ownerName,
    siteName: params.siteName,
    children: `
      <p style="${EMAIL_STYLES.text}">
        Un cliente ha dejado un nuevo testimonio en tu sitio web.
        Está pendiente de revisión en el panel de administración.
      </p>

      <div style="${EMAIL_STYLES.box}">
        <div style="margin-bottom: 16px;">
          <span style="${EMAIL_STYLES.label}">Cliente</span>
          <p style="${EMAIL_STYLES.value}">${esc(params.name)} ${params.email ? `(${esc(params.email)})` : ''}</p>
        </div>

        <div style="margin-bottom: 16px;">
          <span style="${EMAIL_STYLES.label}">Calificación</span>
          <p style="${EMAIL_STYLES.value}">${'⭐'.repeat(params.rating)}</p>
        </div>

        <div>
           <span style="${EMAIL_STYLES.label}">Mensaje</span>
           <p style="${EMAIL_STYLES.value}; font-style: italic;">"${esc(params.text)}"</p>
        </div>
      </div>

       <div style="${EMAIL_STYLES.buttonContainer}">
         <a href="${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.admin.testimonials}" style="${EMAIL_STYLES.button(COLORS.success)}">
          Moderar Testimonio
        </a>
      </div>
    `,
  })
}

/**
 * 5. New Booking Alert (Admin)
 */
export const getBookingAlertEmail = (params: {
  date: Date
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceId: string // Ideally service name, but ID for now or resolved before passing
  notes?: string
  ownerName?: string
  siteName?: string
}) => {
  const dateString = params.date.toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  })

  return generateEmailHtml({
    title: '📅 Nueva Reserva Recibida',
    ownerName: params.ownerName,
    siteName: params.siteName,
    children: `
      <p style="${EMAIL_STYLES.text}">
        Tienes una nueva solicitud de reserva pendiente de confirmación.
      </p>

      <div style="${EMAIL_STYLES.box}">
        <div style="margin-bottom: 16px;">
          <span style="${EMAIL_STYLES.label}">Cliente</span>
          <p style="${EMAIL_STYLES.value}">${esc(params.clientName)}</p>
          <p style="${EMAIL_STYLES.value}; font-size: 14px; font-weight: normal;">
            <a href="mailto:${esc(params.clientEmail)}" style="color: inherit;">${esc(params.clientEmail)}</a>
          </p>
          ${
            params.clientPhone
              ? `<p style="${EMAIL_STYLES.value}; font-size: 14px; font-weight: normal;">${esc(params.clientPhone)}</p>`
              : ''
          }
        </div>

        <div style="margin-bottom: 16px;">
          <span style="${EMAIL_STYLES.label}">Fecha y Hora Solicitada</span>
          <p style="${EMAIL_STYLES.value}">${dateString}</p>
        </div>

        <div style="margin-bottom: 16px;">
           <span style="${EMAIL_STYLES.label}">Servicio (ID)</span>
           <p style="${EMAIL_STYLES.value}">${esc(params.serviceId)}</p>
        </div>

        ${
          params.notes
            ? `
        <div>
           <span style="${EMAIL_STYLES.label}">Notas Adicionales</span>
           <p style="${EMAIL_STYLES.value}; font-style: italic;">"${esc(params.notes)}"</p>
        </div>`
            : ''
        }
      </div>

       <div style="${EMAIL_STYLES.buttonContainer}">
         <a href="${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.admin.calendar}" style="${EMAIL_STYLES.button(COLORS.primary)}">
          Gestionar Reserva
        </a>
      </div>
    `,
  })
}

/**
 * 6. Booking Confirmation (Client)
 */
export const getBookingConfirmationEmail = (params: {
  clientName: string
  date: Date
  ownerName?: string
  siteName?: string
}) => {
  const dateString = params.date.toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  })

  return generateEmailHtml({
    title: 'Reserva Recibida',
    ownerName: params.ownerName,
    siteName: params.siteName,
    children: `
      <p style="${EMAIL_STYLES.text}">
        Hola ${esc(params.clientName)},
      </p>
      <p style="${EMAIL_STYLES.text}">
        Hemos recibido tu solicitud de reserva correctamente.
      </p>

      <div style="${EMAIL_STYLES.box}">
        <div style="margin-bottom: 16px;">
          <span style="${EMAIL_STYLES.label}">Fecha Solicitada</span>
          <p style="${EMAIL_STYLES.value}">${dateString}</p>
        </div>
        <div>
           <p style="${EMAIL_STYLES.value}; font-size: 14px; font-weight: normal;">
             Estado: <strong>Pendiente de Confirmación</strong>
           </p>
        </div>
      </div>

      <p style="${EMAIL_STYLES.text}">
        Analizaremos tu solicitud y te contactaremos a la brevedad para confirmarla.
        Si necesitas hacer cambios, por favor contáctanos respondiendo a este correo.
      </p>

      <p style="${EMAIL_STYLES.text}">
        ¡Gracias por elegirnos!
      </p>
    `,
  })
}
