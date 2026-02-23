import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockModel = {
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  upsert: vi.fn(),
}

vi.mock('@/lib/db', () => ({
  prisma: {
    homeSettings: { ...mockModel },
    aboutSettings: { ...mockModel },
    contactSettings: { ...mockModel },
    themeSettings: { ...mockModel },
    siteSettings: { ...mockModel },
    projectSettings: { ...mockModel },
    testimonialSettings: { ...mockModel },
    categorySettings: { ...mockModel },
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

const BASE_URL = 'http://localhost/api/admin/settings'

const mockSettings = {
  id: 'settings-1',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  heroTitle: 'Welcome',
  heroSubtitle: 'Portfolio',
}

// ── Tests: GET ────────────────────────────────────────────────────────────────

describe('GET /api/admin/settings/[type]', () => {
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

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    const res = await GET(makeRequest(`${BASE_URL}/home`), { params })
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid type', async () => {
    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'invalid-type' })
    const res = await GET(makeRequest(`${BASE_URL}/invalid-type`), { params })
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('inválido')
  })

  it('returns existing settings', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.homeSettings.findFirst).mockResolvedValueOnce(mockSettings as any)

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    const res = await GET(makeRequest(`${BASE_URL}/home`), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })

  it('auto-creates settings if not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.homeSettings.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.homeSettings.create).mockResolvedValueOnce(mockSettings as any)

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    const res = await GET(makeRequest(`${BASE_URL}/home`), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(prisma.homeSettings.create).toHaveBeenCalledWith({ data: {} })
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.homeSettings.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    const res = await GET(makeRequest(`${BASE_URL}/home`), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
  })

  it('works for about type', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValueOnce(mockSettings as any)

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'about' })
    const res = await GET(makeRequest(`${BASE_URL}/about`), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })
})

// ── Tests: PATCH ──────────────────────────────────────────────────────────────

describe('PATCH /api/admin/settings/[type]', () => {
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

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/home`, { method: 'PATCH', body: { heroTitle: 'New' } }),
      { params }
    )
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid type', async () => {
    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'invalid' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/invalid`, { method: 'PATCH', body: { title: 'test' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('upserts settings on PATCH (update existing)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.homeSettings.findFirst).mockResolvedValueOnce(mockSettings as any)
    vi.mocked(prisma.homeSettings.update).mockResolvedValueOnce({
      ...mockSettings,
      heroTitle: 'Updated Title',
    } as any)

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/home`, { method: 'PATCH', body: { heroTitle: 'Updated Title' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('creates settings on PATCH when none exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.homeSettings.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.homeSettings.create).mockResolvedValueOnce(mockSettings as any)

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/home`, { method: 'PATCH', body: { heroTitle: 'New' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(prisma.homeSettings.create).toHaveBeenCalled()
  })

  it('filters forbidden fields (id, createdAt, updatedAt, isActive)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.homeSettings.findFirst).mockResolvedValueOnce(mockSettings as any)
    vi.mocked(prisma.homeSettings.update).mockResolvedValueOnce(mockSettings as any)

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    await PATCH(
      makeRequest(`${BASE_URL}/home`, {
        method: 'PATCH',
        body: {
          id: 'hacked-id',
          createdAt: '2020-01-01',
          updatedAt: '2020-01-01',
          isActive: false,
          heroTitle: 'Valid Field',
        },
      }),
      { params }
    )

    expect(prisma.homeSettings.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          id: 'hacked-id',
          createdAt: expect.anything(),
          isActive: false,
        }),
      })
    )
    expect(prisma.homeSettings.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ heroTitle: 'Valid Field' }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.homeSettings.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const params = Promise.resolve({ type: 'home' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/home`, { method: 'PATCH', body: { heroTitle: 'X' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
  })
})
