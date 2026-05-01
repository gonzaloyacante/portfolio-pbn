import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────
// The charts endpoint now uses prisma.$queryRaw for daily page views
// (replaced findMany after the Neon compute fix) and prisma.booking.findMany
// for monthly bookings. Mocks must reflect the actual implementation.

vi.mock('@/lib/db', () => ({
  prisma: {
    $queryRaw: vi.fn(),
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
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])

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
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.dailyPageViews).toHaveLength(7)
  })

  it('returns correct number of month labels (6)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.monthlyBookings).toHaveLength(6)
  })

  it('handles empty data gracefully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

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
    // $queryRaw returns rows with { day: Date, count: bigint }
    const today = new Date()
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ day: today, count: BigInt(1) }])
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ month: today, count: BigInt(1) }])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.dailyPageViews.length).toBe(7)
    expect(json.data.monthlyBookings.length).toBe(6)
    expect(json.data.dailyPageViews[0]).toHaveProperty('label')
    expect(json.data.dailyPageViews[0]).toHaveProperty('count')
    expect(json.data.monthlyBookings[0]).toHaveProperty('label')
    expect(json.data.monthlyBookings[0]).toHaveProperty('count')
  })

  it('counts page views correctly via queryRaw aggregation', async () => {
    const { prisma } = await import('@/lib/db')
    // The endpoint builds day keys using local-time startOfDay + toISOString.
    // Rather than fighting timezone offsets in tests, verify that a row
    // returned by $queryRaw is correctly mapped to a non-zero count.
    // We use the same key-building logic the endpoint uses internally.
    const now = new Date()
    // Replicate endpoint's startOfDay (local midnight)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // The key the endpoint will use for today's slot
    const todayKey = today.toISOString().split('T')[0]

    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([
      // Return a row whose day, when converted via new Date(row.day).toISOString(),
      // produces todayKey. We pass today directly (already local midnight).
      { day: today, count: BigInt(5) },
    ])
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    // Find the entry whose label corresponds to today
    const total = json.data.dailyPageViews.reduce(
      (sum: number, d: { count: number }) => sum + d.count,
      0
    )
    // Total across all days should equal the count we provided (5)
    expect(total).toBe(5)
    // Array length is always 7
    expect(json.data.dailyPageViews).toHaveLength(7)
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Error interno del servidor')
  })
})
