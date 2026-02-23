import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}))

vi.mock('@/lib/jwt-admin', () => ({
  withAdminJwt: vi.fn().mockResolvedValue({
    ok: true,
    payload: { userId: 'admin-1', role: 'ADMIN', type: 'access', email: 'admin@test.com' },
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

beforeEach(() => {
  vi.clearAllMocks()
})

// ============================================
// GET /api/admin/projects — extended filters
// ============================================

describe('GET /api/admin/projects — extended filters', () => {
  it('GET with categoryId filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?categoryId=cat-1`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ categoryId: 'cat-1' }),
      })
    )
  })

  it('GET with active=true filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?active=true`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      })
    )
  })

  it('GET with active=false filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?active=false`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: false }),
      })
    )
  })

  it('GET with search filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?search=wedding`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ title: expect.objectContaining({ contains: 'wedding' }) }),
          ]),
        }),
      })
    )
  })

  it('GET with combined filters', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?search=test&categoryId=cat-1&active=true`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categoryId: 'cat-1',
          isActive: true,
        }),
      })
    )
  })

  it('GET with featured=true filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?featured=true`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isFeatured: true }),
      })
    )
  })

  it('GET with page=2 and limit=5 pagination', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(20)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=2&limit=5`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.pagination.page).toBe(2)
    expect(json.data.pagination.limit).toBe(5)
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 })
    )
  })

  it('GET page clamped to 1 when negative', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=-1`))
    const json = await res.json()

    expect(json.data.pagination.page).toBe(1)
  })

  it('GET limit clamped to 50 max', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?limit=100`))
    const json = await res.json()

    expect(json.data.pagination.limit).toBe(50)
  })

  it('GET returns hasNext=true when more pages exist', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(30)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=1&limit=20`))
    const json = await res.json()

    expect(json.data.pagination.hasNext).toBe(true)
  })

  it('GET returns hasPrev=false on page 1', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(5)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=1`))
    const json = await res.json()

    expect(json.data.pagination.hasPrev).toBe(false)
  })

  it('GET returns hasPrev=true on page 2', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(30)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=2&limit=10`))
    const json = await res.json()

    expect(json.data.pagination.hasPrev).toBe(true)
  })

  it('GET returns correct totalPages', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(47)

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(`${BASE_URL}?limit=10`))
    const json = await res.json()

    expect(json.data.pagination.totalPages).toBe(5)
  })

  it('GET handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/projects/route')
    const res = await GET(makeRequest(BASE_URL))

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})

// ============================================
// POST /api/admin/projects — extended
// ============================================

describe('POST /api/admin/projects — extended', () => {
  const validProject = {
    title: 'New Project',
    slug: 'new-project',
    description: 'A test project',
    thumbnailUrl: 'https://img.test/thumb.jpg',
    categoryId: 'cat-1',
    date: '2025-06-15',
  }

  it('POST creates project with all required fields', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.project.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue({
      _max: { sortOrder: 3 },
    })
    ;(prisma.project.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...validProject,
      id: 'proj-new',
    })

    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validProject }))

    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('POST returns 400 when title is missing', async () => {
    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { ...validProject, title: undefined } })
    )

    expect(res.status).toBe(400)
  })

  it('POST returns 400 when slug is missing', async () => {
    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { ...validProject, slug: undefined } })
    )

    expect(res.status).toBe(400)
  })

  it('POST returns 409 when slug already exists', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'existing' })

    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validProject }))

    expect(res.status).toBe(409)
  })

  it('POST assigns sortOrder as max + 1', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.project.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue({
      _max: { sortOrder: 5 },
    })
    ;(prisma.project.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'x' })

    const { POST } = await import('@/app/api/admin/projects/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validProject }))

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 6 }),
      })
    )
  })

  it('POST sets sortOrder to 1 when no previous projects', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.project.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue({
      _max: { sortOrder: null },
    })
    ;(prisma.project.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'x' })

    const { POST } = await import('@/app/api/admin/projects/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validProject }))

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 1 }),
      })
    )
  })

  it('POST includes createdBy from auth payload', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.project.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue({
      _max: { sortOrder: 0 },
    })
    ;(prisma.project.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'x' })

    const { POST } = await import('@/app/api/admin/projects/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validProject }))

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ createdBy: 'admin-1' }),
      })
    )
  })

  it('POST passes optional fields to create', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.project.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue({
      _max: { sortOrder: 0 },
    })
    ;(prisma.project.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'x' })

    const body = {
      ...validProject,
      excerpt: 'Short desc',
      client: 'Client X',
      location: 'Madrid',
      isFeatured: true,
    }
    const { POST } = await import('@/app/api/admin/projects/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body }))

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          excerpt: 'Short desc',
          client: 'Client X',
          isFeatured: true,
        }),
      })
    )
  })

  it('POST handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.project.aggregate as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

    const { POST } = await import('@/app/api/admin/projects/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validProject }))

    expect(res.status).toBe(500)
  })
})

// ============================================
// PATCH /api/admin/projects/[id] — extended
// ============================================

describe('PATCH & DELETE /api/admin/projects/[id] — extended', () => {
  const mockExisting = { id: 'proj-1', slug: 'test', isDeleted: false }

  it('PATCH returns 404 when project not found', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/proj-999`, { method: 'PATCH', body: { title: 'Updated' } }),
      { params: Promise.resolve({ id: 'proj-999' }) }
    )

    expect(res.status).toBe(404)
  })

  it('PATCH updates only provided fields', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockExisting)
    ;(prisma.project.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockExisting,
      title: 'Updated',
    })

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/proj-1`, { method: 'PATCH', body: { title: 'Updated' } }),
      { params: Promise.resolve({ id: 'proj-1' }) }
    )

    expect(res.status).toBe(200)
    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Updated' }),
      })
    )
  })

  it('PATCH returns 409 on slug conflict', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockExisting) // existing project
      .mockResolvedValueOnce({ id: 'other', slug: 'taken' }) // slug conflict

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/proj-1`, { method: 'PATCH', body: { slug: 'taken' } }),
      { params: Promise.resolve({ id: 'proj-1' }) }
    )

    expect(res.status).toBe(409)
  })

  it('PATCH toggles isActive', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockExisting)
    ;(prisma.project.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockExisting,
      isActive: false,
    })

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    await PATCH(makeRequest(`${BASE_URL}/proj-1`, { method: 'PATCH', body: { isActive: false } }), {
      params: Promise.resolve({ id: 'proj-1' }),
    })

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isActive: false }),
      })
    )
  })

  it('PATCH toggles isFeatured', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockExisting)
    ;(prisma.project.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockExisting,
      isFeatured: true,
    })

    const { PATCH } = await import('@/app/api/admin/projects/[id]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/proj-1`, { method: 'PATCH', body: { isFeatured: true } }),
      { params: Promise.resolve({ id: 'proj-1' }) }
    )

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isFeatured: true }),
      })
    )
  })

  it('DELETE soft deletes project', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockExisting)
    ;(prisma.project.update as ReturnType<typeof vi.fn>).mockResolvedValue({})

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const res = await DELETE(makeRequest(`${BASE_URL}/proj-1`, { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'proj-1' }),
    })

    expect(res.status).toBe(200)
    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isDeleted: true, isActive: false }),
      })
    )
  })

  it('DELETE returns 404 for nonexistent project', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { DELETE } = await import('@/app/api/admin/projects/[id]/route')
    const res = await DELETE(makeRequest(`${BASE_URL}/proj-notfound`, { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'proj-notfound' }),
    })

    expect(res.status).toBe(404)
  })

  it('GET single project by ID', async () => {
    const { prisma } = await import('@/lib/db')
    const project = { id: 'proj-1', title: 'Test', slug: 'test', images: [] }
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(project)

    const { GET } = await import('@/app/api/admin/projects/[id]/route')
    const res = await GET(makeRequest(`${BASE_URL}/proj-1`), {
      params: Promise.resolve({ id: 'proj-1' }),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.id).toBe('proj-1')
  })

  it('GET single project returns 404 when not found', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { GET } = await import('@/app/api/admin/projects/[id]/route')
    const res = await GET(makeRequest(`${BASE_URL}/proj-404`), {
      params: Promise.resolve({ id: 'proj-404' }),
    })

    expect(res.status).toBe(404)
  })
})
