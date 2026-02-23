import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: { analyticLog: { create: vi.fn().mockResolvedValue({}) } },
}))
vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

import {
  checkAuthRateLimit,
  recordFailedLoginAttempt,
  clearLoginAttempts,
  cleanupOldAttempts,
} from '@/lib/auth-rate-limit'
import { prisma } from '@/lib/db'

describe('auth-rate-limit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Clear any leftover state between tests by clearing attempts for known keys
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('checkAuthRateLimit', () => {
    it('allows first login attempt', async () => {
      const result = await checkAuthRateLimit('fresh@test.com', '10.0.0.1')
      expect(result.allowed).toBe(true)
    })

    it('returns 5 remaining attempts initially', async () => {
      const result = await checkAuthRateLimit('remaining@test.com', '10.0.0.2')
      expect(result.remainingAttempts).toBe(5)
    })

    it('decreases remaining after each recorded attempt', async () => {
      const email = 'dec@test.com'
      const ip = '10.0.0.3'
      await recordFailedLoginAttempt(email, ip)
      await recordFailedLoginAttempt(email, ip)

      const result = await checkAuthRateLimit(email, ip)
      expect(result.allowed).toBe(true)
      expect(result.remainingAttempts).toBe(3)
    })

    it('blocks after 5 failed attempts', async () => {
      const email = 'blocked@test.com'
      const ip = '10.0.0.4'

      for (let i = 0; i < 5; i++) {
        await recordFailedLoginAttempt(email, ip)
      }

      const result = await checkAuthRateLimit(email, ip)
      expect(result.allowed).toBe(false)
    })

    it('returns lockout minutes when blocked', async () => {
      const email = 'lockout@test.com'
      const ip = '10.0.0.5'

      for (let i = 0; i < 5; i++) {
        await recordFailedLoginAttempt(email, ip)
      }

      const result = await checkAuthRateLimit(email, ip)
      expect(result.allowed).toBe(false)
      expect(result.lockoutMinutes).toBeDefined()
      expect(result.lockoutMinutes).toBeGreaterThan(0)
    })

    it('calculates correct lockout minutes remaining', async () => {
      const email = 'calclock@test.com'
      const ip = '10.0.0.12'

      for (let i = 0; i < 5; i++) {
        await recordFailedLoginAttempt(email, ip)
      }

      const result = await checkAuthRateLimit(email, ip)
      expect(result.allowed).toBe(false)
      expect(result.lockoutMinutes).toBeLessThanOrEqual(15)
    })

    it('returns allowed=true after lockout expires', async () => {
      const email = 'expire@test.com'
      const ip = '10.0.0.10'

      for (let i = 0; i < 5; i++) {
        await recordFailedLoginAttempt(email, ip)
      }

      // Advance past lockout duration (15 minutes + 1 second)
      vi.advanceTimersByTime(15 * 60 * 1000 + 1000)

      const result = await checkAuthRateLimit(email, ip)
      expect(result.allowed).toBe(true)
    })

    it('treats different email+IP combos independently', async () => {
      const email1 = 'user1@test.com'
      const email2 = 'user2@test.com'
      const ip = '10.0.0.6'

      for (let i = 0; i < 5; i++) {
        await recordFailedLoginAttempt(email1, ip)
      }

      const blockedResult = await checkAuthRateLimit(email1, ip)
      expect(blockedResult.allowed).toBe(false)

      const allowedResult = await checkAuthRateLimit(email2, ip)
      expect(allowedResult.allowed).toBe(true)
    })

    it('handles empty map cases', async () => {
      const result = await checkAuthRateLimit('noexist@test.com', '10.0.0.99')
      expect(result.allowed).toBe(true)
      expect(result.remainingAttempts).toBe(5)
    })
  })

  describe('recordFailedLoginAttempt', () => {
    it('records attempt in DB analytics', async () => {
      await recordFailedLoginAttempt('dblog@test.com', '10.0.0.7')

      expect(prisma.analyticLog.create).toHaveBeenCalledWith({
        data: {
          eventType: 'FAILED_LOGIN_ATTEMPT',
          ipAddress: '10.0.0.7',
          entityType: 'user',
          entityId: 'dblog@test.com',
        },
      })
    })

    it('handles DB error gracefully', async () => {
      vi.mocked(prisma.analyticLog.create).mockRejectedValueOnce(new Error('DB down'))

      // Should not throw even if DB fails
      await expect(recordFailedLoginAttempt('dberr@test.com', '10.0.0.8')).resolves.toBeUndefined()
    })
  })

  describe('clearLoginAttempts', () => {
    it('clears attempts successfully', async () => {
      const email = 'clear@test.com'
      const ip = '10.0.0.9'

      await recordFailedLoginAttempt(email, ip)
      await clearLoginAttempts(email, ip)

      const result = await checkAuthRateLimit(email, ip)
      expect(result.allowed).toBe(true)
      expect(result.remainingAttempts).toBe(5)
    })
  })

  describe('cleanupOldAttempts', () => {
    it('removes old entries', async () => {
      const email = 'old@test.com'
      const ip = '10.0.0.11'

      await recordFailedLoginAttempt(email, ip)

      // Advance past lockout duration
      vi.advanceTimersByTime(15 * 60 * 1000 + 1000)

      cleanupOldAttempts()

      const result = await checkAuthRateLimit(email, ip)
      expect(result.allowed).toBe(true)
      expect(result.remainingAttempts).toBe(5)
    })

    it('keeps recent entries', async () => {
      const email = 'recent@test.com'
      const ip = '10.0.0.13'

      await recordFailedLoginAttempt(email, ip)
      await recordFailedLoginAttempt(email, ip)

      // Only advance a little (well within lockout window)
      vi.advanceTimersByTime(60 * 1000)

      cleanupOldAttempts()

      const result = await checkAuthRateLimit(email, ip)
      expect(result.allowed).toBe(true)
      expect(result.remainingAttempts).toBe(3)
    })
  })
})
