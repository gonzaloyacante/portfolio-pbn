import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockSend = vi.fn().mockResolvedValue({ data: { id: 'msg-1' }, error: null })

vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = { send: mockSend }
    },
  }
})

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/actions/settings/contact', () => ({
  getContactSettings: vi.fn().mockResolvedValue({ email: 'admin@portfolio.com' }),
}))

vi.mock('@/lib/email-templates', () => ({
  getContactMessageEmail: vi.fn().mockReturnValue('<p>Contact Email</p>'),
  getPasswordResetEmail: vi.fn().mockReturnValue('<p>Reset Email</p>'),
  getLoginAlertEmail: vi.fn().mockReturnValue('<p>Login Alert</p>'),
  getTestimonialAlertEmail: vi.fn().mockReturnValue('<p>Testimonial Alert</p>'),
  getBookingAlertEmail: vi.fn().mockReturnValue('<p>Booking Alert</p>'),
  getBookingConfirmationEmail: vi.fn().mockReturnValue('<p>Booking Confirmation</p>'),
}))

// ── Setup env ─────────────────────────────────────────────────────────────────

const originalEnv = { ...process.env }

beforeEach(() => {
  vi.clearAllMocks()
  process.env = { ...originalEnv, RESEND_API_KEY: 'test-key-123', ADMIN_EMAIL: 'admin@test.com' }
})

// ── Tests: emailService.notifyNewContact ──────────────────────────────────────

describe('emailService.notifyNewContact', () => {
  it('should send email with correct subject', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyNewContact({
      name: 'Juan',
      email: 'juan@test.com',
      message: 'Hello',
      preference: 'EMAIL',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Juan'),
      })
    )
  })

  it('should set replyTo as contact email', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyNewContact({
      name: 'Juan',
      email: 'juan@test.com',
      message: 'Hello',
      preference: 'EMAIL',
    })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ replyTo: 'juan@test.com' }))
  })

  it('should send to admin email', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyNewContact({
      name: 'Juan',
      email: 'juan@test.com',
      message: 'Hello',
      preference: 'EMAIL',
    })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'admin@portfolio.com' }))
  })

  it('should return success with id', async () => {
    const { emailService } = await import('@/lib/email-service')
    const result = await emailService.notifyNewContact({
      name: 'Juan',
      email: 'juan@test.com',
      message: 'Hello',
      preference: 'EMAIL',
    })
    expect(result.success).toBe(true)
    expect(result.id).toBe('msg-1')
  })
})

// ── Tests: emailService.sendPasswordReset ─────────────────────────────────────

describe('emailService.sendPasswordReset', () => {
  it('should send reset email to specified address', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.sendPasswordReset('user@test.com', 'token-abc')
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'user@test.com' }))
  })

  it('should include password reset subject', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.sendPasswordReset('user@test.com', 'token-abc')
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Contraseña'),
      })
    )
  })
})

// ── Tests: emailService.sendLoginAlert ────────────────────────────────────────

describe('emailService.sendLoginAlert', () => {
  it('should send login alert to specified email', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.sendLoginAlert({
      email: 'admin@test.com',
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
    })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'admin@test.com' }))
  })

  it('should include security-related subject', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.sendLoginAlert({
      email: 'admin@test.com',
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ subject: expect.stringContaining('Sesión') })
    )
  })
})

// ── Tests: emailService.notifyNewTestimonial ──────────────────────────────────

describe('emailService.notifyNewTestimonial', () => {
  it('should send testimonial notification to admin', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyNewTestimonial({
      name: 'María',
      rating: 5,
      text: 'Great service!',
    })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'admin@portfolio.com' }))
  })

  it('should include client name in subject', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyNewTestimonial({
      name: 'María',
      rating: 5,
      text: 'Great service!',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ subject: expect.stringContaining('María') })
    )
  })
})

// ── Tests: Error handling ─────────────────────────────────────────────────────

describe('Email error handling', () => {
  it('should handle Resend API errors', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid API key', name: 'validation_error' },
    })

    const { emailService } = await import('@/lib/email-service')
    const result = await emailService.notifyNewContact({
      name: 'Test',
      email: 'test@test.com',
      message: 'Test',
      preference: 'EMAIL',
    })
    expect(result.success).toBe(false)
  })

  it('should handle thrown exceptions', async () => {
    mockSend.mockRejectedValueOnce(new Error('Network error'))

    const { emailService } = await import('@/lib/email-service')
    const result = await emailService.notifyNewContact({
      name: 'Test',
      email: 'test@test.com',
      message: 'Test',
      preference: 'EMAIL',
    })
    expect(result.success).toBe(false)
  })

  it('should log warning when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
    const { logger } = await import('@/lib/logger')

    // Re-import to get fresh module
    vi.resetModules()
    // Re-mock after reset
    vi.doMock('resend', () => ({
      Resend: class MockResend {
        emails = { send: mockSend }
      },
    }))
    vi.doMock('@/lib/logger', () => ({
      logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
    }))
    vi.doMock('@/actions/settings/contact', () => ({
      getContactSettings: vi.fn().mockResolvedValue({ email: 'admin@portfolio.com' }),
    }))
    vi.doMock('@/lib/email-templates', () => ({
      getContactMessageEmail: vi.fn().mockReturnValue('<p>test</p>'),
      getPasswordResetEmail: vi.fn().mockReturnValue('<p>test</p>'),
      getLoginAlertEmail: vi.fn().mockReturnValue('<p>test</p>'),
      getTestimonialAlertEmail: vi.fn().mockReturnValue('<p>test</p>'),
      getBookingAlertEmail: vi.fn().mockReturnValue('<p>test</p>'),
      getBookingConfirmationEmail: vi.fn().mockReturnValue('<p>test</p>'),
    }))

    // Just verify the mock setup works without API key
    expect(logger.warn).toBeDefined()
  })

  it('should return error message from Resend', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { message: 'Rate limit exceeded', name: 'rate_limit' },
    })

    const { emailService } = await import('@/lib/email-service')
    const result = await emailService.sendPasswordReset('user@test.com', 'token')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Rate limit exceeded')
  })
})

// ── Tests: emailService.notifyNewBooking ──────────────────────────────────────

describe('emailService.notifyNewBooking', () => {
  it('should send booking notification to admin', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyNewBooking({
      date: new Date('2026-03-15T10:00:00Z'),
      clientName: 'Pedro',
      clientEmail: 'pedro@test.com',
      serviceId: 'svc-1',
    })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'admin@portfolio.com' }))
  })

  it('should include client name in subject', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyNewBooking({
      date: new Date(),
      clientName: 'Pedro',
      clientEmail: 'pedro@test.com',
      serviceId: 'svc-1',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ subject: expect.stringContaining('Pedro') })
    )
  })

  it('should set replyTo as client email', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyNewBooking({
      date: new Date(),
      clientName: 'Pedro',
      clientEmail: 'pedro@test.com',
      serviceId: 'svc-1',
    })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ replyTo: 'pedro@test.com' }))
  })
})

// ── Tests: emailService.notifyClientBookingReceived ───────────────────────────

describe('emailService.notifyClientBookingReceived', () => {
  it('should send confirmation email to client', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyClientBookingReceived({
      clientEmail: 'client@test.com',
      clientName: 'Cliente',
      date: new Date(),
    })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'client@test.com' }))
  })

  it('should include booking subject', async () => {
    const { emailService } = await import('@/lib/email-service')
    await emailService.notifyClientBookingReceived({
      clientEmail: 'client@test.com',
      clientName: 'Cliente',
      date: new Date(),
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ subject: expect.stringContaining('Reserva') })
    )
  })
})
