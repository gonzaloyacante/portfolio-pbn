import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    refreshToken: { updateMany: vi.fn() },
    pushToken: { updateMany: vi.fn() },
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

function makeLogoutRequest(body: unknown) {
  return new Request('http://localhost/api/admin/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer mock-access-token',
    },
    body: JSON.stringify(body),
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/admin/auth/logout', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValue({
      ok: true,
      payload: { userId: 'admin-1', role: 'ADMIN', type: 'access' },
    } as never)
  })

  it('returns 401 without auth token', async () => {
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValue({
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    } as never)

    const req = makeLogoutRequest({ refreshToken: 'rt-123' })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('returns 400 for missing refreshToken', async () => {
    const req = makeLogoutRequest({})
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('returns 400 for empty refreshToken', async () => {
    const req = makeLogoutRequest({ refreshToken: '' })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('validates refreshToken is string', async () => {
    const req = makeLogoutRequest({ refreshToken: 12345 })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('handles null/undefined body gracefully', async () => {
    const req = new Request('http://localhost/api/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-access-token',
      },
      body: 'not-json',
    })

    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('revokes single token successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 1 } as never)

    const req = makeLogoutRequest({ refreshToken: 'rt-123' })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          token: 'rt-123',
          userId: 'admin-1',
          revokedAt: null,
        }),
      })
    )
  })

  it('includes auth payload userId in DB query', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 1 } as never)

    const req = makeLogoutRequest({ refreshToken: 'rt-456' })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    await POST(req)

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'admin-1',
        }),
      })
    )
  })

  it('returns success even if token not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 0 } as never)

    const req = makeLogoutRequest({ refreshToken: 'non-existent-token' })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })

  it('revokes all tokens when everywhere=true', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 5 } as never)
    vi.mocked(prisma.pushToken.updateMany).mockResolvedValue({ count: 2 } as never)

    const req = makeLogoutRequest({ refreshToken: 'rt-123', everywhere: true })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'admin-1',
          revokedAt: null,
        }),
      })
    )
  })

  it('deactivates push tokens when everywhere=true', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 3 } as never)
    vi.mocked(prisma.pushToken.updateMany).mockResolvedValue({ count: 2 } as never)

    const req = makeLogoutRequest({ refreshToken: 'rt-123', everywhere: true })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    await POST(req)

    expect(prisma.pushToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'admin-1',
          isActive: true,
        }),
        data: expect.objectContaining({
          isActive: false,
        }),
      })
    )
  })

  it('calls deleteMany for everywhere logout (updateMany on all tokens)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 4 } as never)
    vi.mocked(prisma.pushToken.updateMany).mockResolvedValue({ count: 1 } as never)

    const req = makeLogoutRequest({ refreshToken: 'rt-123', everywhere: true })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    await POST(req)

    // Should NOT filter by specific token, but by userId only
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.not.objectContaining({
          token: 'rt-123',
        }),
      })
    )
  })

  it('returns proper success response structure', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 1 } as never)

    const req = makeLogoutRequest({ refreshToken: 'rt-123' })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    const data = await res.json()
    expect(data).toEqual({ success: true })
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockRejectedValue(new Error('DB down'))

    const req = makeLogoutRequest({ refreshToken: 'rt-123' })
    const { POST } = await import('@/app/api/admin/auth/logout/route')
    const res = await POST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('Error interno')
  })
})
