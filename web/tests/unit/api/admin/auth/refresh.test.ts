import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => {
  const refreshTokenFindUnique = vi.fn()
  const refreshTokenCreate = vi.fn()
  const refreshTokenUpdate = vi.fn()
  const refreshTokenUpdateMany = vi.fn()
  const userFindFirst = vi.fn()

  const tx = {
    refreshToken: {
      findUnique: refreshTokenFindUnique,
      create: refreshTokenCreate,
      update: refreshTokenUpdate,
      updateMany: refreshTokenUpdateMany,
    },
    user: { findFirst: userFindFirst },
  }

  return {
    prisma: {
      ...tx,
      $transaction: vi
        .fn()
        .mockImplementation(async (fn: (tx: typeof tx) => Promise<unknown>) => fn(tx)),
    },
  }
})

vi.mock('@/lib/jwt-admin', () => ({
  signAccessToken: vi.fn().mockResolvedValue('new-access-token'),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/rate-limit', () => ({
  createRateLimiter: vi.fn().mockReturnValue({
    check: vi.fn().mockResolvedValue({ allowed: true, remaining: 99 }),
    record: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/lib/rate-limit-config', () => ({
  RATE_LIMITS: { API: { id: 'api', limit: 100, window: 60000 } },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRefreshRequest(body: unknown) {
  return new Request('http://localhost/api/admin/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockExistingToken = {
  id: 'rt-id-1',
  token: 'valid-refresh-token',
  userId: 'user-1',
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  createdAt: new Date(),
  revokedAt: null,
  replacedBy: null,
  ipAddress: null,
  userAgent: null,
  device: 'android',
  lastUsedAt: null,
}

const mockUser = {
  id: 'user-1',
  role: 'ADMIN',
  email: 'admin@test.com',
}

const mockCreatedToken = {
  id: 'new-rt-id',
  token: 'new-refresh-token',
  userId: 'user-1',
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  revokedAt: null,
  replacedBy: null,
  ipAddress: null,
  userAgent: null,
  device: 'android',
  lastUsedAt: null,
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/admin/auth/refresh', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    // Por defecto, "ganamos" el lock optimista de rotación (count: 1).
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 1 } as never)
  })

  it('returns 400 for missing body', async () => {
    const req = new Request('http://localhost/api/admin/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })

    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('returns 400 for missing refreshToken', async () => {
    const req = makeRefreshRequest({})
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('validates refreshToken is string type', async () => {
    const req = makeRefreshRequest({ refreshToken: 12345 })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('returns 401 for non-existent token (TOKEN_INVALID)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(null)

    const req = makeRefreshRequest({ refreshToken: 'non-existent-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.code).toBe('TOKEN_INVALID')
  })

  it('returns 401 for revoked token without replacement (TOKEN_REVOKED)', async () => {
    const { prisma } = await import('@/lib/db')
    // revokedAt set, replacedBy: null (mockExistingToken) → sin reemplazo válido,
    // no aplica grace period → reuso real.
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
      ...mockExistingToken,
      revokedAt: new Date(),
    } as never)
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 2 } as never)

    const req = makeRefreshRequest({ refreshToken: 'revoked-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.code).toBe('TOKEN_REVOKED')
  })

  it('revokes entire token chain on revoked detection without replacement', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
      ...mockExistingToken,
      revokedAt: new Date(),
    } as never)
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 3 } as never)

    const req = makeRefreshRequest({ refreshToken: 'revoked-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    await POST(req)

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          revokedAt: null,
        }),
        data: expect.objectContaining({
          revokedAt: expect.any(Date),
        }),
      })
    )
  })

  it('returns 401 for expired token (TOKEN_EXPIRED)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
      ...mockExistingToken,
      expiresAt: new Date(Date.now() - 1000), // expired
    } as never)

    const req = makeRefreshRequest({ refreshToken: 'expired-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.code).toBe('TOKEN_EXPIRED')
  })

  it('returns 401 if user is inactive', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockExistingToken as never)
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('no encontrado')
  })

  it('returns 401 if user is deleted', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockExistingToken as never)
    // findFirst with deletedAt: null filter returns null for deleted users
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('handles missing user gracefully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockExistingToken as never)
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('rotates tokens successfully (new refresh, old revoked via optimistic lock)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockExistingToken as never)
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue(mockCreatedToken as never)
    vi.mocked(prisma.refreshToken.update).mockResolvedValue({} as never)

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(200)

    // Rotación atómica con lock optimista: solo revoca si revokedAt sigue null.
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { id: 'rt-id-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    })
    // El token viejo apunta al nuevo.
    expect(prisma.refreshToken.update).toHaveBeenCalledWith({
      where: { id: 'rt-id-1' },
      data: { replacedBy: 'new-rt-id' },
    })
  })

  it('returns new access and refresh tokens', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockExistingToken as never)
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue(mockCreatedToken as never)
    vi.mocked(prisma.refreshToken.update).mockResolvedValue({} as never)

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data.accessToken).toBe('new-access-token')
    expect(data.data.refreshToken).toBe('new-refresh-token')
  })

  it('sets replacedBy on old token', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockExistingToken as never)
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue(mockCreatedToken as never)
    vi.mocked(prisma.refreshToken.update).mockResolvedValue({} as never)

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    await POST(req)

    const updateCalls = vi.mocked(prisma.refreshToken.update).mock.calls
    const revokeCall = updateCalls.find(
      (call) => (call[0] as { data: { replacedBy?: string } }).data.replacedBy !== undefined
    )
    expect(revokeCall).toBeDefined()
    expect((revokeCall![0] as { data: { replacedBy: string } }).data.replacedBy).toBe('new-rt-id')
  })

  it('creates new token with correct expiration (30 days)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockExistingToken as never)
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue(mockCreatedToken as never)
    vi.mocked(prisma.refreshToken.update).mockResolvedValue({} as never)

    const now = Date.now()
    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    await POST(req)

    const createCall = vi.mocked(prisma.refreshToken.create).mock.calls[0]
    const expiresAt = (createCall[0] as { data: { expiresAt: Date } }).data.expiresAt.getTime()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    // Allow 5 seconds tolerance
    expect(expiresAt).toBeGreaterThan(now + thirtyDaysMs - 5000)
    expect(expiresAt).toBeLessThan(now + thirtyDaysMs + 5000)
  })

  // ── C6: rotación concurrente (lock optimista + grace period) ─────────────────

  it('lost rotation race within grace period returns winner tokens without revoking chain', async () => {
    const { prisma } = await import('@/lib/db')

    vi.mocked(prisma.refreshToken.findUnique)
      .mockResolvedValueOnce(mockExistingToken as never) // 1: existing (revokedAt: null para nosotros)
      .mockResolvedValueOnce({
        ...mockExistingToken,
        revokedAt: new Date(), // otra request lo rotó justo antes
        replacedBy: 'winner-rt-id',
      } as never) // helper: re-fetch del estado actual
      .mockResolvedValueOnce({
        id: 'winner-rt-id',
        token: 'winner-refresh-token',
        userId: 'user-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      } as never) // helper: token ganador (reemplazo)

    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    // Perdemos el lock optimista: alguien más ya rotó este token.
    vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 0 } as never)

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.refreshToken).toBe('winner-refresh-token')
    expect(data.data.accessToken).toBe('new-access-token')

    // Un solo updateMany: el lock perdido (count: 0). No se nukea la cadena.
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledTimes(1)
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { id: 'rt-id-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    })
    // No creamos un token propio: reusamos el del ganador.
    expect(prisma.refreshToken.create).not.toHaveBeenCalled()
  })

  it('lost rotation race outside grace period revokes entire chain', async () => {
    const { prisma } = await import('@/lib/db')

    vi.mocked(prisma.refreshToken.findUnique)
      .mockResolvedValueOnce(mockExistingToken as never) // 1: existing
      .mockResolvedValueOnce({
        ...mockExistingToken,
        revokedAt: new Date(Date.now() - 120_000), // rotado hace 2 min (fuera de gracia)
        replacedBy: 'winner-rt-id',
      } as never) // helper: re-fetch del estado actual

    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.updateMany)
      .mockResolvedValueOnce({ count: 0 } as never) // perdimos el lock
      .mockResolvedValueOnce({ count: 2 } as never) // nuke de cadena

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.code).toBe('TOKEN_REVOKED')
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledTimes(2)
    expect(prisma.refreshToken.updateMany).toHaveBeenLastCalledWith({
      where: { userId: 'user-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    })
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.refreshToken.findUnique).mockRejectedValue(new Error('DB down'))

    const req = makeRefreshRequest({ refreshToken: 'valid-refresh-token' })
    const { POST } = await import('@/app/api/admin/auth/refresh/route')
    const res = await POST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('Error interno')
  })
})
