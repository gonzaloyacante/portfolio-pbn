import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: { count: vi.fn() },
    category: { count: vi.fn() },
    service: { count: vi.fn() },
    testimonial: { count: vi.fn() },
    contact: { count: vi.fn() },
    booking: { count: vi.fn() },
    analyticLog: { count: vi.fn() },
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

const BASE_URL = 'http://localhost/api/admin/analytics/overview'

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/analytics/overview', () => {
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

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
  })

  it('returns all counters on success', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValueOnce(10)
    vi.mocked(prisma.category.count).mockResolvedValueOnce(5)
    vi.mocked(prisma.service.count).mockResolvedValueOnce(8)
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(12)
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(3)
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(2)
    vi.mocked(prisma.analyticLog.count).mockResolvedValueOnce(500)

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toEqual({
      totalProjects: 10,
      totalCategories: 5,
      totalServices: 8,
      totalTestimonials: 12,
      newContacts: 3,
      pendingBookings: 2,
      pageViews30d: 500,
    })
  })

  it('returns zero for empty DB', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.analyticLog.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.totalProjects).toBe(0)
    expect(json.data.newContacts).toBe(0)
    expect(json.data.pendingBookings).toBe(0)
    expect(json.data.pageViews30d).toBe(0)
  })

  it('includes newContacts count (unread)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(7)
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.analyticLog.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.newContacts).toBe(7)
    expect(prisma.contact.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isRead: false, deletedAt: null } })
    )
  })

  it('includes pendingBookings count', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(4)
    vi.mocked(prisma.analyticLog.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.pendingBookings).toBe(4)
    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'PENDING', deletedAt: null } })
    )
  })

  it('includes pageViews30d count with correct date range', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.category.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.service.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)
    vi.mocked(prisma.analyticLog.count).mockResolvedValueOnce(1234)

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.pageViews30d).toBe(1234)
    expect(prisma.analyticLog.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { timestamp: { gte: expect.any(Date) } },
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Error interno del servidor')
  })
})
