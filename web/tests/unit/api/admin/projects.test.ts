import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      count: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/projects'

const mockProject = {
  id: 'proj-1',
  title: 'Test Project',
  slug: 'test-project',
  excerpt: 'A test excerpt',
  thumbnailUrl: 'https://img.test/thumb.jpg',
  date: new Date('2025-01-15'),
  sortOrder: 1,
  isFeatured: false,
  isPinned: false,
  isActive: true,
  viewCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: { id: 'cat-1', name: 'Retratos', slug: 'retratos' },
}

const validProjectBody = {
  title: 'New Project',
  slug: 'new-project',
  description: 'Full description here',
  thumbnailUrl: 'https://img.test/new.jpg',
  categoryId: 'cat-1',
  date: '2025-06-01',
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/projects', () => {
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

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns paginated list of projects', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([mockProject] as any)
    vi.mocked(prisma.project.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.data).toHaveLength(1)
    expect(json.data.pagination).toBeDefined()
  })

  it('applies search filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${BASE_URL}?search=retrato`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ title: { contains: 'retrato', mode: 'insensitive' } }),
          ]),
        }),
      })
    )
  })

  it('applies categoryId filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${BASE_URL}?categoryId=cat-99`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ categoryId: 'cat-99' }),
      })
    )
  })

  it('applies active filter (active=true)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${BASE_URL}?active=true`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      })
    )
  })

  it('applies featured filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${BASE_URL}?featured=true`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isFeatured: true }),
      })
    )
  })

  it('respects page and limit params', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(100)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${BASE_URL}?page=3&limit=10`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 })
    )
  })

  it('caps limit at 50', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${BASE_URL}?limit=200`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }))
  })

  it('defaults to page 1, limit 20', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 20 })
    )
  })

  it('returns correct pagination metadata', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([mockProject] as any)
    vi.mocked(prisma.project.count).mockResolvedValueOnce(45)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=2&limit=20`))
    const json = await res.json()

    expect(json.data.pagination).toEqual({
      page: 2,
      limit: 20,
      total: 45,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    })
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('POST /api/admin/projects', () => {
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

    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validProjectBody }))
    expect(res.status).toBe(401)
  })

  it('creates project successfully (201)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.project.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 3 } } as any)
    vi.mocked(prisma.project.create).mockResolvedValueOnce({
      ...mockProject,
      id: 'new-proj',
    } as any)

    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validProjectBody }))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })

  it('returns 400 for missing required fields', async () => {
    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { title: 'Only title' } }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('Campos requeridos')
  })

  it('returns 409 for duplicate slug', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({ id: 'existing' } as any)

    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validProjectBody }))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.error).toContain('slug')
  })

  it('calculates sortOrder from aggregate', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.project.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 5 } } as any)
    vi.mocked(prisma.project.create).mockResolvedValueOnce(mockProject as any)

    const { POST } = await import('@/app/api/admin/projects/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validProjectBody }))

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 6 }),
      })
    )
  })

  it('assigns createdBy from auth payload', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.project.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.project.create).mockResolvedValueOnce(mockProject as any)

    const { POST } = await import('@/app/api/admin/projects/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validProjectBody }))

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ createdBy: 'admin-1' }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.project.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.project.create).mockRejectedValueOnce(new Error('DB crash'))

    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validProjectBody }))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })

  it('validates slug uniqueness via findUnique', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.project.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.project.create).mockResolvedValueOnce(mockProject as any)

    const { POST } = await import('@/app/api/admin/projects/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validProjectBody }))

    expect(prisma.project.findUnique).toHaveBeenCalledWith({
      where: { slug: 'new-project' },
    })
  })

  it('handles sortOrder when no projects exist (null aggregate)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.project.aggregate).mockResolvedValueOnce({ _max: { sortOrder: null } } as any)
    vi.mocked(prisma.project.create).mockResolvedValueOnce(mockProject as any)

    const { POST } = await import('@/app/api/admin/projects/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validProjectBody }))

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 1 }),
      })
    )
  })
})
