import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    user: { findFirst: vi.fn(), update: vi.fn() },
    refreshToken: { create: vi.fn() },
    pushToken: { upsert: vi.fn() },
    analyticLog: { create: vi.fn() },
  },
}))

vi.mock('@/lib/jwt-admin', () => ({
  signAccessToken: vi.fn().mockResolvedValue('mock-access-token'),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/auth-rate-limit', () => ({
  checkAuthRateLimit: vi.fn().mockResolvedValue({ allowed: true, remainingAttempts: 5 }),
  recordFailedLoginAttempt: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn() },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeLoginRequest(body: unknown) {
  return new Request('http://localhost/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validLogin = { email: 'admin@test.com', password: 'Password123!' }

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  name: 'Admin',
  role: 'ADMIN',
  password: '$2b$12$hashedpassword',
  avatarUrl: null,
  failedLoginCount: 0,
  lockedUntil: null,
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/admin/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 for missing body', async () => {
    const req = new Request('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('returns 400 for invalid email format', async () => {
    const req = makeLoginRequest({ email: 'notanemail', password: 'x' })
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('inválidos')
  })

  it('returns 400 for empty password', async () => {
    const req = makeLoginRequest({ email: 'admin@test.com', password: '' })
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for missing fields', async () => {
    const req = makeLoginRequest({})
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 429 when rate limited', async () => {
    const { checkAuthRateLimit } = await import('@/lib/auth-rate-limit')
    vi.mocked(checkAuthRateLimit).mockResolvedValueOnce({ allowed: false, lockoutMinutes: 15 })

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(429)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('Demasiados intentos')
    expect(res.headers.get('Retry-After')).toBeTruthy()
  })

  it('returns 401 for non-existent user', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toContain('Credenciales inválidas')
  })

  it('returns 403 for locked account', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      ...mockUser,
      lockedUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 min from now
    } as never)

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toContain('bloqueada')
  })

  it('returns 401 and records failed attempt for wrong password', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const { recordFailedLoginAttempt } = await import('@/lib/auth-rate-limit')

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(401)
    expect(recordFailedLoginAttempt).toHaveBeenCalled()
  })

  it('locks account after 5 failed attempts', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      ...mockUser,
      failedLoginCount: 4, // This will be the 5th attempt
    } as never)
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    await POST(req)

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          failedLoginCount: 5,
          lockedUntil: expect.any(Date),
        }),
      })
    )
  })

  it('returns tokens and user on successful login', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({
      id: 'rt-1',
      token: 'mock-refresh-token',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
      revokedAt: null,
      replacedBy: null,
      ipAddress: null,
      userAgent: null,
      device: null,
    } as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data.accessToken).toBe('mock-access-token')
    expect(data.data.refreshToken).toBe('mock-refresh-token')
    expect(data.data.user.id).toBe('user-1')
    expect(data.data.user.email).toBe('admin@test.com')
  })

  it('resets failed login count on success', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      ...mockUser,
      failedLoginCount: 3,
    } as never)
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({
      id: 'rt-1',
      token: 'mock-refresh-token',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
      revokedAt: null,
      replacedBy: null,
      ipAddress: null,
      userAgent: null,
      device: null,
    } as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    await POST(req)

    // The last update call should reset failedLoginCount
    const updateCalls = vi.mocked(prisma.user.update).mock.calls
    const lastCall = updateCalls[updateCalls.length - 1]
    expect(lastCall[0].data).toMatchObject({
      failedLoginCount: 0,
      lockedUntil: null,
    })
  })

  it('registers push token when provided', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.pushToken.upsert).mockResolvedValue({} as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({
      id: 'rt-1',
      token: 'mock-refresh-token',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
      revokedAt: null,
      replacedBy: null,
      ipAddress: null,
      userAgent: null,
      device: null,
    } as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const req = makeLoginRequest({
      ...validLogin,
      device: 'android',
      pushToken: 'fcm-token-123',
    })
    const { POST } = await import('@/app/api/admin/auth/login/route')
    await POST(req)

    expect(prisma.pushToken.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { token: 'fcm-token-123' },
      })
    )
  })

  it('returns 500 on unexpected errors', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockRejectedValue(new Error('DB down'))

    const { checkAuthRateLimit } = await import('@/lib/auth-rate-limit')
    vi.mocked(checkAuthRateLimit).mockResolvedValue({ allowed: true, remainingAttempts: 5 })

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('Error interno')
  })

  it('extracts IP from x-forwarded-for header', async () => {
    const { checkAuthRateLimit } = await import('@/lib/auth-rate-limit')
    vi.mocked(checkAuthRateLimit).mockResolvedValue({ allowed: true, remainingAttempts: 5 })

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const req = new Request('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '1.2.3.4, 5.6.7.8',
      },
      body: JSON.stringify(validLogin),
    })

    const { POST } = await import('@/app/api/admin/auth/login/route')
    await POST(req)

    expect(checkAuthRateLimit).toHaveBeenCalledWith('admin@test.com', '1.2.3.4')
  })

  it('normalizes email to lowercase', async () => {
    const { checkAuthRateLimit } = await import('@/lib/auth-rate-limit')
    vi.mocked(checkAuthRateLimit).mockResolvedValue({ allowed: true, remainingAttempts: 5 })

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const req = makeLoginRequest({ email: 'ADMIN@Test.COM', password: 'x1' })
    const { POST } = await import('@/app/api/admin/auth/login/route')
    await POST(req)

    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          email: 'admin@test.com',
        }),
      })
    )
  })

  it('does not return password in response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({
      id: 'rt-1',
      token: 'mock-refresh-token',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
      revokedAt: null,
      replacedBy: null,
      ipAddress: null,
      userAgent: null,
      device: null,
    } as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const req = makeLoginRequest(validLogin)
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    const data = await res.json()
    expect(data.data.user).not.toHaveProperty('password')
  })

  it('accepts valid device enum values', async () => {
    const req = makeLoginRequest({ ...validLogin, device: 'ios' })
    const { POST } = await import('@/app/api/admin/auth/login/route')

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const res = await POST(req)
    // Should not be 400 (validation should pass)
    expect(res.status).not.toBe(400)
  })

  it('rejects invalid device enum values', async () => {
    const req = makeLoginRequest({ ...validLogin, device: 'windows' })
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('allows expired lockedUntil', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      ...mockUser,
      lockedUntil: new Date(Date.now() - 60000), // Expired 1 min ago
    } as never)
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({
      id: 'rt-1',
      token: 'mock-refresh-token',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
      revokedAt: null,
      replacedBy: null,
      ipAddress: null,
      userAgent: null,
      device: null,
    } as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const res = await (
      await import('@/app/api/admin/auth/login/route')
    ).POST(makeLoginRequest(validLogin))
    expect(res.status).toBe(200)
  })
})
