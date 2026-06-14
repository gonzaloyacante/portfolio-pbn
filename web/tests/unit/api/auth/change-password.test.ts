import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    refreshToken: { updateMany: vi.fn() },
  },
}))

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
}))

vi.mock('@/lib/auth', () => ({ authOptions: {} }))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  password: '$2b$12$currenthash',
}

function buildRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/auth/change-password', () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    const { checkApiRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(checkApiRateLimit).mockResolvedValue(undefined)

    const { getServerSession } = await import('next-auth')
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: mockUser.email },
    } as never)
  })

  it('returns 429 when rate limited (A16)', async () => {
    const { checkApiRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(checkApiRateLimit).mockResolvedValue({
      allowed: false,
      error: 'Demasiadas solicitudes. Intenta de nuevo en 60s',
    })

    const { POST } = await import('@/app/api/auth/change-password/route')
    const res = await POST(buildRequest({ currentPassword: 'a', newPassword: 'newpassword123' }))
    const body = await res.json()

    expect(res.status).toBe(429)
    expect(body.error).toBe('Demasiadas solicitudes. Intenta de nuevo en 60s')
  })

  it('returns 401 when not authenticated', async () => {
    const { getServerSession } = await import('next-auth')
    vi.mocked(getServerSession).mockResolvedValue(null)
    const { getToken } = await import('next-auth/jwt')
    vi.mocked(getToken).mockResolvedValue(null)

    const { POST } = await import('@/app/api/auth/change-password/route')
    const res = await POST(buildRequest({ currentPassword: 'a', newPassword: 'newpassword123' }))
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.error).toBe('No autorizado')
  })

  it('returns 400 when fields are missing', async () => {
    const { POST } = await import('@/app/api/auth/change-password/route')
    const res = await POST(buildRequest({ currentPassword: 'a' }))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBe('Faltan campos requeridos')
  })

  it('returns 400 when newPassword is too short', async () => {
    const { POST } = await import('@/app/api/auth/change-password/route')
    const res = await POST(buildRequest({ currentPassword: 'a', newPassword: 'short' }))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBe('La contraseña debe tener al menos 8 caracteres')
  })

  it('returns 404 when user not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const { POST } = await import('@/app/api/auth/change-password/route')
    const res = await POST(buildRequest({ currentPassword: 'a', newPassword: 'newpassword123' }))
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBe('Usuario no encontrado')
  })

  it('returns 400 when current password is incorrect', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)
    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const { POST } = await import('@/app/api/auth/change-password/route')
    const res = await POST(
      buildRequest({ currentPassword: 'wrong', newPassword: 'newpassword123' })
    )
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBe('Contraseña actual incorrecta')
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it('success: updates password and revokes all refresh tokens (A15)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)
    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(bcrypt.hash).mockResolvedValue('$2b$12$newhash' as never)

    const { POST } = await import('@/app/api/auth/change-password/route')
    const res = await POST(
      buildRequest({ currentPassword: 'correct', newPassword: 'newpassword123' })
    )
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ success: true })
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { password: '$2b$12$newhash' },
    })
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: mockUser.id, revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    })
  })
})
