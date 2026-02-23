import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/projects/proj-1'

const mockProjectFull = {
  id: 'proj-1',
  title: 'Test Project',
  slug: 'test-project',
  description: 'Full description',
  excerpt: 'Excerpt',
  thumbnailUrl: 'https://img.test/thumb.jpg',
  videoUrl: null,
  date: new Date('2025-01-15'),
  duration: null,
  client: null,
  location: null,
  tags: [],
  metaTitle: null,
  metaDescription: null,
  metaKeywords: [],
  ogImage: null,
  categoryId: 'cat-1',
  sortOrder: 1,
  isFeatured: false,
  isPinned: false,
  isActive: true,
  viewCount: 0,
  likeCount: 0,
  publishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: { id: 'cat-1', name: 'Retratos', slug: 'retratos' },
  images: [],
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/projects/[id]', () => {
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

    const { GET } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    expect(res.status).toBe(401)
  })

  it('returns project detail on success', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)

    const { GET } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('proj-1')
  })

  it('returns 404 for non-existent project', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Proyecto no encontrado')
  })

  it('returns 404 for deleted project (isDeleted: true filtered by findFirst)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'deleted-proj' })
    const res = await GET(makeRequest(BASE_URL), { params })

    expect(res.status).toBe(404)
    expect(prisma.project.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'deleted-proj', isDeleted: false },
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('PATCH /api/admin/projects/[id]', () => {
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

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { title: 'Updated' } }),
      { params }
    )
    expect(res.status).toBe(401)
  })

  it('updates project successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce({
      ...mockProjectFull,
      title: 'Updated Title',
    } as any)

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { title: 'Updated Title' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.title).toBe('Updated Title')
  })

  it('returns 409 for duplicate slug (excluding self)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst)
      .mockResolvedValueOnce(mockProjectFull as any) // existing check
      .mockResolvedValueOnce({ id: 'other-proj', slug: 'taken-slug' } as any) // slug conflict

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { slug: 'taken-slug' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.error).toContain('slug')
  })

  it('handles partial update (only changed fields)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce({
      ...mockProjectFull,
      isFeatured: true,
    } as any)

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { isFeatured: true } }), { params })

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isFeatured: true, updatedBy: 'admin-1' }),
      })
    )
  })

  it('assigns updatedBy from auth payload', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce(mockProjectFull as any)

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { title: 'X' } }), { params })

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ updatedBy: 'admin-1' }),
      })
    )
  })

  it('returns 404 when project does not exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null)

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { title: 'X' } }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Proyecto no encontrado')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockRejectedValueOnce(new Error('DB crash'))

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { title: 'X' } }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('DELETE /api/admin/projects/[id]', () => {
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

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    expect(res.status).toBe(401)
  })

  it('soft deletes project (sets isDeleted, deletedAt, deletedBy)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'proj-1' },
        data: expect.objectContaining({
          isDeleted: true,
          deletedAt: expect.any(Date),
          deletedBy: 'admin-1',
        }),
      })
    )
  })

  it('sets isActive to false on delete', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isActive: false }),
      })
    )
  })

  it('returns success response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Proyecto eliminado')
  })

  it('assigns deletedBy from auth payload', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ deletedBy: 'admin-1' }),
      })
    )
  })

  it('returns 404 when project does not exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null)

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Proyecto no encontrado')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockProjectFull as any)
    vi.mocked(prisma.project.update).mockRejectedValueOnce(new Error('DB error'))

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const params = Promise.resolve({ id: 'proj-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})
