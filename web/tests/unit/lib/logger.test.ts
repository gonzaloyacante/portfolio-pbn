import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger, safeCtx, getRequestId } from '@/lib/logger'

describe('Logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => undefined)
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  // ──────────────────────────────────────
  // Core log methods — output format
  // ──────────────────────────────────────
  describe('logger.info', () => {
    it('should call console.info with JSON string', () => {
      logger.info('test message')
      expect(console.info).toHaveBeenCalledTimes(1)
      const arg = vi.mocked(console.info).mock.calls[0][0] as string
      expect(() => JSON.parse(arg)).not.toThrow()
    })

    it('should include level field as "info"', () => {
      logger.info('test message')
      const arg = vi.mocked(console.info).mock.calls[0][0] as string
      const parsed = JSON.parse(arg) as { level: string }
      expect(parsed.level).toBe('info')
    })

    it('should include msg field', () => {
      logger.info('my log message')
      const arg = vi.mocked(console.info).mock.calls[0][0] as string
      const parsed = JSON.parse(arg) as { msg: string }
      expect(parsed.msg).toBe('my log message')
    })

    it('should include ts (timestamp) field', () => {
      logger.info('timestamped')
      const arg = vi.mocked(console.info).mock.calls[0][0] as string
      const parsed = JSON.parse(arg) as { ts: string }
      expect(parsed.ts).toBeDefined()
      expect(new Date(parsed.ts).getTime()).not.toBeNaN()
    })

    it('should include context fields in output', () => {
      logger.info('with context', { userId: '42', action: 'login' })
      const arg = vi.mocked(console.info).mock.calls[0][0] as string
      const parsed = JSON.parse(arg) as Record<string, unknown>
      expect(parsed.userId).toBe('42')
      expect(parsed.action).toBe('login')
    })
  })

  describe('logger.debug', () => {
    it('should call console.debug', () => {
      logger.debug('debug message')
      expect(console.debug).toHaveBeenCalledTimes(1)
    })

    it('should emit level "debug"', () => {
      logger.debug('debug test')
      const arg = vi.mocked(console.debug).mock.calls[0][0] as string
      const parsed = JSON.parse(arg) as { level: string }
      expect(parsed.level).toBe('debug')
    })
  })

  describe('logger.warn', () => {
    it('should call console.warn', () => {
      logger.warn('warn message')
      expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('should emit level "warn"', () => {
      logger.warn('warn test')
      const arg = vi.mocked(console.warn).mock.calls[0][0] as string
      const parsed = JSON.parse(arg) as { level: string }
      expect(parsed.level).toBe('warn')
    })
  })

  describe('logger.error', () => {
    it('should call console.error', () => {
      logger.error('error message')
      expect(console.error).toHaveBeenCalledTimes(1)
    })

    it('should emit level "error"', () => {
      logger.error('error test')
      const arg = vi.mocked(console.error).mock.calls[0][0] as string
      const parsed = JSON.parse(arg) as { level: string }
      expect(parsed.level).toBe('error')
    })

    it('should work without context', () => {
      expect(() => logger.error('no ctx')).not.toThrow()
    })
  })

  // ──────────────────────────────────────
  // safeCtx — PII masking
  // ──────────────────────────────────────
  describe('safeCtx', () => {
    it('should return undefined when ctx is undefined', () => {
      expect(safeCtx(undefined)).toBeUndefined()
    })

    it('should redact email field', () => {
      const result = safeCtx({ email: 'user@example.com' }) as Record<string, unknown>
      expect(result.email).toBe('***redacted***')
    })

    it('should redact password field', () => {
      const result = safeCtx({ password: 'supersecret' }) as Record<string, unknown>
      expect(result.password).toBe('***redacted***')
    })

    it('should redact token field', () => {
      const result = safeCtx({ token: 'jwt-token-value' }) as Record<string, unknown>
      expect(result.token).toBe('***redacted***')
    })

    it('should redact secret field', () => {
      const result = safeCtx({ secret: 'my-api-secret' }) as Record<string, unknown>
      expect(result.secret).toBe('***redacted***')
    })

    it('should redact phone field', () => {
      const result = safeCtx({ phone: '+34 612 345 678' }) as Record<string, unknown>
      expect(result.phone).toBe('***redacted***')
    })

    it('should preserve non-sensitive fields', () => {
      const result = safeCtx({ userId: '123', action: 'view' }) as Record<string, unknown>
      expect(result.userId).toBe('123')
      expect(result.action).toBe('view')
    })

    it('should mask email addresses inside string values', () => {
      const result = safeCtx({ message: 'Sent to john@doe.com today' }) as Record<string, unknown>
      expect(result.message as string).not.toContain('john@doe.com')
      expect(result.message as string).toContain('***')
    })

    it('should serialize Error objects to plain object', () => {
      const err = new Error('Something went wrong')
      const result = safeCtx({ error: err }) as Record<string, unknown>
      const errorResult = result.error as Record<string, unknown>
      expect(errorResult).toHaveProperty('name', 'Error')
      expect(errorResult).toHaveProperty('message', 'Something went wrong')
    })

    it('should handle nested objects with sensitive keys', () => {
      const result = safeCtx({
        user: { email: 'test@test.com', name: 'Paola' },
      }) as Record<string, unknown>
      const user = result.user as Record<string, unknown>
      expect(user.email).toBe('***redacted***')
      expect(user.name).toBe('Paola')
    })

    it('should handle arrays in context', () => {
      const result = safeCtx({
        ids: ['1', '2', '3'],
      }) as Record<string, unknown>
      expect(Array.isArray(result.ids)).toBe(true)
      expect(result.ids).toEqual(['1', '2', '3'])
    })

    it('should handle circular references gracefully', () => {
      const obj: Record<string, unknown> = { name: 'circular' }
      obj.self = obj
      expect(() => safeCtx(obj)).not.toThrow()
    })

    it('should return fallback on unexpected error', () => {
      // Pass non-object disguised as LogContext
      const result = safeCtx(null as unknown as undefined)
      expect(result).toBeDefined()
    })

    it('should mask phone numbers in text strings', () => {
      const result = safeCtx({ info: 'Call me at +34612345678 please' }) as Record<string, unknown>
      expect(result.info as string).not.toContain('+34612345678')
    })
  })

  // ──────────────────────────────────────
  // getRequestId
  // ──────────────────────────────────────
  describe('getRequestId', () => {
    it('should return x-request-id header if present', () => {
      const headers = new Headers({ 'x-request-id': 'req-abc-123' })
      expect(getRequestId(headers)).toBe('req-abc-123')
    })

    it('should return x-correlation-id if x-request-id absent', () => {
      const headers = new Headers({ 'x-correlation-id': 'corr-xyz' })
      expect(getRequestId(headers)).toBe('corr-xyz')
    })

    it('should prefer x-request-id over x-correlation-id', () => {
      const headers = new Headers({
        'x-request-id': 'req-preferred',
        'x-correlation-id': 'corr-fallback',
      })
      expect(getRequestId(headers)).toBe('req-preferred')
    })

    it('should generate a fallback id when no header present', () => {
      const headers = new Headers()
      const id = getRequestId(headers)
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('should generate unique ids on each call', () => {
      const headers = new Headers()
      const id1 = getRequestId(headers)
      const id2 = getRequestId(headers)
      // UUIDs or timestamps should differ
      expect(id1).not.toBe(id2)
    })
  })
})
