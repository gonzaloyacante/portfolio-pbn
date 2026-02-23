import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    category: {
      findFirst: vi.fn(),
      update: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/categories/cat-1'

const mockCategoryFull = {
  id: 'cat-1',
  name: 'Retratos',
  slug: 'retratos',
  description: 'Fotografía de retratos',
  thumbnailUrl: 'https://img.test/cat.jpg',
  coverImageUrl: null,
  iconName: 'camera',
  color: '#6C0A0A',
  metaTitle: null,
  metaDescription: null,
  metaKeywords: [],
  ogImage: null,
  sortOrder: 1,
  isActive: true,
  projectCount: 5,
  viewCount: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/categories/[id]', () => {
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

    const { GET } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    expect(res.status).toBe(401)
  })

  it('returns category detail on success', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(mockCategoryFull as any)

    const { GET } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('cat-1')
  })

  it('returns 404 for non-existent category', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Categoría no encontrada')
  })

  it('filters by deletedAt: null', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    await GET(makeRequest(BASE_URL), { params })

    expect(prisma.category.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'cat-1', deletedAt: null },
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('PATCH /api/admin/categories/[id]', () => {
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

    const { PATCH } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { name: 'Updated' } }), {
      params,
    })
    expect(res.status).toBe(401)
  })

  it('updates category successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValueOnce({
      ...mockCategoryFull,
      name: 'Updated Name',
    } as any)

    const { PATCH } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { name: 'Updated Name' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Updated Name')
  })

  it('returns 409 for duplicate slug with NOT: { id }', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce({ id: 'other-cat' } as any)

    const { PATCH } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { slug: 'taken-slug' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.error).toContain('slug')

    expect(prisma.category.findFirst).toHaveBeenCalledWith({
      where: { slug: 'taken-slug', deletedAt: null, NOT: { id: 'cat-1' } },
    })
  })

  it('handles partial update (only changed fields)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValueOnce({
      ...mockCategoryFull,
      isActive: false,
    } as any)

    const { PATCH } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { isActive: false } }), { params })

    expect(prisma.category.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isActive: false }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockRejectedValueOnce(new Error('DB crash'))

    const { PATCH } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { name: 'X' } }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('DELETE /api/admin/categories/[id]', () => {
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

    const { DELETE } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    expect(res.status).toBe(401)
  })

  it('soft deletes category (sets deletedAt)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })

    expect(prisma.category.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'cat-1' },
        data: { deletedAt: expect.any(Date) },
      })
    )
  })

  it('returns success response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Categoría eliminada')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockRejectedValueOnce(new Error('DB error'))

    const { DELETE } = await import('@/app/api/admin/categories/[id]/route')
    const params = Promise.resolve({ id: 'cat-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})
