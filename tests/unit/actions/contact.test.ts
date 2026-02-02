import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitContact, getContacts, markAsRead } from '@/actions/contact.actions'
import { db } from '@/lib/db'
import type { Contact } from '@prisma/client'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  db: {
    contact: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

// Mock email service
vi.mock('@/lib/email-service', () => ({
  sendContactNotification: vi.fn(() => Promise.resolve({ success: true })),
}))

// Mock NextAuth
vi.mock('next-auth', () => ({
  auth: vi.fn(() => Promise.resolve({ user: { role: 'ADMIN' } })),
}))

describe('Contact Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitContact', () => {
    it('should submit contact form successfully', async () => {
      const mockContact: Contact = {
        id: 'contact-1',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, I need a quote',
        responsePreference: 'EMAIL',
        phone: null,
        ipAddress: null,
        userAgent: null,
        isRead: false,
        isReplied: false,
        adminNote: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.contact.create).mockResolvedValue(mockContact)

      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('message', 'Hello, I need a quote')
      formData.append('responsePreference', 'EMAIL')

      const result = await submitContact(formData)

      expect(result.success).toBe(true)
      expect(db.contact.create).toHaveBeenCalledOnce()
      expect(db.contact.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello, I need a quote',
          responsePreference: 'EMAIL',
        }),
      })
    })

    it('should validate email format', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'invalid-email')
      formData.append('message', 'Test message')

      const result = await submitContact(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('email')
    })

    it('should require name, email, and message', async () => {
      const formData = new FormData()
      // Empty form

      const result = await submitContact(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should accept optional phone number', async () => {
      const mockContact: Contact = {
        id: 'contact-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+34123456789',
        message: 'Hello',
        responsePreference: 'PHONE',
        ipAddress: null,
        userAgent: null,
        isRead: false,
        isReplied: false,
        adminNote: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.contact.create).mockResolvedValue(mockContact)

      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('phone', '+34123456789')
      formData.append('message', 'Hello')
      formData.append('responsePreference', 'PHONE')

      const result = await submitContact(formData)

      expect(result.success).toBe(true)
      expect(db.contact.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phone: '+34123456789',
        }),
      })
    })
  })

  describe('getContacts', () => {
    it('should return all contacts for admin', async () => {
      const mockContacts: Contact[] = [
        {
          id: '1',
          name: 'John',
          email: 'john@test.com',
          isRead: false,
          phone: null,
          message: 'Test',
          responsePreference: 'EMAIL',
          ipAddress: null,
          userAgent: null,
          isReplied: false,
          adminNote: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Jane',
          email: 'jane@test.com',
          isRead: true,
          phone: null,
          message: 'Test 2',
          responsePreference: 'EMAIL',
          ipAddress: null,
          userAgent: null,
          isReplied: false,
          adminNote: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      vi.mocked(db.contact.findMany).mockResolvedValue(mockContacts)

      const result = await getContacts()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(db.contact.findMany).toHaveBeenCalledOnce()
    })
  })

  describe('markAsRead', () => {
    it('should mark contact as read', async () => {
      const mockContact: Contact = {
        id: 'contact-1',
        isRead: true,
        name: 'John',
        email: 'john@test.com',
        phone: null,
        message: 'Test',
        responsePreference: 'EMAIL',
        ipAddress: null,
        userAgent: null,
        isReplied: false,
        adminNote: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.contact.update).mockResolvedValue(mockContact)

      const result = await markAsRead('contact-1')

      expect(result.success).toBe(true)
      expect(db.contact.update).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
        data: { isRead: true },
      })
    })
  })
})
