import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/design-tokens', () => ({
  EMAIL_BRAND_COLORS: {
    primary: '#6c0a0a',
    secondary: '#000000',
    success: '#059669',
    warning: '#d97706',
    danger: '#dc2626',
  },
  EMAIL_NEUTRAL_COLORS: {
    bodyBg: '#f9fafb',
    containerBg: '#ffffff',
    border: '#e5e7eb',
    headingText: '#111827',
    subheadText: '#6b7280',
    bodyText: '#374151',
    boxBg: '#f3f4f6',
    footerText: '#9ca3af',
    linkText: '#4b5563',
    buttonText: '#ffffff',
    warningBg: '#fef2f2',
    warningText: '#991b1b',
    warningBorder: '#fee2e2',
  },
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: {
      testimonials: '/admin/testimonios',
      calendar: '/admin/calendario',
      account: '/admin/mi-cuenta',
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  process.env.NEXT_PUBLIC_BASE_URL = 'https://portfolio.test'
})

// ── Tests: getContactMessageEmail ─────────────────────────────────────────────

describe('getContactMessageEmail', () => {
  it('should return valid HTML', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Juan',
      email: 'juan@test.com',
      message: 'Hello there',
      preference: 'EMAIL',
    })
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('</html>')
  })

  it('should include contact name', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'María García',
      email: 'maria@test.com',
      message: 'Test message',
      preference: 'EMAIL',
    })
    expect(html).toContain('María García')
  })

  it('should include contact email', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Test',
      email: 'specific@email.com',
      message: 'Test',
      preference: 'EMAIL',
    })
    expect(html).toContain('specific@email.com')
  })

  it('should include message text', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Test',
      email: 'test@test.com',
      message: 'This is my custom message content',
      preference: 'EMAIL',
    })
    expect(html).toContain('This is my custom message content')
  })

  it('should include phone when provided', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Test',
      email: 'test@test.com',
      phone: '+34600123456',
      message: 'Test',
      preference: 'PHONE',
    })
    expect(html).toContain('+34600123456')
  })

  it('should not include phone section when not provided', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Test',
      email: 'test@test.com',
      message: 'Test',
      preference: 'EMAIL',
    })
    expect(html).not.toContain('Teléfono')
  })

  it('should include preference label', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Test',
      email: 'test@test.com',
      message: 'Test',
      preference: 'WHATSAPP',
    })
    expect(html).toContain('WHATSAPP')
  })

  it('should include reply-by-email button', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Test',
      email: 'reply@test.com',
      message: 'Test',
      preference: 'EMAIL',
    })
    expect(html).toContain('mailto:reply@test.com')
  })

  it('should include portfolio branding', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Test',
      email: 'test@test.com',
      message: 'Test',
      preference: 'EMAIL',
    })
    expect(html).toContain('Paola Bolívar Nievas')
  })

  it('should include footer copyright', async () => {
    const { getContactMessageEmail } = await import('@/lib/email-templates')
    const html = getContactMessageEmail({
      name: 'Test',
      email: 'test@test.com',
      message: 'Test',
      preference: 'EMAIL',
    })
    expect(html).toContain('Todos los derechos reservados')
  })
})

// ── Tests: getPasswordResetEmail ──────────────────────────────────────────────

describe('getPasswordResetEmail', () => {
  it('should include reset URL', async () => {
    const { getPasswordResetEmail } = await import('@/lib/email-templates')
    const html = getPasswordResetEmail({ resetUrl: 'https://site.com/reset?token=abc' })
    expect(html).toContain('https://site.com/reset?token=abc')
  })

  it('should include reset button text', async () => {
    const { getPasswordResetEmail } = await import('@/lib/email-templates')
    const html = getPasswordResetEmail({ resetUrl: 'https://site.com/reset' })
    expect(html).toContain('Restablecer Contraseña')
  })

  it('should include expiration warning', async () => {
    const { getPasswordResetEmail } = await import('@/lib/email-templates')
    const html = getPasswordResetEmail({ resetUrl: 'https://site.com/reset' })
    expect(html).toContain('1 hora')
  })

  it('should include IP when provided', async () => {
    const { getPasswordResetEmail } = await import('@/lib/email-templates')
    const html = getPasswordResetEmail({ resetUrl: 'https://site.com/reset', ipAddress: '1.2.3.4' })
    expect(html).toContain('1.2.3.4')
  })

  it('should not include IP section when not provided', async () => {
    const { getPasswordResetEmail } = await import('@/lib/email-templates')
    const html = getPasswordResetEmail({ resetUrl: 'https://site.com/reset' })
    expect(html).not.toContain('Solicitado desde IP')
  })

  it('should include safety warning', async () => {
    const { getPasswordResetEmail } = await import('@/lib/email-templates')
    const html = getPasswordResetEmail({ resetUrl: 'https://site.com/reset' })
    expect(html).toContain('¿No fuiste tú?')
  })
})

// ── Tests: getLoginAlertEmail ─────────────────────────────────────────────────

describe('getLoginAlertEmail', () => {
  it('should include login date', async () => {
    const { getLoginAlertEmail } = await import('@/lib/email-templates')
    const html = getLoginAlertEmail({
      date: '23/02/2026, 10:00',
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
    })
    expect(html).toContain('23/02/2026')
  })

  it('should include IP address', async () => {
    const { getLoginAlertEmail } = await import('@/lib/email-templates')
    const html = getLoginAlertEmail({
      date: '23/02/2026',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    })
    expect(html).toContain('192.168.1.1')
  })

  it('should include user agent / device', async () => {
    const { getLoginAlertEmail } = await import('@/lib/email-templates')
    const html = getLoginAlertEmail({
      date: '23/02/2026',
      ipAddress: '1.2.3.4',
      userAgent: 'Chrome/120',
    })
    expect(html).toContain('Chrome/120')
  })

  it('should include location when provided', async () => {
    const { getLoginAlertEmail } = await import('@/lib/email-templates')
    const html = getLoginAlertEmail({
      date: '23/02/2026',
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
      location: 'Madrid, Spain',
    })
    expect(html).toContain('Madrid, Spain')
  })

  it('should not include location section when not provided', async () => {
    const { getLoginAlertEmail } = await import('@/lib/email-templates')
    const html = getLoginAlertEmail({
      date: '23/02/2026',
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
    })
    expect(html).not.toContain('Ubicación Aproximada')
  })

  it('should include security warning', async () => {
    const { getLoginAlertEmail } = await import('@/lib/email-templates')
    const html = getLoginAlertEmail({
      date: '23/02/2026',
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
    })
    expect(html).toContain('¿No reconoces esta actividad?')
  })
})

// ── Tests: getTestimonialAlertEmail ───────────────────────────────────────────

describe('getTestimonialAlertEmail', () => {
  it('should include client name', async () => {
    const { getTestimonialAlertEmail } = await import('@/lib/email-templates')
    const html = getTestimonialAlertEmail({ name: 'Carmen', rating: 5, text: 'Excellent!' })
    expect(html).toContain('Carmen')
  })

  it('should include star rating', async () => {
    const { getTestimonialAlertEmail } = await import('@/lib/email-templates')
    const html = getTestimonialAlertEmail({ name: 'Test', rating: 3, text: 'Good service' })
    expect(html).toContain('⭐⭐⭐')
  })

  it('should include testimonial text', async () => {
    const { getTestimonialAlertEmail } = await import('@/lib/email-templates')
    const html = getTestimonialAlertEmail({ name: 'Test', rating: 5, text: 'Amazing work!' })
    expect(html).toContain('Amazing work!')
  })

  it('should include email when provided', async () => {
    const { getTestimonialAlertEmail } = await import('@/lib/email-templates')
    const html = getTestimonialAlertEmail({
      name: 'Test',
      rating: 5,
      text: 'Great',
      email: 'client@test.com',
    })
    expect(html).toContain('client@test.com')
  })

  it('should include moderate button link', async () => {
    const { getTestimonialAlertEmail } = await import('@/lib/email-templates')
    const html = getTestimonialAlertEmail({ name: 'Test', rating: 5, text: 'Great!' })
    expect(html).toContain('Moderar Testimonio')
  })
})

// ── Tests: getBookingAlertEmail ───────────────────────────────────────────────

describe('getBookingAlertEmail', () => {
  it('should include client name', async () => {
    const { getBookingAlertEmail } = await import('@/lib/email-templates')
    const html = getBookingAlertEmail({
      date: new Date('2026-03-15T10:00:00Z'),
      clientName: 'Pedro López',
      clientEmail: 'pedro@test.com',
      serviceId: 'svc-1',
    })
    expect(html).toContain('Pedro López')
  })

  it('should include client email', async () => {
    const { getBookingAlertEmail } = await import('@/lib/email-templates')
    const html = getBookingAlertEmail({
      date: new Date(),
      clientName: 'Test',
      clientEmail: 'booking@test.com',
      serviceId: 'svc-1',
    })
    expect(html).toContain('booking@test.com')
  })

  it('should include phone when provided', async () => {
    const { getBookingAlertEmail } = await import('@/lib/email-templates')
    const html = getBookingAlertEmail({
      date: new Date(),
      clientName: 'Test',
      clientEmail: 'test@test.com',
      clientPhone: '+34600999888',
      serviceId: 'svc-1',
    })
    expect(html).toContain('+34600999888')
  })

  it('should include notes when provided', async () => {
    const { getBookingAlertEmail } = await import('@/lib/email-templates')
    const html = getBookingAlertEmail({
      date: new Date(),
      clientName: 'Test',
      clientEmail: 'test@test.com',
      serviceId: 'svc-1',
      notes: 'Special requirements here',
    })
    expect(html).toContain('Special requirements here')
  })

  it('should not include notes section when not provided', async () => {
    const { getBookingAlertEmail } = await import('@/lib/email-templates')
    const html = getBookingAlertEmail({
      date: new Date(),
      clientName: 'Test',
      clientEmail: 'test@test.com',
      serviceId: 'svc-1',
    })
    expect(html).not.toContain('Notas Adicionales')
  })
})

// ── Tests: getBookingConfirmationEmail ────────────────────────────────────────

describe('getBookingConfirmationEmail', () => {
  it('should include client name greeting', async () => {
    const { getBookingConfirmationEmail } = await import('@/lib/email-templates')
    const html = getBookingConfirmationEmail({
      clientName: 'Lucía',
      date: new Date('2026-04-01T10:00:00Z'),
    })
    expect(html).toContain('Lucía')
  })

  it('should include pending status', async () => {
    const { getBookingConfirmationEmail } = await import('@/lib/email-templates')
    const html = getBookingConfirmationEmail({
      clientName: 'Test',
      date: new Date(),
    })
    expect(html).toContain('Pendiente de Confirmación')
  })

  it('should include thank you message', async () => {
    const { getBookingConfirmationEmail } = await import('@/lib/email-templates')
    const html = getBookingConfirmationEmail({
      clientName: 'Test',
      date: new Date(),
    })
    expect(html).toContain('Gracias por elegirnos')
  })

  it('should return valid HTML', async () => {
    const { getBookingConfirmationEmail } = await import('@/lib/email-templates')
    const html = getBookingConfirmationEmail({
      clientName: 'Test',
      date: new Date(),
    })
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('</html>')
  })

  it('should include portfolio branding', async () => {
    const { getBookingConfirmationEmail } = await import('@/lib/email-templates')
    const html = getBookingConfirmationEmail({
      clientName: 'Test',
      date: new Date(),
    })
    expect(html).toContain('Paola Bolívar Nievas')
  })
})

// ── Tests: EMAIL_STYLES export ────────────────────────────────────────────────

describe('EMAIL_STYLES', () => {
  it('should export EMAIL_STYLES object', async () => {
    const { EMAIL_STYLES } = await import('@/lib/email-templates')
    expect(EMAIL_STYLES).toBeDefined()
    expect(EMAIL_STYLES.fontFamily).toBeDefined()
    expect(EMAIL_STYLES.body).toBeDefined()
  })

  it('should export COLORS object', async () => {
    const { COLORS } = await import('@/lib/email-templates')
    expect(COLORS).toBeDefined()
    expect(COLORS.primary).toBeDefined()
    expect(COLORS.danger).toBeDefined()
  })

  it('should have button function returning string', async () => {
    const { EMAIL_STYLES } = await import('@/lib/email-templates')
    const result = EMAIL_STYLES.button('#ff0000')
    expect(typeof result).toBe('string')
    expect(result).toContain('#ff0000')
  })
})
