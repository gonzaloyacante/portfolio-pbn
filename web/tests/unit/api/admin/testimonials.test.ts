import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    testimonial: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      aggregate: vi.fn(),
      update: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/testimonials'

const mockTestimonial = {
  id: 'test-1',
  name: 'María García',
  text: 'Excelente trabajo fotográfico, muy profesional.',
  excerpt: 'Excelente trabajo',
  position: 'CEO',
  company: 'Studio MG',
  avatarUrl: 'https://img.test/avatar.jpg',
  rating: 5,
  verified: true,
  featured: false,
  status: 'APPROVED',
  isActive: true,
  sortOrder: 1,
  viewCount: 50,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const validTestimonialBody = {
  name: 'Juan Pérez',
  text: 'Un trabajo increíble, totalmente recomendable.',
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/testimonials', () => {
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

    const { GET } = await import('@/app/api/admin/testimonials/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
  })

  it('returns paginated testimonials', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([mockTestimonial] as any)
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/testimonials/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.data).toHaveLength(1)
    expect(json.data.pagination).toBeDefined()
  })

  it('applies search filter (name, text, company)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/testimonials/route')
    await GET(makeRequest(`${BASE_URL}?search=maría`))

    expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: { contains: 'maría', mode: 'insensitive' } }),
            expect.objectContaining({ text: { contains: 'maría', mode: 'insensitive' } }),
            expect.objectContaining({ company: { contains: 'maría', mode: 'insensitive' } }),
          ]),
        }),
      })
    )
  })

  it('applies status filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/testimonials/route')
    await GET(makeRequest(`${BASE_URL}?status=PENDING`))

    expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'PENDING' }),
      })
    )
  })

  it('applies featured filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/testimonials/route')
    await GET(makeRequest(`${BASE_URL}?featured=true`))

    expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ featured: true }),
      })
    )
  })

  it('defaults pagination values (page 1, limit 50)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/testimonials/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 50 })
    )
  })

  it('caps limit at 100', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/testimonials/route')
    await GET(makeRequest(`${BASE_URL}?limit=999`))

    expect(prisma.testimonial.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }))
  })

  it('returns correct pagination metadata', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([mockTestimonial] as any)
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(80)

    const { GET } = await import('@/app/api/admin/testimonials/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=2&limit=30`))
    const json = await res.json()

    expect(json.data.pagination).toEqual({
      page: 2,
      limit: 30,
      total: 80,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    })
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findMany).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/testimonials/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('POST /api/admin/testimonials', () => {
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

    const { POST } = await import('@/app/api/admin/testimonials/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validTestimonialBody }))
    expect(res.status).toBe(401)
  })

  it('creates testimonial (201)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 2 } } as any)
    vi.mocked(prisma.testimonial.create).mockResolvedValueOnce(mockTestimonial as any)

    const { POST } = await import('@/app/api/admin/testimonials/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validTestimonialBody }))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })

  it('returns 400 for missing name', async () => {
    const { POST } = await import('@/app/api/admin/testimonials/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { text: 'Only text' } }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('name')
  })

  it('returns 400 for missing text', async () => {
    const { POST } = await import('@/app/api/admin/testimonials/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: { name: 'Only Name' } }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('text')
  })

  it('defaults rating to 5', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.testimonial.create).mockResolvedValueOnce(mockTestimonial as any)

    const { POST } = await import('@/app/api/admin/testimonials/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validTestimonialBody }))

    expect(prisma.testimonial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ rating: 5 }),
      })
    )
  })

  it('defaults isActive to true', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.testimonial.create).mockResolvedValueOnce(mockTestimonial as any)

    const { POST } = await import('@/app/api/admin/testimonials/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validTestimonialBody }))

    expect(prisma.testimonial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isActive: true }),
      })
    )
  })

  it('defaults status to PENDING', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.testimonial.create).mockResolvedValueOnce(mockTestimonial as any)

    const { POST } = await import('@/app/api/admin/testimonials/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validTestimonialBody }))

    expect(prisma.testimonial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'PENDING' }),
      })
    )
  })

  it('calculates sortOrder from aggregate', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 5 } } as any)
    vi.mocked(prisma.testimonial.create).mockResolvedValueOnce(mockTestimonial as any)

    const { POST } = await import('@/app/api/admin/testimonials/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validTestimonialBody }))

    expect(prisma.testimonial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 6 }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.testimonial.create).mockRejectedValueOnce(new Error('DB crash'))

    const { POST } = await import('@/app/api/admin/testimonials/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validTestimonialBody }))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })

  it('accepts optional fields (position, company, avatarUrl, etc.)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.aggregate).mockResolvedValueOnce({ _max: { sortOrder: 0 } } as any)
    vi.mocked(prisma.testimonial.create).mockResolvedValueOnce(mockTestimonial as any)

    const { POST } = await import('@/app/api/admin/testimonials/route')
    const body = {
      ...validTestimonialBody,
      position: 'CTO',
      company: 'Test Corp',
      avatarUrl: 'https://img.test/avatar.jpg',
      rating: 4,
      featured: true,
    }
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body }))

    expect(res.status).toBe(201)
    expect(prisma.testimonial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          position: 'CTO',
          company: 'Test Corp',
          avatarUrl: 'https://img.test/avatar.jpg',
          rating: 4,
          featured: true,
        }),
      })
    )
  })

  it('handles sortOrder when no testimonials exist (null aggregate)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.aggregate).mockResolvedValueOnce({
      _max: { sortOrder: null },
    } as any)
    vi.mocked(prisma.testimonial.create).mockResolvedValueOnce(mockTestimonial as any)

    const { POST } = await import('@/app/api/admin/testimonials/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validTestimonialBody }))

    expect(prisma.testimonial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 1 }),
      })
    )
  })
})

// ── Testimonial [id] tests ────────────────────────────────────────────────────

describe('GET /api/admin/testimonials/[id]', () => {
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

    const { GET } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await GET(makeRequest(`${BASE_URL}/test-1`), { params })
    expect(res.status).toBe(401)
  })

  it('returns testimonial detail on success', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(mockTestimonial as any)

    const { GET } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await GET(makeRequest(`${BASE_URL}/test-1`), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('test-1')
  })

  it('returns 404 for non-existent testimonial', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await GET(makeRequest(`${BASE_URL}/non-existent`), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Testimonio no encontrado')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await GET(makeRequest(`${BASE_URL}/test-1`), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('PATCH /api/admin/testimonials/[id]', () => {
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

    const { PATCH } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/test-1`, { method: 'PATCH', body: { name: 'Updated' } }),
      { params }
    )
    expect(res.status).toBe(401)
  })

  it('updates testimonial successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(mockTestimonial as any)
    vi.mocked(prisma.testimonial.update).mockResolvedValueOnce({
      ...mockTestimonial,
      name: 'Updated Name',
    } as any)

    const { PATCH } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/test-1`, { method: 'PATCH', body: { name: 'Updated Name' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Updated Name')
  })

  it('returns 404 when testimonial does not exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(null)

    const { PATCH } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/non-existent`, { method: 'PATCH', body: { name: 'X' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Testimonio no encontrado')
  })

  it('sets moderatedBy and moderatedAt when status changes', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce({
      ...mockTestimonial,
      status: 'PENDING',
    } as any)
    vi.mocked(prisma.testimonial.update).mockResolvedValueOnce({
      ...mockTestimonial,
      status: 'APPROVED',
    } as any)

    const { PATCH } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    await PATCH(
      makeRequest(`${BASE_URL}/test-1`, { method: 'PATCH', body: { status: 'APPROVED' } }),
      { params }
    )

    expect(prisma.testimonial.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'APPROVED',
          moderatedAt: expect.any(Date),
        }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(mockTestimonial as any)
    vi.mocked(prisma.testimonial.update).mockRejectedValueOnce(new Error('DB crash'))

    const { PATCH } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await PATCH(
      makeRequest(`${BASE_URL}/test-1`, { method: 'PATCH', body: { name: 'X' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('DELETE /api/admin/testimonials/[id]', () => {
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

    const { DELETE } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await DELETE(makeRequest(`${BASE_URL}/test-1`, { method: 'DELETE' }), { params })
    expect(res.status).toBe(401)
  })

  it('soft deletes testimonial (sets deletedAt)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(mockTestimonial as any)
    vi.mocked(prisma.testimonial.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    await DELETE(makeRequest(`${BASE_URL}/test-1`, { method: 'DELETE' }), { params })

    expect(prisma.testimonial.update).toHaveBeenCalledWith({
      where: { id: 'test-1' },
      data: { deletedAt: expect.any(Date) },
    })
  })

  it('returns 404 when testimonial not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(null)

    const { DELETE } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await DELETE(makeRequest(`${BASE_URL}/non-existent`, { method: 'DELETE' }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Testimonio no encontrado')
  })

  it('returns success response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(mockTestimonial as any)
    vi.mocked(prisma.testimonial.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await DELETE(makeRequest(`${BASE_URL}/test-1`, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Testimonio eliminado')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findFirst).mockResolvedValueOnce(mockTestimonial as any)
    vi.mocked(prisma.testimonial.update).mockRejectedValueOnce(new Error('DB error'))

    const { DELETE } = await import('@/app/api/admin/testimonials/[id]/route')
    const params = Promise.resolve({ id: 'test-1' })
    const res = await DELETE(makeRequest(`${BASE_URL}/test-1`, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})
