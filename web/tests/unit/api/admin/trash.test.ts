import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: { findMany: vi.fn() },
    category: { findMany: vi.fn() },
    service: { findMany: vi.fn() },
    testimonial: { findMany: vi.fn() },
    contact: { findMany: vi.fn() },
    booking: { findMany: vi.fn() },
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

const BASE_URL = 'http://localhost/api/admin/trash'

const mockDeletedProject = {
  id: 'proj-del-1',
  title: 'Deleted Project',
  deletedAt: new Date(),
}

const mockDeletedContact = {
  id: 'contact-del-1',
  name: 'Deleted Contact',
  deletedAt: new Date(),
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/trash', () => {
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

    const { GET } = await import('@/app/api/admin/trash/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
  })

  it('returns all trash grouped by type', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([mockDeletedProject] as any)
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([mockDeletedContact] as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/trash/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.project).toHaveLength(1)
    expect(json.data.contact).toHaveLength(1)
    expect(json.data.category).toHaveLength(0)
  })

  it('filters by specific type', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([mockDeletedProject] as any)

    const { GET } = await import('@/app/api/admin/trash/route')
    const res = await GET(makeRequest(`${BASE_URL}?type=project`))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data.project).toBeDefined()
    // Only project type should be queried
    expect(prisma.project.findMany).toHaveBeenCalled()
  })

  it('returns empty arrays for no trash', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/trash/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.total).toBe(0)
    expect(json.data.project).toEqual([])
    expect(json.data.category).toEqual([])
  })

  it('returns total count', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([
      mockDeletedProject,
      mockDeletedProject,
    ] as any)
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([mockDeletedContact] as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/trash/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.total).toBe(3)
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/trash/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
  })

  it('limits to 100 items per type', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/trash/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }))
  })

  it('returns proper data structure with _type tag', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([mockDeletedProject] as any)
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/trash/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.project[0]._type).toBe('project')
  })

  it('queries all types with deletedAt not null', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.category.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.testimonial.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])

    const { GET } = await import('@/app/api/admin/trash/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: { not: null } },
      })
    )
    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: { not: null } },
      })
    )
  })
})
