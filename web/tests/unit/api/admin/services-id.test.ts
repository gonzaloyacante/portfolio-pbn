import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    service: {
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

const BASE_URL = 'http://localhost/api/admin/services/svc-1'

const mockServiceFull = {
  id: 'svc-1',
  name: 'Sesión Retrato',
  slug: 'sesion-retrato',
  description: 'Sesión completa de retrato profesional',
  shortDesc: 'Retrato profesional',
  price: 15000.0,
  priceLabel: 'desde',
  currency: 'ARS',
  duration: '1 hora',
  durationMinutes: 60,
  imageUrl: 'https://img.test/svc.jpg',
  iconName: 'camera',
  color: '#6C0A0A',
  isActive: true,
  isFeatured: false,
  isAvailable: true,
  maxBookingsPerDay: 3,
  advanceNoticeDays: 2,
  sortOrder: 1,
  metaTitle: null,
  metaDescription: null,
  metaKeywords: [],
  requirements: null,
  cancellationPolicy: null,
  bookingCount: 10,
  viewCount: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/services/[id]', () => {
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

    const { GET } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    expect(res.status).toBe(401)
  })

  it('returns service detail on success', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(mockServiceFull as any)

    const { GET } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('svc-1')
  })

  it('returns 404 for non-existent service', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Servicio no encontrado')
  })

  it('filters by deletedAt: null', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    await GET(makeRequest(BASE_URL), { params })

    expect(prisma.service.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'svc-1', deletedAt: null },
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('PATCH /api/admin/services/[id]', () => {
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

    const { PATCH } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { name: 'Updated' } }), {
      params,
    })
    expect(res.status).toBe(401)
  })

  it('updates service successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.update).mockResolvedValueOnce({
      ...mockServiceFull,
      name: 'Updated Service',
    } as any)

    const { PATCH } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { name: 'Updated Service' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Updated Service')
  })

  it('returns 409 for duplicate slug with NOT: { id }', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce({ id: 'other-svc' } as any)

    const { PATCH } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { slug: 'taken-slug' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.error).toContain('slug')

    expect(prisma.service.findFirst).toHaveBeenCalledWith({
      where: { slug: 'taken-slug', deletedAt: null, NOT: { id: 'svc-1' } },
    })
  })

  it('handles partial update (only changed fields)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.update).mockResolvedValueOnce({
      ...mockServiceFull,
      isFeatured: true,
    } as any)

    const { PATCH } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { isFeatured: true } }), { params })

    expect(prisma.service.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isFeatured: true }),
      })
    )
  })

  it('parses price to float on update', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.update).mockResolvedValueOnce(mockServiceFull as any)

    const { PATCH } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { price: '25000.99' } }), { params })

    expect(prisma.service.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ price: 25000.99 }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.update).mockRejectedValueOnce(new Error('DB crash'))

    const { PATCH } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { name: 'X' } }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

describe('DELETE /api/admin/services/[id]', () => {
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

    const { DELETE } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    expect(res.status).toBe(401)
  })

  it('soft deletes service (sets deletedAt)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })

    expect(prisma.service.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'svc-1' },
        data: { deletedAt: expect.any(Date) },
      })
    )
  })

  it('returns success response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Servicio eliminado')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.update).mockRejectedValueOnce(new Error('DB error'))

    const { DELETE } = await import('@/app/api/admin/services/[id]/route')
    const params = Promise.resolve({ id: 'svc-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})
