import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    analyticLog: {
      findMany: vi.fn(),
    },
    booking: {
      findMany: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/analytics/charts'

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/analytics/charts', () => {
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

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
  })

  it('returns chart data structure', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toHaveProperty('dailyPageViews')
    expect(json.data).toHaveProperty('monthlyBookings')
  })

  it('returns correct number of day labels (7)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.dailyPageViews).toHaveLength(7)
  })

  it('returns correct number of month labels (6)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.monthlyBookings).toHaveLength(6)
  })

  it('handles empty data gracefully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    // All counts should be 0 when no data
    for (const day of json.data.dailyPageViews) {
      expect(day.count).toBe(0)
      expect(day.label).toBeDefined()
    }
    for (const month of json.data.monthlyBookings) {
      expect(month.count).toBe(0)
      expect(month.label).toBeDefined()
    }
  })

  it('data arrays match label arrays length', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([{ timestamp: new Date() }] as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([{ date: new Date() }] as any)

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.dailyPageViews.length).toBe(7)
    expect(json.data.monthlyBookings.length).toBe(6)
    // Each entry has label and count
    expect(json.data.dailyPageViews[0]).toHaveProperty('label')
    expect(json.data.dailyPageViews[0]).toHaveProperty('count')
    expect(json.data.monthlyBookings[0]).toHaveProperty('label')
    expect(json.data.monthlyBookings[0]).toHaveProperty('count')
  })

  it('counts page views correctly for today', async () => {
    const now = new Date()
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([
      { timestamp: now },
      { timestamp: now },
      { timestamp: now },
    ] as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    // The last day entry (today) should have count 3
    const todayEntry = json.data.dailyPageViews[6]
    expect(todayEntry.count).toBe(3)
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.findMany).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Error interno del servidor')
  })
})
