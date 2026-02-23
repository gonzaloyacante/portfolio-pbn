import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    pushToken: {
      upsert: vi.fn(),
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
  return new Request('http://localhost/api/admin/push/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    body: JSON.stringify(body),
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/admin/push/register', () => {
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

    const { POST } = await import('@/app/api/admin/push/register/route')
    const res = await POST(makeRequest({ token: 'fcm-token', platform: 'android' }))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for missing token', async () => {
    const { POST } = await import('@/app/api/admin/push/register/route')
    const res = await POST(makeRequest({ platform: 'android' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('Token')
  })

  it('returns 400 for empty token', async () => {
    const { POST } = await import('@/app/api/admin/push/register/route')
    const res = await POST(makeRequest({ token: '   ', platform: 'android' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('Token')
  })

  it('returns 400 for invalid platform', async () => {
    const { POST } = await import('@/app/api/admin/push/register/route')
    const res = await POST(makeRequest({ token: 'fcm-token', platform: 'windows' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('Platform')
  })

  it('registers token successfully via upsert', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.pushToken.upsert).mockResolvedValueOnce({} as any)

    const { POST } = await import('@/app/api/admin/push/register/route')
    const res = await POST(makeRequest({ token: 'fcm-token-123', platform: 'android' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)

    expect(prisma.pushToken.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { token: 'fcm-token-123' },
        create: expect.objectContaining({
          token: 'fcm-token-123',
          platform: 'android',
          isActive: true,
        }),
        update: expect.objectContaining({
          platform: 'android',
          isActive: true,
        }),
      })
    )
  })

  it('updates existing token via upsert', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.pushToken.upsert).mockResolvedValueOnce({} as any)

    const { POST } = await import('@/app/api/admin/push/register/route')
    const res = await POST(makeRequest({ token: 'existing-token', platform: 'ios' }))
    expect(res.status).toBe(200)

    expect(prisma.pushToken.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { token: 'existing-token' },
        update: expect.objectContaining({
          platform: 'ios',
          isActive: true,
        }),
      })
    )
  })

  it('associates token with authenticated userId', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.pushToken.upsert).mockResolvedValueOnce({} as any)

    const { POST } = await import('@/app/api/admin/push/register/route')
    await POST(makeRequest({ token: 'fcm-token', platform: 'android' }))

    expect(prisma.pushToken.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ userId: 'admin-1' }),
        update: expect.objectContaining({ userId: 'admin-1' }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.pushToken.upsert).mockRejectedValueOnce(new Error('DB connection failed'))

    const { POST } = await import('@/app/api/admin/push/register/route')
    const res = await POST(makeRequest({ token: 'fcm-token', platform: 'android' }))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
