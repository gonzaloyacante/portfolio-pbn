import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCheck, mockRecord, mockClear } = vi.hoisted(() => ({
  mockCheck: vi.fn().mockResolvedValue({ allowed: true, remaining: 50, resetIn: 60 }),
  mockRecord: vi.fn().mockResolvedValue(undefined),
  mockClear: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  createRateLimiter: vi.fn().mockReturnValue({
    check: mockCheck,
    record: mockRecord,
    clear: mockClear,
  }),
}))
vi.mock('@/lib/rate-limit-config', () => ({
  RATE_LIMITS: {
    API: { id: 'api', limit: 100, window: 60000, errorMessage: 'Too many API requests' },
    SETTINGS: { id: 'settings', limit: 10, window: 60000, errorMessage: 'Too many settings' },
  },
}))

const { mockHeadersMap } = vi.hoisted(() => ({
  mockHeadersMap: new Map<string, string>([['x-forwarded-for', '1.2.3.4']]),
}))
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(mockHeadersMap),
}))
vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

import { checkApiRateLimit, checkSettingsRateLimit, getClientIp } from '@/lib/rate-limit-guards'

describe('rate-limit-guards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCheck.mockResolvedValue({ allowed: true, remaining: 50, resetIn: 60 })
    mockHeadersMap.clear()
    mockHeadersMap.set('x-forwarded-for', '1.2.3.4')
  })

  describe('getClientIp', () => {
    it('extracts from x-forwarded-for', async () => {
      const ip = await getClientIp()
      expect(ip).toBe('1.2.3.4')
    })

    it('returns first IP from comma-separated list', async () => {
      mockHeadersMap.set('x-forwarded-for', '10.0.0.1, 10.0.0.2, 10.0.0.3')
      const ip = await getClientIp()
      expect(ip).toBe('10.0.0.1')
    })

    it('handles missing x-forwarded-for', async () => {
      mockHeadersMap.delete('x-forwarded-for')
      const ip = await getClientIp()
      expect(ip).toBe('unknown-ip')
    })

    it('trims whitespace', async () => {
      mockHeadersMap.set('x-forwarded-for', '  192.168.1.1  , 10.0.0.1')
      const ip = await getClientIp()
      expect(ip).toBe('192.168.1.1')
    })
  })

  describe('checkApiRateLimit', () => {
    it('does not throw when allowed', async () => {
      await expect(checkApiRateLimit('1.2.3.4')).resolves.toBeUndefined()
    })

    it('throws when rate limited', async () => {
      mockCheck.mockResolvedValueOnce({ allowed: false, remaining: 0, resetIn: 30 })
      await expect(checkApiRateLimit('1.2.3.4')).rejects.toThrow('Demasiadas solicitudes')
    })

    it('includes reset time in error message', async () => {
      mockCheck.mockResolvedValueOnce({ allowed: false, remaining: 0, resetIn: 45 })
      await expect(checkApiRateLimit('1.2.3.4')).rejects.toThrow('45s')
    })
  })

  describe('checkSettingsRateLimit', () => {
    it('does not throw when allowed', async () => {
      await expect(checkSettingsRateLimit('user-1')).resolves.toBeUndefined()
    })

    it('throws when rate limited', async () => {
      mockCheck.mockResolvedValueOnce({ allowed: false, remaining: 0, resetIn: 30 })
      await expect(checkSettingsRateLimit('user-1')).rejects.toThrow(
        'Demasiadas actualizaciones de configuración'
      )
    })
  })

  describe('error handling', () => {
    it('rate limit error includes reset info', async () => {
      mockCheck.mockResolvedValueOnce({ allowed: false, remaining: 0, resetIn: 120 })
      await expect(checkApiRateLimit('1.2.3.4')).rejects.toThrow('Reset en 120s')
    })

    it('handles exceptions from limiter gracefully', async () => {
      mockCheck.mockRejectedValueOnce(new Error('Limiter failure'))
      await expect(checkApiRateLimit('1.2.3.4')).rejects.toThrow('Limiter failure')
    })
  })
})
