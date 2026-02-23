import { describe, it, expect } from 'vitest'
import { RATE_LIMITS } from '@/lib/rate-limit-config'
import type { RateLimitConfig } from '@/lib/rate-limit-config'

describe('rate-limit-config', () => {
  const expectedKeys: (keyof typeof RATE_LIMITS)[] = ['AUTH', 'CONTACT', 'API', 'PASSWORD_RESET']

  it('exports all expected rate limit configs', () => {
    expectedKeys.forEach((key) => {
      expect(RATE_LIMITS[key]).toBeDefined()
    })
  })

  it('each config has required properties', () => {
    Object.values(RATE_LIMITS).forEach((config: RateLimitConfig) => {
      expect(typeof config.id).toBe('string')
      expect(typeof config.limit).toBe('number')
      expect(typeof config.window).toBe('number')
      expect(typeof config.errorMessage).toBe('string')
    })
  })

  it('AUTH limit is 5 with 15 minute window', () => {
    expect(RATE_LIMITS.AUTH.limit).toBe(5)
    expect(RATE_LIMITS.AUTH.window).toBe(15 * 60 * 1000)
  })

  it('API limit is 100 with 1 minute window', () => {
    expect(RATE_LIMITS.API.limit).toBe(100)
    expect(RATE_LIMITS.API.window).toBe(60 * 1000)
  })

  it('all windows are positive millisecond values', () => {
    Object.values(RATE_LIMITS).forEach((config: RateLimitConfig) => {
      expect(config.window).toBeGreaterThan(0)
      expect(config.limit).toBeGreaterThan(0)
    })
  })
})
