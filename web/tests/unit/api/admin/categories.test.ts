import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    category: {
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

const BASE_URL = 'http://localhost/api/admin/categories'

const mockCategory = {
  id: 'cat-1',
  name: 'Retratos',
  slug: 'retratos',
  description: 'Fotografía de retratos',
  thumbnailUrl: 'https://img.test/cat.jpg',
  iconName: 'camera',
  color: '#6C0A0A',
  sortOrder: 1,
  isActive: true,
  projectCount: 5,
  viewCount: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const validCategoryBody = {
  name: 'Nueva Categoría',
  slug: 'nueva-categoria',
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/categories', () => {
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

    const { GET } = await import('@/app/api/admin/categories/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
  })

  it('returns paginated categories', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([mockCategory] as any)
    vi.mocked(prisma.category.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/categories/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.data).toHaveLength(1)
    expect(json.data.pagination).toBeDefined()
  })

  it('applies search filter (name, slug)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/categories/route')
    await GET(makeRequest(`${BASE_URL}?search=retrato`))

    expect(prisma.category.findMany).toHaveBeenCalledWith(
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
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/categories/route')
    await GET(makeRequest(`${BASE_URL}?active=true`))

    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      })
    )
  })

  it('defaults pagination values (page 1, limit 50)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/categories/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 50 })
    )
  })

  it('caps limit at 100', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/categories/route')
    await GET(makeRequest(`${BASE_URL}?limit=500`))

    expect(prisma.category.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }))
  })

  it('returns correct pagination metadata', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([mockCategory] as any)
    vi.mocked(prisma.category.count).mockResolvedValueOnce(120)

    const { GET } = await import('@/app/api/admin/categories/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=2&limit=50`))
    const json = await res.json()

    expect(json.data.pagination).toEqual({
      page: 2,
      limit: 50,
      total: 120,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    })
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/categories/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('POST /api/admin/categories', () => {
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

    const { POST } = await import('@/app/api/admin/categories/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validCategoryBody }))
    expect(res.status).toBe(401)
  })

  it('creates category (201)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.category.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 2 } } as any)
    vi.mocked(prisma.category.create).mockResolvedValueOnce(mockCategory as any)

    const { POST } = await import('@/app/api/admin/categories/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validCategoryBody }))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })

  it('returns 400 for missing name', async () => {
    const { POST } = await import('@/app/api/admin/categories/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { slug: 'only-slug' } }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('name')
  })

  it('returns 400 for missing slug', async () => {
    const { POST } = await import('@/app/api/admin/categories/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { name: 'Only Name' } }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('slug')
  })

  it('returns 409 for duplicate slug (with deletedAt: null)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce({ id: 'existing' } as any)

    const { POST } = await import('@/app/api/admin/categories/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validCategoryBody }))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.error).toContain('slug')

    expect(prisma.category.findFirst).toHaveBeenCalledWith({
      where: { slug: 'nueva-categoria', deletedAt: null },
    })
  })

  it('calculates sortOrder from aggregate', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.category.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 7 } } as any)
    vi.mocked(prisma.category.create).mockResolvedValueOnce(mockCategory as any)

    const { POST } = await import('@/app/api/admin/categories/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validCategoryBody }))

    expect(prisma.category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 8 }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.category.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.category.create).mockRejectedValueOnce(new Error('DB crash'))

    const { POST } = await import('@/app/api/admin/categories/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validCategoryBody }))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })

  it('validates required fields (name and slug)', async () => {
    const { POST } = await import('@/app/api/admin/categories/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: {} }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('Campos requeridos')
  })

  it('accepts optional fields (description, thumbnailUrl, iconName, color)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.category.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.category.create).mockResolvedValueOnce(mockCategory as any)

    const { POST } = await import('@/app/api/admin/categories/route')
    const body = {
      ...validCategoryBody,
      description: 'Descripción extra',
      thumbnailUrl: 'https://img.test/cat.jpg',
      iconName: 'camera',
      color: '#FF0000',
    }
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body }))

    expect(res.status).toBe(201)
    expect(prisma.category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          description: 'Descripción extra',
          thumbnailUrl: 'https://img.test/cat.jpg',
          iconName: 'camera',
          color: '#FF0000',
        }),
      })
    )
  })

  it('handles sortOrder when no categories exist (null aggregate)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(null)
    vi.mocked(prisma.category.aggregate).mockResolvedValueOnce({ _max: { sortOrder: null } } as any)
    vi.mocked(prisma.category.create).mockResolvedValueOnce(mockCategory as any)

    const { POST } = await import('@/app/api/admin/categories/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validCategoryBody }))

    expect(prisma.category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 1 }),
      })
    )
  })
})
