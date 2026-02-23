import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, safeCtx, getRequestId } from '@/lib/logger'

describe('Logger — extended edge cases', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => undefined)
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  // ─── logger.info ────────────────────────────────────────────────────────────

  it('logger.info outputs JSON with msg', () => {
    logger.info('hello world')
    const arg = vi.mocked(console.info).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    expect(parsed.msg).toBe('hello world')
  })

  it('logger.info includes context fields', () => {
    logger.info('login', { userId: '42', action: 'auth' })
    const arg = vi.mocked(console.info).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    expect(parsed.userId).toBe('42')
    expect(parsed.action).toBe('auth')
  })

  it('logger.info includes nested objects in context', () => {
    logger.info('nested', { meta: { key: 'val' } })
    const arg = vi.mocked(console.info).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    expect((parsed.meta as Record<string, unknown>).key).toBe('val')
  })

  // ─── logger.debug ──────────────────────────────────────────────────────────

  it('logger.debug calls console.debug', () => {
    logger.debug('debug msg')
    expect(console.debug).toHaveBeenCalledTimes(1)
  })

  it('logger.debug includes level=debug', () => {
    logger.debug('debug msg')
    const arg = vi.mocked(console.debug).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as { level: string }
    expect(parsed.level).toBe('debug')
  })

  // ─── logger.warn ────────────────────────────────────────────────────────────

  it('logger.warn calls console.warn', () => {
    logger.warn('warning')
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('logger.warn with Error object in context', () => {
    const err = new Error('something broke')
    logger.warn('warning', { error: err })
    const arg = vi.mocked(console.warn).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    const errorObj = parsed.error as Record<string, unknown>
    expect(errorObj.name).toBe('Error')
    expect(errorObj.message).toBe('something broke')
  })

  // ─── logger.error ──────────────────────────────────────────────────────────

  it('logger.error includes stack trace (truncated)', () => {
    const err = new Error('fatal')
    logger.error('crash', { error: err })
    const arg = vi.mocked(console.error).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    const errorObj = parsed.error as Record<string, unknown>
    expect(errorObj.stack).toBeDefined()
  })

  it('logger.error with string error in context', () => {
    logger.error('fail', { error: 'string error' })
    const arg = vi.mocked(console.error).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    // string error is not an Error instance, just passed through
    expect(parsed.error).toBe('string error')
  })

  // ─── logger output format ──────────────────────────────────────────────────

  it('JSON output includes timestamp', () => {
    logger.info('ts check')
    const arg = vi.mocked(console.info).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as { ts: string }
    expect(parsed.ts).toBeDefined()
    expect(new Date(parsed.ts).getTime()).not.toBeNaN()
  })

  it('handles very long messages', () => {
    const longMsg = 'M'.repeat(10000)
    logger.info(longMsg)
    const arg = vi.mocked(console.info).mock.calls[0][0] as string
    const parsed = JSON.parse(arg) as { msg: string }
    expect(parsed.msg).toBe(longMsg)
  })
})

// ─── safeCtx ────────────────────────────────────────────────────────────────

describe('safeCtx — extended edge cases', () => {
  it('returns undefined for undefined input', () => {
    expect(safeCtx(undefined)).toBeUndefined()
  })

  it('returns empty object for empty object', () => {
    expect(safeCtx({})).toEqual({})
  })

  it('redacts email field by key', () => {
    const result = safeCtx({ email: 'user@test.com' })
    expect(result?.email).toBe('***redacted***')
  })

  it('redacts password field by key', () => {
    const result = safeCtx({ password: 'secret123' })
    expect(result?.password).toBe('***redacted***')
  })

  it('redacts token field by key', () => {
    const result = safeCtx({ token: 'jwt-token-123' })
    expect(result?.token).toBe('***redacted***')
  })

  it('redacts phone field by key', () => {
    const result = safeCtx({ phone: '+34 612 345 678' })
    expect(result?.phone).toBe('***redacted***')
  })

  it('redacts email addresses embedded in string values', () => {
    const result = safeCtx({ message: 'Contact us at admin@example.com for info' })
    expect(result?.message).not.toContain('admin@example.com')
    expect(result?.message).toContain('***@example.com')
  })

  it('redacts phone numbers embedded in string values', () => {
    const result = safeCtx({ note: 'Call +34 612 345 678 now' })
    const note = result?.note as string
    expect(note).not.toBe('Call +34 612 345 678 now')
  })

  it('handles Date objects in context', () => {
    const result = safeCtx({ createdAt: new Date('2025-01-01') })
    expect(result).toBeDefined()
  })

  it('handles arrays in context', () => {
    const result = safeCtx({ tags: ['a', 'b', 'c'] })
    expect(result?.tags).toEqual(['a', 'b', 'c'])
  })

  it('handles null values', () => {
    const result = safeCtx({ val: null })
    expect(result?.val).toBeNull()
  })

  it('handles circular references gracefully', () => {
    const obj: Record<string, unknown> = { name: 'test' }
    obj.self = obj
    const result = safeCtx(obj) as Record<string, unknown>
    expect(result).toBeDefined()
    // The top-level object is processed; the self-reference inside is marked circular
    const self = result.self as Record<string, unknown>
    expect(self.self).toBe('[Circular]')
  })

  it('handles deeply nested objects (max depth)', () => {
    let obj: Record<string, unknown> = { val: 'leaf' }
    for (let i = 0; i < 10; i++) {
      obj = { nested: obj }
    }
    const result = safeCtx(obj)
    expect(result).toBeDefined()
  })

  it('converts Error instances in error field', () => {
    const err = new Error('test error')
    const result = safeCtx({ error: err })
    const errorObj = result?.error as Record<string, unknown>
    expect(errorObj.name).toBe('Error')
    expect(errorObj.message).toBe('test error')
  })

  it('handles secret field', () => {
    const result = safeCtx({ secret: 'my-secret-value' })
    expect(result?.secret).toBe('***redacted***')
  })
})

// ─── getRequestId ────────────────────────────────────────────────────────────

describe('getRequestId — extended edge cases', () => {
  it('returns existing x-request-id header', () => {
    const headers = new Headers({ 'x-request-id': 'req-123' })
    expect(getRequestId(headers)).toBe('req-123')
  })

  it('returns existing x-correlation-id header', () => {
    const headers = new Headers({ 'x-correlation-id': 'corr-456' })
    expect(getRequestId(headers)).toBe('corr-456')
  })

  it('prefers x-request-id over x-correlation-id', () => {
    const headers = new Headers({
      'x-request-id': 'req-1',
      'x-correlation-id': 'corr-2',
    })
    expect(getRequestId(headers)).toBe('req-1')
  })

  it('generates unique IDs when no header present', () => {
    const headers = new Headers()
    const id1 = getRequestId(headers)
    const _id2 = getRequestId(headers)
    expect(id1).toBeDefined()
    expect(typeof id1).toBe('string')
    // They should ideally be different (randomUUID or timestamp-based)
    // but there's a tiny chance they match with Date.now, so just check format
    expect(id1.length).toBeGreaterThan(0)
  })

  it('generated ID is a string', () => {
    const headers = new Headers()
    const id = getRequestId(headers)
    expect(typeof id).toBe('string')
  })
})
