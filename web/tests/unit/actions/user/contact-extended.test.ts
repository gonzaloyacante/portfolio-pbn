import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    contact: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/email-service', () => ({
  emailService: {
    notifyNewContact: vi.fn().mockResolvedValue({ success: true }),
  },
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/rate-limit', () => ({
  createRateLimiter: vi.fn().mockReturnValue({
    check: vi.fn().mockResolvedValue({ allowed: true }),
    record: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/lib/rate-limit-config', () => ({
  RATE_LIMITS: {
    CONTACT: { maxAttempts: 5, windowMs: 900000, errorMessage: 'Rate limit exceeded' },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn((name: string) => {
      const map: Record<string, string> = {
        'x-forwarded-for': '192.168.1.100',
        'user-agent': 'Mozilla/5.0 Test',
        referer: 'https://test.com',
      }
      return map[name] || null
    }),
  }),
}))

vi.mock('@/actions/analytics', () => ({
  recordAnalyticEvent: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('@/lib/validations', () => ({
  contactFormSchema: {
    parse: vi.fn().mockImplementation((data: Record<string, unknown>) => {
      if (!data.name || !data.email || !data.message) {
        const { z } = require('zod')
        throw new z.ZodError([{ path: ['name'], message: 'Required', code: 'custom' }])
      }
      return data
    }),
  },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeContactFormData(fields?: Partial<Record<string, string>>): FormData {
  const fd = new FormData()
  fd.set('name', fields?.name ?? 'Test User')
  fd.set('email', fields?.email ?? 'test@example.com')
  fd.set('phone', fields?.phone ?? '+34600123456')
  fd.set('message', fields?.message ?? 'This is a test message')
  fd.set('responsePreference', fields?.responsePreference ?? 'EMAIL')
  fd.set('privacy', fields?.privacy ?? 'on')
  return fd
}

// ── Tests: sendContactEmail ───────────────────────────────────────────────────

describe('sendContactEmail', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return success for valid submission', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.create).mockResolvedValue({ id: 'contact-1' } as never)

    const { sendContactEmail } = await import('@/actions/user/contact')
    const result = await sendContactEmail(makeContactFormData())
    expect(result.success).toBe(true)
  })

  it('should save contact to database', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.create).mockResolvedValue({ id: 'contact-1' } as never)

    const { sendContactEmail } = await import('@/actions/user/contact')
    await sendContactEmail(makeContactFormData())
    expect(prisma.contact.create).toHaveBeenCalled()
  })

  it('should send email notification', async () => {
    const { prisma } = await import('@/lib/db')
    const { emailService } = await import('@/lib/email-service')
    vi.mocked(prisma.contact.create).mockResolvedValue({ id: 'contact-1' } as never)

    const { sendContactEmail } = await import('@/actions/user/contact')
    await sendContactEmail(makeContactFormData())
    expect(emailService.notifyNewContact).toHaveBeenCalled()
  })

  it('should record analytics event', async () => {
    const { prisma } = await import('@/lib/db')
    const { recordAnalyticEvent } = await import('@/actions/analytics')
    vi.mocked(prisma.contact.create).mockResolvedValue({ id: 'contact-1' } as never)

    const { sendContactEmail } = await import('@/actions/user/contact')
    await sendContactEmail(makeContactFormData())
    expect(recordAnalyticEvent).toHaveBeenCalledWith(
      'CONTACT_SUBMIT',
      'contact-1',
      'Contact',
      expect.any(Object)
    )
  })

  it('should return error on database failure', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.create).mockRejectedValue(new Error('DB error'))

    const { sendContactEmail } = await import('@/actions/user/contact')
    const result = await sendContactEmail(makeContactFormData())
    expect(result.success).toBe(false)
  })

  it('should handle email notification failure gracefully', async () => {
    const { prisma } = await import('@/lib/db')
    const { emailService } = await import('@/lib/email-service')
    vi.mocked(prisma.contact.create).mockResolvedValue({ id: 'contact-1' } as never)
    vi.mocked(emailService.notifyNewContact).mockRejectedValue(new Error('Email fail'))

    const { sendContactEmail } = await import('@/actions/user/contact')
    // Should not throw even if email fails
    const result = await sendContactEmail(makeContactFormData())
    expect(result.success).toBe(true)
  })

  it('should return success message in response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.create).mockResolvedValue({ id: 'contact-1' } as never)

    const { sendContactEmail } = await import('@/actions/user/contact')
    const result = await sendContactEmail(makeContactFormData())
    expect(result.message).toBeDefined()
  })
})

// ── Tests: getContacts ────────────────────────────────────────────────────────

describe('getContacts', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should require admin', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValue([])

    const { getContacts } = await import('@/actions/user/contact')
    await getContacts()
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should return contacts ordered by date desc', async () => {
    const { prisma } = await import('@/lib/db')
    const contacts = [{ id: 'c-1' }, { id: 'c-2' }]
    vi.mocked(prisma.contact.findMany).mockResolvedValue(contacts as never)

    const { getContacts } = await import('@/actions/user/contact')
    const result = await getContacts()
    expect(result).toEqual(contacts)
    expect(prisma.contact.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    })
  })

  it('should check rate limit', async () => {
    const { checkApiRateLimit } = await import('@/lib/rate-limit-guards')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValue([])

    const { getContacts } = await import('@/actions/user/contact')
    await getContacts()
    expect(checkApiRateLimit).toHaveBeenCalled()
  })
})

// ── Tests: getUnreadContactsCount ─────────────────────────────────────────────

describe('getUnreadContactsCount', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return count of unread contacts', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.count).mockResolvedValue(5)

    const { getUnreadContactsCount } = await import('@/actions/user/contact')
    const count = await getUnreadContactsCount()
    expect(count).toBe(5)
    expect(prisma.contact.count).toHaveBeenCalledWith({ where: { isRead: false } })
  })
})

// ── Tests: markContactAsRead ──────────────────────────────────────────────────

describe('markContactAsRead', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should update contact isRead to true', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.update).mockResolvedValue({} as never)

    const { markContactAsRead } = await import('@/actions/user/contact')
    await markContactAsRead('c-1')
    expect(prisma.contact.update).toHaveBeenCalledWith({
      where: { id: 'c-1' },
      data: { isRead: true },
    })
  })

  it('should revalidate contacts path', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.update).mockResolvedValue({} as never)

    const { markContactAsRead } = await import('@/actions/user/contact')
    await markContactAsRead('c-1')
    expect(revalidatePath).toHaveBeenCalled()
  })
})

// ── Tests: markContactAsReplied ───────────────────────────────────────────────

describe('markContactAsReplied', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should update contact as replied and read', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.update).mockResolvedValue({} as never)

    const { markContactAsReplied } = await import('@/actions/user/contact')
    await markContactAsReplied('c-1', 'Admin note here')
    expect(prisma.contact.update).toHaveBeenCalledWith({
      where: { id: 'c-1' },
      data: { isReplied: true, isRead: true, adminNote: 'Admin note here' },
    })
  })

  it('should handle missing admin note', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.update).mockResolvedValue({} as never)

    const { markContactAsReplied } = await import('@/actions/user/contact')
    await markContactAsReplied('c-1')
    expect(prisma.contact.update).toHaveBeenCalledWith({
      where: { id: 'c-1' },
      data: { isReplied: true, isRead: true, adminNote: undefined },
    })
  })
})

// ── Tests: deleteContact ──────────────────────────────────────────────────────

describe('deleteContact', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should delete contact by id', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.delete).mockResolvedValue({} as never)

    const { deleteContact } = await import('@/actions/user/contact')
    await deleteContact('c-1')
    expect(prisma.contact.delete).toHaveBeenCalledWith({ where: { id: 'c-1' } })
  })

  it('should revalidate path after deletion', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.delete).mockResolvedValue({} as never)

    const { deleteContact } = await import('@/actions/user/contact')
    await deleteContact('c-1')
    expect(revalidatePath).toHaveBeenCalled()
  })
})
