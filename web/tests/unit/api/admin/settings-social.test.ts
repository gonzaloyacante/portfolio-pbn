import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    socialLink: {
      findMany: vi.fn(),
      upsert: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/settings/social'

const mockSocialLink = {
  id: 'social-1',
  platform: 'instagram',
  url: 'https://instagram.com/paola',
  username: '@paola',
  icon: 'instagram',
  isActive: true,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ── Tests: GET ────────────────────────────────────────────────────────────────

describe('GET /api/admin/settings/social', () => {
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

    const { GET } = await import('@/app/api/admin/settings/social/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
  })

  it('returns list of social links', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.socialLink.findMany).mockResolvedValueOnce([mockSocialLink] as any)

    const { GET } = await import('@/app/api/admin/settings/social/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].platform).toBe('instagram')
  })

  it('returns ordered by sortOrder', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.socialLink.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/settings/social/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.socialLink.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { sortOrder: 'asc' } })
    )
  })

  it('returns empty array when no links', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.socialLink.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/settings/social/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data).toEqual([])
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.socialLink.findMany).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/settings/social/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
  })
})

// ── Tests: POST ───────────────────────────────────────────────────────────────

describe('POST /api/admin/settings/social', () => {
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

    const { POST } = await import('@/app/api/admin/settings/social/route')
    const res = await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { platform: 'instagram', url: 'https://instagram.com/paola' },
      })
    )
    expect(res.status).toBe(401)
  })

  it('creates/updates social link (201)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.socialLink.upsert).mockResolvedValueOnce(mockSocialLink as any)

    const { POST } = await import('@/app/api/admin/settings/social/route')
    const res = await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { platform: 'instagram', url: 'https://instagram.com/paola' },
      })
    )
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data.platform).toBe('instagram')
  })

  it('returns 400 when platform is missing', async () => {
    const { POST } = await import('@/app/api/admin/settings/social/route')
    const res = await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { url: 'https://instagram.com/paola' },
      })
    )
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('platform')
  })

  it('returns 400 when url is missing', async () => {
    const { POST } = await import('@/app/api/admin/settings/social/route')
    const res = await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { platform: 'instagram' },
      })
    )
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.socialLink.upsert).mockRejectedValueOnce(new Error('DB crash'))

    const { POST } = await import('@/app/api/admin/settings/social/route')
    const res = await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { platform: 'instagram', url: 'https://instagram.com/paola' },
      })
    )
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
  })
})
