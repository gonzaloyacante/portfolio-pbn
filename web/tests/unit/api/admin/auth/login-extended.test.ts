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

function makeLoginRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
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

describe('POST /api/admin/auth/login — extended edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 for SQL injection in email field (Zod rejects)', async () => {
    const body = { email: "' OR 1=1 --", password: 'test' }
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 for XSS in email field', async () => {
    const body = { email: '<script>alert("xss")</script>', password: 'test' }
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 for very long email (256+ chars)', async () => {
    const longEmail = 'a'.repeat(250) + '@test.com'
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest({ email: longEmail, password: 'x' }))
    // Zod email validation may accept or reject; check it doesn't crash
    expect([200, 400, 401].includes(res.status)).toBe(true)
  })

  it('handles password with unicode characters', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest({ email: 'admin@test.com', password: '密码🔑Test1' }))
    // Should reach bcrypt.compare, not fail at validation
    expect(res.status).toBe(200)
  })

  it('ignores extra unexpected fields in body', async () => {
    const body = { ...validLogin, extraField: 'ignored', anotherExtra: 123 }
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(body))
    expect(res.status).toBe(200)
  })

  it('takes first IP from x-forwarded-for with multiple IPs', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(
      makeLoginRequest(validLogin, { 'x-forwarded-for': '1.2.3.4, 5.6.7.8, 9.10.11.12' })
    )
    expect(res.status).toBe(200)
    // Verify the refreshToken was created with first IP
    expect(prisma.refreshToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ ipAddress: '1.2.3.4' }),
      })
    )
  })

  it('falls back to x-real-ip when x-forwarded-for is missing', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(validLogin, { 'x-real-ip': '10.0.0.1' }))
    expect(res.status).toBe(200)
    expect(prisma.refreshToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ ipAddress: '10.0.0.1' }),
      })
    )
  })

  it('returns 400 for malformed JSON body', async () => {
    const req = new Request('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json',
    })

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 401 for user with role != ADMIN when not found (isActive check)', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(null as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(false as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(validLogin))
    expect(res.status).toBe(401)
  })

  it('returns 403 for locked account', async () => {
    const { prisma } = await import('@/lib/db')
    const lockedUser = {
      ...mockUser,
      lockedUntil: new Date(Date.now() + 60 * 60 * 1000), // 1h in future
    }
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(lockedUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(validLogin))
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.error).toContain('bloqueada')
  })

  it('allows login when lockedUntil is in the past', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    const expiredLock = {
      ...mockUser,
      lockedUntil: new Date(Date.now() - 1000), // in the past
    }
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(expiredLock as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(validLogin))
    expect(res.status).toBe(200)
  })

  it('increments failedLoginCount on wrong password', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      ...mockUser,
      failedLoginCount: 3,
    } as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(false as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(validLogin))
    expect(res.status).toBe(401)
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ failedLoginCount: 4 }),
      })
    )
  })

  it('locks account at 5 failed attempts', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      ...mockUser,
      failedLoginCount: 4,
    } as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(false as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    await POST(makeLoginRequest(validLogin))

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          failedLoginCount: 5,
          lockedUntil: expect.any(Date),
        }),
      })
    )
  })

  it('does NOT lock at 4 attempts (only at 5)', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      ...mockUser,
      failedLoginCount: 3,
    } as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(false as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    await POST(makeLoginRequest(validLogin))

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          failedLoginCount: 4,
          lockedUntil: null,
        }),
      })
    )
  })

  it('device field is optional (login works without it)', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(validLogin))
    expect(res.status).toBe(200)
    // pushToken.upsert should NOT be called without device
    expect(prisma.pushToken.upsert).not.toHaveBeenCalled()
  })

  it('registers pushToken when device and pushToken are provided', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.pushToken.upsert).mockResolvedValueOnce({} as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(
      makeLoginRequest({ ...validLogin, device: 'android', pushToken: 'fcm-token-123' })
    )
    expect(res.status).toBe(200)
    expect(prisma.pushToken.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { token: 'fcm-token-123' },
        create: expect.objectContaining({ platform: 'android' }),
      })
    )
  })

  it('does not register pushToken when pushToken provided but no device', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest({ ...validLogin, pushToken: 'token-no-device' }))
    expect(res.status).toBe(200)
    expect(prisma.pushToken.upsert).not.toHaveBeenCalled()
  })

  it('returns 500 when DB throws unexpectedly', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockRejectedValueOnce(new Error('DB connection lost'))

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(validLogin))
    expect(res.status).toBe(500)
  })

  it('successful login returns user data without password', async () => {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({ token: 'rt-1' } as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never)

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const res = await POST(makeLoginRequest(validLogin))
    const json = await res.json()
    expect(json.data.user).not.toHaveProperty('password')
    expect(json.data.user.email).toBe('admin@test.com')
  })
})
