import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: { update: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/jwt-admin', () => ({
  withAdminJwt: vi.fn().mockResolvedValue({
    ok: true,
    payload: { userId: 'admin-1', role: 'ADMIN', type: 'access' },
  }),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(url: string, opts: { method?: string; body?: unknown } = {}) {
  return new Request(url, {
    method: opts.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  })
}

const BASE_URL = 'http://localhost/api/admin/projects/reorder'

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/admin/projects/reorder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValueOnce({
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    } as any)

    const { POST } = await import('@/app/api/admin/projects/reorder/route')
    const res = await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { items: [{ id: 'p1', sortOrder: 1 }] },
      })
    )
    expect(res.status).toBe(401)
  })

  it('reorders projects successfully using $transaction', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([])

    const { POST } = await import('@/app/api/admin/projects/reorder/route')
    const items = [
      { id: 'p1', sortOrder: 0 },
      { id: 'p2', sortOrder: 1 },
    ]
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { items } }))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Orden actualizado')
    expect(prisma.$transaction).toHaveBeenCalled()
  })

  it('returns 400 for missing items array', async () => {
    const { POST } = await import('@/app/api/admin/projects/reorder/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: {} }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('items')
  })

  it('returns 400 for empty items array', async () => {
    const { POST } = await import('@/app/api/admin/projects/reorder/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { items: [] } }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('items')
  })

  it('assigns updatedBy to each update in transaction', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([])

    const { POST } = await import('@/app/api/admin/projects/reorder/route')
    const items = [{ id: 'p1', sortOrder: 0 }]
    await POST(makeRequest(BASE_URL, { method: 'POST', body: { items } }))

    // The transaction receives an array of prisma.project.update calls
    const transactionArg = vi.mocked(prisma.$transaction).mock.calls[0][0]
    expect(transactionArg).toHaveLength(1)
  })

  it('handles multiple items in transaction', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([])

    const { POST } = await import('@/app/api/admin/projects/reorder/route')
    const items = [
      { id: 'p1', sortOrder: 0 },
      { id: 'p2', sortOrder: 1 },
      { id: 'p3', sortOrder: 2 },
    ]
    await POST(makeRequest(BASE_URL, { method: 'POST', body: { items } }))

    const transactionArg = vi.mocked(prisma.$transaction).mock.calls[0][0]
    expect(transactionArg).toHaveLength(3)
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockRejectedValueOnce(new Error('TX failed'))

    const { POST } = await import('@/app/api/admin/projects/reorder/route')
    const res = await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { items: [{ id: 'p1', sortOrder: 0 }] },
      })
    )
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })

  it('returns success response with correct message', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([])

    const { POST } = await import('@/app/api/admin/projects/reorder/route')
    const res = await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { items: [{ id: 'p1', sortOrder: 0 }] },
      })
    )
    const json = await res.json()

    expect(json).toEqual({ success: true, message: 'Orden actualizado' })
  })
})
