import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: { count: vi.fn(), findUnique: vi.fn() },
    category: { count: vi.fn() },
    service: { count: vi.fn() },
    testimonial: { count: vi.fn() },
    contact: { count: vi.fn() },
    booking: { count: vi.fn() },
    analyticLog: { count: vi.fn(), groupBy: vi.fn(), findFirst: vi.fn() },
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

/**
 * Setup all prisma mocks needed for the 13 parallel queries in the route.
 * Call order in Promise.all:
 *   project.count(active), category.count(active), service.count(active),
 *   testimonial.count(active), contact.count(unread), booking.count(pending),
 *   testimonial.count(pendingTestimonials),
 *   [trash: project.count, category.count, service.count, testimonial.count, contact.count, booking.count],
 *   analyticLog.count(pageViews), analyticLog.count(uniqueVisitors),
 *   analyticLog.groupBy(device), analyticLog.groupBy(countries), analyticLog.groupBy(projects)
 */
async function setupDefaultMocks(overrides: Record<string, number> = {}) {
  const { prisma } = await import('@/lib/db')
  const v = {
    totalProjects: 0,
    totalCategories: 0,
    totalServices: 0,
    totalTestimonials: 0,
    newContacts: 0,
    pendingBookings: 0,
    pendingTestimonials: 0,
    pageViews30d: 0,
    uniqueVisitors30d: 0,
    ...overrides,
  }
  // Active counts
  vi.mocked(prisma.project.count).mockResolvedValueOnce(v.totalProjects)
  vi.mocked(prisma.category.count).mockResolvedValueOnce(v.totalCategories)
  vi.mocked(prisma.service.count).mockResolvedValueOnce(v.totalServices)
  vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(v.totalTestimonials)
  vi.mocked(prisma.contact.count).mockResolvedValueOnce(v.newContacts)
  vi.mocked(prisma.booking.count).mockResolvedValueOnce(v.pendingBookings)
  // pendingTestimonials
  vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(v.pendingTestimonials)
  // Trash counts (6 models)
  vi.mocked(prisma.project.count).mockResolvedValueOnce(0)
  vi.mocked(prisma.category.count).mockResolvedValueOnce(0)
  vi.mocked(prisma.service.count).mockResolvedValueOnce(0)
  vi.mocked(prisma.testimonial.count).mockResolvedValueOnce(0)
  vi.mocked(prisma.contact.count).mockResolvedValueOnce(0)
  vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)
  // analyticLog counts
  vi.mocked(prisma.analyticLog.count).mockResolvedValueOnce(v.pageViews30d)
  vi.mocked(prisma.analyticLog.count).mockResolvedValueOnce(v.uniqueVisitors30d)
  // groupBy: device, countries, projects — all empty
  vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([] as never)
  vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([] as never)
  vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([] as never)
  return prisma
}

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
    await setupDefaultMocks({
      totalProjects: 10,
      totalCategories: 5,
      totalServices: 8,
      totalTestimonials: 12,
      newContacts: 3,
      pendingBookings: 2,
      pageViews30d: 500,
      uniqueVisitors30d: 100,
    })

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.totalProjects).toBe(10)
    expect(json.data.totalCategories).toBe(5)
    expect(json.data.totalServices).toBe(8)
    expect(json.data.totalTestimonials).toBe(12)
    expect(json.data.newContacts).toBe(3)
    expect(json.data.pendingBookings).toBe(2)
    expect(json.data.pageViews30d).toBe(500)
    expect(json.data.uniqueVisitors30d).toBe(100)
    expect(json.data.deviceUsage).toEqual({})
    expect(json.data.topLocations).toEqual([])
    expect(json.data.topProjects).toEqual([])
  })

  it('returns zero for empty DB', async () => {
    await setupDefaultMocks()

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.totalProjects).toBe(0)
    expect(json.data.newContacts).toBe(0)
    expect(json.data.pendingBookings).toBe(0)
    expect(json.data.pageViews30d).toBe(0)
  })

  it('includes newContacts count (unread)', async () => {
    const prisma = await setupDefaultMocks({ newContacts: 7 })

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.newContacts).toBe(7)
    expect(prisma.contact.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isRead: false, deletedAt: null } })
    )
  })

  it('includes pendingBookings count', async () => {
    const prisma = await setupDefaultMocks({ pendingBookings: 4 })

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.pendingBookings).toBe(4)
    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'PENDING', deletedAt: null } })
    )
  })

  it('includes pageViews30d count with correct date range', async () => {
    const prisma = await setupDefaultMocks({ pageViews30d: 1234 })

    const { GET } = await import('@/app/api/admin/analytics/overview/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.pageViews30d).toBe(1234)
    expect(prisma.analyticLog.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          timestamp: { gte: expect.any(Date) },
          eventType: { endsWith: '_VIEW' },
          isBot: false,
        }),
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
