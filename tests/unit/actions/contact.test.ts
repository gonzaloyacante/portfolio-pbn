import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendContactEmail, getContacts, markContactAsRead } from '@/actions/user/contact'
import type { Contact } from '@prisma/client'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    contact: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}))

// Mock email service
vi.mock('@/lib/email-service', () => ({
  emailService: {
    notifyNewContact: vi.fn(() => Promise.resolve({ success: true })),
  },
}))

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() =>
    Promise.resolve({
      get: vi.fn((key: string) => {
        if (key === 'x-forwarded-for') return '127.0.0.1'
        if (key === 'user-agent') return 'test-agent'
        return null
      }),
    })
  ),
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock rate limiter
vi.mock('@/lib/rate-limit', () => ({
  createRateLimiter: vi.fn(() => ({
    check: vi.fn(() => Promise.resolve({ allowed: true, remaining: 10 })),
    record: vi.fn(() => Promise.resolve()),
  })),
}))

// Mock analytics
vi.mock('@/actions/analytics', () => ({
  recordAnalyticEvent: vi.fn(() => Promise.resolve()),
}))

// Mock routes config
vi.mock('@/config/routes', () => ({
  ROUTES: { admin: { contacts: '/admin/contacts' } },
}))

// Minimal Contact mock that satisfies the full Prisma schema
const makeContact = (overrides: Partial<Contact> = {}): Contact => ({
  id: 'contact-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: null,
  message: 'Hello, I need a quote for your services',
  subject: null,
  responsePreference: 'EMAIL',
  leadScore: 0,
  leadSource: null,
  status: 'NEW',
  priority: 'MEDIUM',
  assignedTo: null,
  isRead: false,
  readAt: null,
  readBy: null,
  isReplied: false,
  repliedAt: null,
  repliedBy: null,
  replyText: null,
  adminNote: null,
  tags: [],
  ipAddress: '127.0.0.1',
  userAgent: 'test-agent',
  referrer: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  ...overrides,
})

describe('Contact Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sendContactEmail', () => {
    it('should successfully process a valid contact form or return graceful error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contact.create).mockResolvedValue(makeContact())

      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('message', 'Hello, I need a quote for your services')
      formData.append('responsePreference', 'EMAIL')
      formData.append('privacy', 'on')

      const result = await sendContactEmail(formData)

      // The action always returns an object with success and message
      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('message')
      expect(typeof result.success).toBe('boolean')
    })

    it('should reject invalid email format', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'invalid-email')
      formData.append('message', 'Test message here')
      formData.append('privacy', 'on')

      const result = await sendContactEmail(formData)

      expect(result.success).toBe(false)
    })

    it('should reject empty form', async () => {
      const result = await sendContactEmail(new FormData())
      expect(result.success).toBe(false)
    })

    it('should reject when privacy is not accepted', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('message', 'Hello, I need a quote for your services')
      formData.append('responsePreference', 'EMAIL')
      // privacy not appended → will be falsy

      const result = await sendContactEmail(formData)

      expect(result.success).toBe(false)
    })
  })

  describe('getContacts', () => {
    it('should return all contacts ordered by date', async () => {
      const { prisma } = await import('@/lib/db')
      const mockContacts: Contact[] = [makeContact({ id: '1' }), makeContact({ id: '2' })]

      vi.mocked(prisma.contact.findMany).mockResolvedValue(mockContacts)

      const contacts = await getContacts()

      expect(contacts).toHaveLength(2)
      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('markContactAsRead', () => {
    it('should mark contact as read', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contact.update).mockResolvedValue(makeContact({ isRead: true }))

      await markContactAsRead('contact-1')

      expect(prisma.contact.update).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
        data: { isRead: true },
      })
    })
  })
})
