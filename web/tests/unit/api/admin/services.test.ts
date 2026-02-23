import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    service: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      aggregate: vi.fn(),
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

function makeRequest(url: string, opts: { method?: string; body?: unknown } = {}) {
  return new Request(url, {
    method: opts.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  })
}

const BASE_URL = 'http://localhost/api/admin/services'

const mockService = {
  id: 'svc-1',
  name: 'Sesión Retrato',
  slug: 'sesion-retrato',
  shortDesc: 'Sesión de fotos de retrato',
  price: 15000.0,
  priceLabel: 'desde',
  currency: 'ARS',
  duration: '1 hora',
  imageUrl: 'https://img.test/svc.jpg',
  iconName: 'camera',
  color: '#6C0A0A',
  isActive: true,
  isFeatured: false,
  isAvailable: true,
  sortOrder: 1,
  bookingCount: 10,
  viewCount: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const validServiceBody = {
  name: 'Nuevo Servicio',
  slug: 'nuevo-servicio',
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/services', () => {
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

    const { GET } = await import('@/app/api/admin/services/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
  })

  it('returns paginated list of services', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([mockService] as any)
    vi.mocked(prisma.service.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/services/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.data).toHaveLength(1)
    expect(json.data.pagination).toBeDefined()
  })

  it('applies search filter (name, slug)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/services/route')
    await GET(makeRequest(`${BASE_URL}?search=retrato`))

    expect(prisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: { contains: 'retrato', mode: 'insensitive' } }),
            expect.objectContaining({ slug: { contains: 'retrato', mode: 'insensitive' } }),
          ]),
        }),
      })
    )
  })

  it('applies active filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/services/route')
    await GET(makeRequest(`${BASE_URL}?active=true`))

    expect(prisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      })
    )
  })

  it('applies featured filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/services/route')
    await GET(makeRequest(`${BASE_URL}?featured=true`))

    expect(prisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isFeatured: true }),
      })
    )
  })

  it('defaults pagination values (page 1, limit 50)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/services/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 50 })
    )
  })

  it('caps limit at 100', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/services/route')
    await GET(makeRequest(`${BASE_URL}?limit=999`))

    expect(prisma.service.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }))
  })

  it('returns correct pagination metadata', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([mockService] as any)
    vi.mocked(prisma.service.count).mockResolvedValueOnce(75)

    const { GET } = await import('@/app/api/admin/services/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=2&limit=25`))
    const json = await res.json()

    expect(json.data.pagination).toEqual({
      page: 2,
      limit: 25,
      total: 75,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    })
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findMany).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/services/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('POST /api/admin/services', () => {
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

    const { POST } = await import('@/app/api/admin/services/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validServiceBody }))
    expect(res.status).toBe(401)
  })

  it('creates service (201)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.service.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 3 } } as any)
    vi.mocked(prisma.service.create).mockResolvedValueOnce(mockService as any)

    const { POST } = await import('@/app/api/admin/services/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validServiceBody }))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })

  it('returns 400 for missing name', async () => {
    const { POST } = await import('@/app/api/admin/services/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { slug: 'only-slug' } }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('name')
  })

  it('returns 400 for missing slug', async () => {
    const { POST } = await import('@/app/api/admin/services/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { name: 'Only Name' } }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('slug')
  })

  it('returns 409 for duplicate slug', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce({ id: 'existing' } as any)

    const { POST } = await import('@/app/api/admin/services/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validServiceBody }))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.error).toContain('slug')
  })

  it('parses price to float', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.service.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.service.create).mockResolvedValueOnce(mockService as any)

    const { POST } = await import('@/app/api/admin/services/route')
    await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { ...validServiceBody, price: '15000.50' },
      })
    )

    expect(prisma.service.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ price: 15000.5 }),
      })
    )
  })

  it('calculates sortOrder from aggregate', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.service.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 4 } } as any)
    vi.mocked(prisma.service.create).mockResolvedValueOnce(mockService as any)

    const { POST } = await import('@/app/api/admin/services/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validServiceBody }))

    expect(prisma.service.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 5 }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.service.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.service.create).mockRejectedValueOnce(new Error('DB crash'))

    const { POST } = await import('@/app/api/admin/services/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validServiceBody }))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })

  it('checks slug uniqueness via findFirst with deletedAt: null', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.service.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.service.create).mockResolvedValueOnce(mockService as any)

    const { POST } = await import('@/app/api/admin/services/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validServiceBody }))

    expect(prisma.service.findFirst).toHaveBeenCalledWith({
      where: { slug: 'nuevo-servicio', deletedAt: null },
    })
  })

  it('handles null price gracefully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.service.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.service.create).mockResolvedValueOnce(mockService as any)

    const { POST } = await import('@/app/api/admin/services/route')
    await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { ...validServiceBody, price: null },
      })
    )

    expect(prisma.service.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ price: null }),
      })
    )
  })
})
