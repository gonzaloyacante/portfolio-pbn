import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRateLimiter, cleanupRateLimitStore } from '@/lib/rate-limit'

// Mock Prisma (rate-limit logs to DB but logic is in-memory)
vi.mock('@/lib/db', () => ({
  prisma: {
    analyticLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}))

const TEST_CONFIG = {
  id: 'test-limiter',
  limit: 3,
  window: 60_000, // 1 minute
  errorMessage: 'Too many requests',
}

describe('createRateLimiter', () => {
  let limiter: ReturnType<typeof createRateLimiter>

  beforeEach(() => {
    limiter = createRateLimiter(TEST_CONFIG)
  })

  describe('check()', () => {
    it('allows the first request', async () => {
      const result = await limiter.check('ip-fresh-1')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(3)
    })

    it('allows up to the limit without blocking', async () => {
      const identifier = 'ip-fresh-check'
      // Pre-record up to limit-1
      await limiter.record(identifier)
      await limiter.record(identifier)
      const result = await limiter.check(identifier)
      expect(result.allowed).toBe(true)
    })

    it('blocks after limit is reached', async () => {
      const identifier = 'ip-block-test'
      // Record exactly `limit` attempts
      for (let i = 0; i < TEST_CONFIG.limit; i++) {
        await limiter.record(identifier)
      }
      const result = await limiter.check(identifier)
      expect(result.allowed).toBe(false)
      expect(result.resetIn).toBeGreaterThan(0)
    })

    it('returns remaining count', async () => {
      const identifier = 'ip-remaining'
      await limiter.record(identifier)
      const result = await limiter.check(identifier)
      expect(result.remaining).toBe(TEST_CONFIG.limit - 1)
    })

    it('different identifiers are independent', async () => {
      const id1 = 'ip-independent-1'
      const id2 = 'ip-independent-2'

      for (let i = 0; i < TEST_CONFIG.limit; i++) {
        await limiter.record(id1)
      }

      const blocked = await limiter.check(id1)
      const allowed = await limiter.check(id2)

      expect(blocked.allowed).toBe(false)
      expect(allowed.allowed).toBe(true)
    })
  })

  describe('record()', () => {
    it('increments attempt count', async () => {
      const identifier = 'ip-record-test'
      const before = await limiter.check(identifier)
      await limiter.record(identifier)
      const after = await limiter.check(identifier)

      expect(after.remaining ?? 0).toBeLessThan(before.remaining ?? TEST_CONFIG.limit)
    })

    it('accepts optional metadata', async () => {
      await expect(
        limiter.record('ip-meta', { action: 'login', userAgent: 'Test/1.0' })
      ).resolves.not.toThrow()
    })
  })

  describe('clear()', () => {
    it('resets the rate limit for an identifier', async () => {
      const identifier = 'ip-clear-test'

      for (let i = 0; i < TEST_CONFIG.limit; i++) {
        await limiter.record(identifier)
      }

      const blocked = await limiter.check(identifier)
      expect(blocked.allowed).toBe(false)

      await limiter.clear(identifier)

      const cleared = await limiter.check(identifier)
      expect(cleared.allowed).toBe(true)
    })
  })
})

describe('cleanupRateLimitStore', () => {
  it('runs without throwing', () => {
    expect(() => cleanupRateLimitStore()).not.toThrow()
  })
})
