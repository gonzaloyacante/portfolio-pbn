import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
  getRequestId: vi.fn().mockReturnValue('req-123'),
}))

import { withApiLogger, createJsonResponse, createErrorResponse } from '@/lib/api-wrapper'
import { NextRequest, NextResponse } from 'next/server'

describe('api-wrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createJsonResponse', () => {
    it('creates NextResponse with JSON body', async () => {
      const data = { success: true, message: 'ok' }
      const response = createJsonResponse(data)
      const body = await response.json()
      expect(body).toEqual(data)
    })

    it('sets correct status code', () => {
      const response = createJsonResponse({ ok: true }, 201)
      expect(response.status).toBe(201)
    })

    it('defaults to 200 status', () => {
      const response = createJsonResponse({ ok: true })
      expect(response.status).toBe(200)
    })

    it('sets Content-Type header', () => {
      const response = createJsonResponse({ ok: true })
      expect(response.headers.get('content-type')).toContain('application/json')
    })
  })

  describe('createErrorResponse', () => {
    it('creates error response', async () => {
      const response = createErrorResponse('Something went wrong')
      const body = await response.json()
      expect(body.success).toBe(false)
      expect(body.error).toBe('Something went wrong')
    })

    it('includes error message in body', async () => {
      const response = createErrorResponse('Not found', 404)
      const body = await response.json()
      expect(body.error).toBe('Not found')
    })

    it('defaults to 500 status', () => {
      const response = createErrorResponse('Server error')
      expect(response.status).toBe(500)
    })

    it('sets custom status code', () => {
      const response = createErrorResponse('Bad request', 400)
      expect(response.status).toBe(400)
    })

    it('includes error code', async () => {
      const response = createErrorResponse('Forbidden', 403, 'FORBIDDEN')
      const body = await response.json()
      expect(body.code).toBe('FORBIDDEN')
    })
  })

  describe('withApiLogger', () => {
    it('wraps handler and passes through response', async () => {
      const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }))
      const wrapped = withApiLogger(handler)

      const req = new NextRequest('http://localhost/api/test', { method: 'GET' })
      const response = await wrapped(req)
      const body = await response.json()

      expect(handler).toHaveBeenCalledOnce()
      expect(body).toEqual({ ok: true })
    })

    it('returns the correct response from handler', async () => {
      const handler = vi
        .fn()
        .mockResolvedValue(NextResponse.json({ data: 'test' }, { status: 201 }))
      const wrapped = withApiLogger(handler)

      const req = new NextRequest('http://localhost/api/test', { method: 'POST' })
      const response = await wrapped(req)

      expect(response.status).toBe(201)
    })

    it('throws on handler failure', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Handler exploded'))
      const wrapped = withApiLogger(handler)

      const req = new NextRequest('http://localhost/api/test', { method: 'GET' })

      await expect(wrapped(req)).rejects.toThrow('Handler exploded')
    })
  })
})
