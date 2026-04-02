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

const CATEGORIES_URL = 'http://localhost/api/admin/categories'

// ── Pagination edge cases (Categories) ────────────────────────────────────────

describe('CRUD Pagination Edge Cases — Categories', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns paginated list of categories', async () => {
    const { prisma } = await import('@/lib/db')
    const mockCat = {
      id: 'cat-1',
      name: 'Test',
      slug: 'test',
      sortOrder: 1,
      isActive: true,
      _count: { images: 0 },
    }
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
