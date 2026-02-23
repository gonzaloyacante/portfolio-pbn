/**
 * Shared test helpers for API route tests.
 * Provides factories and utilities to create mock requests/responses.
 */

import { vi } from 'vitest'

// ── Request Factories ────────────────────────────────────────────────────────

/**
 * Create a mock Request object for testing API handlers.
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string
    body?: unknown
    headers?: Record<string, string>
    formData?: FormData
  } = {}
): Request {
  const { method = 'GET', body, headers = {}, formData } = options

  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    requestInit.body = JSON.stringify(body)
  }

  if (formData) {
    requestInit.body = formData
    // Remove Content-Type so multipart boundary is set automatically
    delete (requestInit.headers as Record<string, string>)['Content-Type']
  }

  return new Request(url, requestInit)
}

/**
 * Create a mock authenticated request (with Bearer token).
 */
export function createAuthRequest(
  url: string,
  options: {
    method?: string
    body?: unknown
    headers?: Record<string, string>
    token?: string
  } = {}
): Request {
  const { token = 'valid-test-token', ...rest } = options
  return createMockRequest(url, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      ...rest.headers,
    },
  })
}

/**
 * Parse JSON body from a Response.
 */
export async function parseResponse<T = unknown>(response: Response): Promise<T> {
  return response.json() as Promise<T>
}

// ── Standard Response Types ──────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
  details?: unknown
}

export interface PaginatedData<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ── Common Mock Setup ────────────────────────────────────────────────────────

/**
 * Standard mock setup for withAdminJwt.
 * Call this to configure auth mock behavior per test.
 */
export function mockAuthSuccess(
  payload = { userId: 'admin-1', role: 'ADMIN', type: 'access' as const }
) {
  return vi.fn().mockResolvedValue({ ok: true, payload })
}

export function mockAuthFailure(status = 401, error = 'No autorizado') {
  return vi.fn().mockResolvedValue({
    ok: false,
    response: new Response(JSON.stringify({ success: false, error }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  })
}

// ── Date Helpers ─────────────────────────────────────────────────────────────

export const FIXED_DATE = new Date('2025-01-15T12:00:00.000Z')
export const FIXED_DATE_STR = '2025-01-15T12:00:00.000Z'

// ── Async Params Helper (Next.js 15+) ────────────────────────────────────────

/**
 * Create async params object matching Next.js 15+ signature.
 */
export function createAsyncParams<T extends Record<string, string>>(params: T): Promise<T> {
  return Promise.resolve(params)
}
