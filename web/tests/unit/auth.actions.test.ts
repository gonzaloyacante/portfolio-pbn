import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requestPasswordReset, resetPassword } from '@/actions/user/auth'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    passwordResetToken: { create: vi.fn(), findUnique: vi.fn(), delete: vi.fn() },
  },
}))

// Mock email service
vi.mock('@/lib/email-service', () => ({
  emailService: { sendPasswordReset: vi.fn(() => Promise.resolve({ success: true })) },
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(() => Promise.resolve('hashed_password')),
    compare: vi.fn(() => Promise.resolve(true)),
  },
}))

vi.mock('next/navigation', () => ({ redirect: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('next-auth', () => ({ getServerSession: vi.fn(() => Promise.resolve(null)) }))

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
  })

  describe('requestPasswordReset', () => {
    it('should return ambiguous success when user does not exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const result = await requestPasswordReset('nonexistent@example.com')

      expect(result.success).toBe(true)
      expect(result.message).toContain('enlace de recuperación')
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled()
    })

    it('should reject invalid email format', async () => {
      const result = await requestPasswordReset('not-an-email')
      expect(result.success).toBe(false)
    })
  })

  describe('resetPassword', () => {
    it('should reject expired token', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
        id: 'token-1',
        email: 'test@example.com',
        token: 'expired',
        expiresAt: new Date(Date.now() - 10000),
        createdAt: new Date(),
      })

      const result = await resetPassword('expired', 'newPassword123')

      expect(result.success).toBe(false)
      expect(result.message).toContain('inválido o expirado')
    })

    it('should reject non-existent token', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null)

      const result = await resetPassword('nonexistent', 'newPassword123')
      expect(result.success).toBe(false)
    })

    it('should reject passwords shorter than 6 characters', async () => {
      const result = await resetPassword('token', 'abc')
      expect(result.success).toBe(false)
    })
  })
})
