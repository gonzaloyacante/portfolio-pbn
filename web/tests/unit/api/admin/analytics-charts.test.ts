import { describe, it, expect, vi, beforeEach } from 'vitest'

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

function makeRequest(url: string) {
  return new Request(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
  })
}

const BASE_URL = 'http://localhost/api/admin/analytics/charts'

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
    } as never)

    const { GET } = await import('@/app/api/admin/analytics/charts/route')
    const res = await GET(makeRequest(BASE_URL))

    expect(res.status).toBe(401)
  })

  it('returns empty analytics data without querying the database', async () => {
    const { prisma } = await import('@/lib/db')
    const { GET } = await import('@/app/api/admin/analytics/charts/route')

    const res = await GET(makeRequest(`${BASE_URL}?days=30&months=12`))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toEqual({
      success: true,
      data: {
        dailyPageViews: [],
        monthlyBookings: [],
        analyticsDisabled: true,
      },
    })
    expect(prisma.$queryRaw).not.toHaveBeenCalled()
  })
})
