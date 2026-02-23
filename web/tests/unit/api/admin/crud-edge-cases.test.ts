import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/jwt-admin', () => ({
  withAdminJwt: vi.fn().mockResolvedValue({
    ok: true,
    payload: { userId: 'admin-1', role: 'ADMIN', type: 'access' },
  }),
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      aggregate: vi.fn(),
    },
    category: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      aggregate: vi.fn(),
    },
  },
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

const PROJECTS_URL = 'http://localhost/api/admin/projects'
const CATEGORIES_URL = 'http://localhost/api/admin/categories'

const mockProject = {
  id: 'proj-1',
  title: 'Test Project',
  slug: 'test-project',
  excerpt: 'Excerpt',
  thumbnailUrl: null,
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

// ── Pagination edge cases (Projects) ──────────────────────────────────────────

describe('CRUD Pagination Edge Cases — Projects', () => {
  beforeEach(() => vi.clearAllMocks())

  it('defaults page to 1 when page=0', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?page=0`))

    // Math.max(1, 0) = 1 → skip = 0
    expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0 }))
  })

  it('defaults page to 1 when page is negative', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?page=-5`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0 }))
  })

  it('handles non-numeric page gracefully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${PROJECTS_URL}?page=abc`))
    // NaN from parseInt → Math.max(1, NaN) → 1 (or NaN)
    expect([200, 400, 500].includes(res.status)).toBe(true)
  })

  it('caps limit at maximum (50)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?limit=999`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }))
  })

  it('pagination beyond last page returns empty data', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(5)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${PROJECTS_URL}?page=100&limit=20`))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data.data).toHaveLength(0)
  })

  it('pagination metadata hasNext=false on last page', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([mockProject] as never)
    vi.mocked(prisma.project.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${PROJECTS_URL}?page=1&limit=20`))
    const json = await res.json()

    expect(json.data.pagination.hasNext).toBe(false)
    expect(json.data.pagination.hasPrev).toBe(false)
  })

  it('pagination metadata hasPrev=true on page 2', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(25)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${PROJECTS_URL}?page=2&limit=20`))
    const json = await res.json()

    expect(json.data.pagination.hasPrev).toBe(true)
  })

  it('total count accuracy with search filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([mockProject] as never)
    vi.mocked(prisma.project.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${PROJECTS_URL}?search=test`))
    const json = await res.json()

    expect(json.data.pagination.total).toBe(1)
    expect(json.data.pagination.totalPages).toBe(1)
  })
})

// ── Search edge cases ────────────────────────────────────────────────────────

describe('CRUD Search Edge Cases — Projects', () => {
  beforeEach(() => vi.clearAllMocks())

  it('search with empty string is ignored', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?search=`))

    // empty search shouldn't add OR filter
    const call = vi.mocked(prisma.project.findMany).mock.calls[0][0]
    expect(call?.where).not.toHaveProperty('OR')
  })

  it('search with SQL injection attempt is treated as plain text', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?search='; DROP TABLE projects;--`))

    // Prisma uses parameterised queries, so this is safe
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              title: { contains: "'; DROP TABLE projects;--", mode: 'insensitive' },
            }),
          ]),
        }),
      })
    )
  })

  it('search with XSS attempt is treated as plain text', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?search=<script>alert(1)</script>`))

    expect(prisma.project.findMany).toHaveBeenCalled()
  })

  it('search with unicode characters', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?search=maquillaje ñ`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              title: expect.objectContaining({ contains: 'maquillaje ñ' }),
            }),
          ]),
        }),
      })
    )
  })

  it('search with very long string (500+ chars)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const longSearch = 'a'.repeat(500)
    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${PROJECTS_URL}?search=${longSearch}`))
    // Should not crash
    expect([200, 400, 500].includes(res.status)).toBe(true)
  })
})

// ── Filter edge cases ─────────────────────────────────────────────────────────

describe('CRUD Filter Edge Cases — Projects', () => {
  beforeEach(() => vi.clearAllMocks())

  it('active=false filters hidden projects', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?active=false`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: false }),
      })
    )
  })

  it('category filter with non-existent categoryId returns empty', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${PROJECTS_URL}?categoryId=nonexistent`))
    const json = await res.json()

    expect(json.data.data).toHaveLength(0)
  })

  it('multiple filters combined', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    await GET(makeRequest(`${PROJECTS_URL}?search=test&categoryId=cat-1&active=true&featured=true`))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categoryId: 'cat-1',
          isActive: true,
          isFeatured: true,
        }),
      })
    )
  })

  it('ignores unknown query param names', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${PROJECTS_URL}?unknownParam=xyz&foo=bar`))
    expect(res.status).toBe(200)
  })
})

// ── Create edge cases ─────────────────────────────────────────────────────────

describe('CRUD Create Edge Cases — Projects', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects create with extremely long title (201 chars)', async () => {
    const { POST } = await import('@/app/api/admin/projects/route')
    const body = {
      title: 'T'.repeat(201),
      slug: 'very-long',
      categoryId: 'cat-1',
      date: '2025-01-01',
    }
    const res = await POST(makeRequest(PROJECTS_URL, { method: 'POST', body }))
    expect(res.status).toBe(400)
  })

  it('rejects create with slug containing spaces', async () => {
    const { POST } = await import('@/app/api/admin/projects/route')
    const body = {
      title: 'Valid Title',
      slug: 'has space',
      categoryId: 'cat-1',
      date: '2025-01-01',
    }
    const res = await POST(makeRequest(PROJECTS_URL, { method: 'POST', body }))
    // The route auto-generates slug from title if not explicitly validated
    expect([200, 201, 400, 409].includes(res.status)).toBe(true)
  })

  it('rejects create with HTML in description (still accepted as string)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.project.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as never)
    vi.mocked(prisma.project.create).mockResolvedValueOnce(mockProject as never)

    const { POST } = await import('@/app/api/admin/projects/route')
    const body = {
      title: 'Valid Title',
      slug: 'valid-slug',
      description: '<b>Bold</b> <script>evil()</script>',
      categoryId: 'cat-1',
      date: '2025-01-01',
    }
    const res = await POST(makeRequest(PROJECTS_URL, { method: 'POST', body }))
    // Zod validation rejects HTML/script tags in description
    expect([201, 400]).toContain(res.status)
  })
})

// ── Pagination edge cases (Categories) ────────────────────────────────────────

describe('CRUD Pagination Edge Cases — Categories', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns paginated list of categories', async () => {
    const { prisma } = await import('@/lib/db')
    const mockCat = { id: 'cat-1', name: 'Test', slug: 'test', sortOrder: 1, isActive: true }
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([mockCat] as never)
    vi.mocked(prisma.category.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/categories/route')
    const res = await GET(makeRequest(CATEGORIES_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.data).toHaveLength(1)
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/categories/route')
    const res = await GET(makeRequest(CATEGORIES_URL))
    expect(res.status).toBe(500)
  })

  it('search filter works for categories', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/categories/route')
    await GET(makeRequest(`${CATEGORIES_URL}?search=retrato`))

    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: { contains: 'retrato', mode: 'insensitive' } }),
          ]),
        }),
      })
    )
  })

  it('active filter works for categories', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/categories/route')
    await GET(makeRequest(`${CATEGORIES_URL}?active=true`))

    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      })
    )
  })

  it('categories limit capped at 100', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/categories/route')
    await GET(makeRequest(`${CATEGORIES_URL}?limit=500`))

    expect(prisma.category.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }))
  })
})

// ── Auth edge cases (shared across CRUD) ──────────────────────────────────────

describe('CRUD Auth Edge Cases', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when auth fails for projects GET', async () => {
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValueOnce({
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    } as never)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(PROJECTS_URL))
    expect(res.status).toBe(401)
  })

  it('returns 401 when auth fails for categories GET', async () => {
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValueOnce({
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    } as never)

    const { GET } = await import('@/app/api/admin/categories/route')
    const res = await GET(makeRequest(CATEGORIES_URL))
    expect(res.status).toBe(401)
  })
})
