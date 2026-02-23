import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    pushToken: {
      updateMany: vi.fn(),
    },
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

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/admin/push/unregister', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    body: JSON.stringify(body),
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/admin/push/unregister', () => {
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

    const { POST } = await import('@/app/api/admin/push/unregister/route')
    const res = await POST(makeRequest({ token: 'fcm-token' }))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for missing token', async () => {
    const { POST } = await import('@/app/api/admin/push/unregister/route')
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('Token')
  })

  it('deactivates token successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.pushToken.updateMany).mockResolvedValueOnce({ count: 1 } as any)

    const { POST } = await import('@/app/api/admin/push/unregister/route')
    const res = await POST(makeRequest({ token: 'fcm-token-abc' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)

    expect(prisma.pushToken.updateMany).toHaveBeenCalledWith({
      where: { token: 'fcm-token-abc', userId: 'admin-1' },
      data: { isActive: false },
    })
  })

  it('returns success even if token not found (count=0)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.pushToken.updateMany).mockResolvedValueOnce({ count: 0 } as any)

    const { POST } = await import('@/app/api/admin/push/unregister/route')
    const res = await POST(makeRequest({ token: 'nonexistent-token' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('uses userId from auth payload', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.pushToken.updateMany).mockResolvedValueOnce({ count: 1 } as any)

    const { POST } = await import('@/app/api/admin/push/unregister/route')
    await POST(makeRequest({ token: 'some-token' }))

    expect(prisma.pushToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: 'admin-1' }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.pushToken.updateMany).mockRejectedValueOnce(new Error('DB connection failed'))

    const { POST } = await import('@/app/api/admin/push/unregister/route')
    const res = await POST(makeRequest({ token: 'fcm-token' }))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
