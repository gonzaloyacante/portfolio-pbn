import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    user: { findFirst: vi.fn(), update: vi.fn() },
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

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn(), hash: vi.fn().mockResolvedValue('new-hashed-password') },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeGetRequest() {
  return new Request('http://localhost/api/admin/auth/me', {
    method: 'GET',
    headers: { Authorization: 'Bearer mock-access-token' },
  })
}

function makePatchRequest(body: unknown) {
  return new Request('http://localhost/api/admin/auth/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer mock-access-token',
    },
    body: JSON.stringify(body),
  })
}

const mockUserProfile = {
  id: 'admin-1',
  email: 'admin@test.com',
  name: 'Admin',
  role: 'ADMIN',
  avatarUrl: null,
  bio: 'Bio text',
  locale: 'es',
  timezone: 'Europe/Madrid',
  notifications: true,
  lastLoginAt: new Date('2025-01-01'),
  createdAt: new Date('2024-01-01'),
}

const mockUserWithPassword = {
  password: '$2b$12$existing-hashed-password',
}

// ── Tests: GET /api/admin/auth/me ─────────────────────────────────────────────

describe('GET /api/admin/auth/me', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValue({
      ok: true,
      payload: { userId: 'admin-1', role: 'ADMIN', type: 'access' },
    } as never)
  })

  it('returns 401 without auth', async () => {
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValue({
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    } as never)

    const req = makeGetRequest()
    const { GET } = await import('@/app/api/admin/auth/me/route')
    const res = await GET(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('returns user profile on success', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUserProfile as never)

    const req = makeGetRequest()
    const { GET } = await import('@/app/api/admin/auth/me/route')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data.id).toBe('admin-1')
    expect(data.data.email).toBe('admin@test.com')
    expect(data.data.name).toBe('Admin')
    expect(data.data.role).toBe('ADMIN')
  })

  it('returns 404 if user not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const req = makeGetRequest()
    const { GET } = await import('@/app/api/admin/auth/me/route')
    const res = await GET(req)
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('no encontrado')
  })

  it('does not return password field', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUserProfile as never)

    const req = makeGetRequest()
    const { GET } = await import('@/app/api/admin/auth/me/route')
    const res = await GET(req)
    const data = await res.json()
    expect(data.data).not.toHaveProperty('password')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockRejectedValue(new Error('DB down'))

    const req = makeGetRequest()
    const { GET } = await import('@/app/api/admin/auth/me/route')
    const res = await GET(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('Error interno')
  })
})

// ── Tests: PATCH /api/admin/auth/me ───────────────────────────────────────────

describe('PATCH /api/admin/auth/me', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValue({
      ok: true,
      payload: { userId: 'admin-1', role: 'ADMIN', type: 'access' },
    } as never)
    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed-password' as never)
  })

  it('returns 401 without auth', async () => {
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValue({
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    } as never)

    const req = makePatchRequest({ currentPassword: 'old', newPassword: 'newpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  it('returns 400 for missing currentPassword', async () => {
    const req = makePatchRequest({ newPassword: 'newpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('requeridos')
  })

  it('returns 400 for missing newPassword', async () => {
    const req = makePatchRequest({ currentPassword: 'oldpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('requeridos')
  })

  it('returns 400 for short newPassword (< 8 chars)', async () => {
    const req = makePatchRequest({ currentPassword: 'oldpass123', newPassword: 'short' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('8 caracteres')
  })

  it('returns 404 if user not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const req = makePatchRequest({ currentPassword: 'oldpass123', newPassword: 'newpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('no encontrado')
  })

  it('returns 400 for wrong current password', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUserWithPassword as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const req = makePatchRequest({ currentPassword: 'wrongpass', newPassword: 'newpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('incorrecta')
  })

  it('updates password successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUserWithPassword as never)
    vi.mocked(prisma.user.update).mockResolvedValue({} as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const req = makePatchRequest({ currentPassword: 'oldpass123', newPassword: 'newpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'admin-1' },
        data: { password: 'new-hashed-password' },
      })
    )
  })

  it('hashes password with bcrypt salt 12', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUserWithPassword as never)
    vi.mocked(prisma.user.update).mockResolvedValue({} as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const req = makePatchRequest({ currentPassword: 'oldpass123', newPassword: 'newpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    await PATCH(req)

    expect(bcrypt.hash).toHaveBeenCalledWith('newpass123', 12)
  })

  it('returns success response with message', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUserWithPassword as never)
    vi.mocked(prisma.user.update).mockResolvedValue({} as never)

    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const req = makePatchRequest({ currentPassword: 'oldpass123', newPassword: 'newpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.message).toContain('actualizada')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findFirst).mockRejectedValue(new Error('DB down'))

    const req = makePatchRequest({ currentPassword: 'oldpass123', newPassword: 'newpass123' })
    const { PATCH } = await import('@/app/api/admin/auth/me/route')
    const res = await PATCH(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('Error interno')
  })
})
