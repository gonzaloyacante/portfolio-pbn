import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    contact: {
      findMany: vi.fn(),
      count: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/contacts'

const mockContact = {
  id: 'contact-1',
  name: 'María García',
  email: 'maria@example.com',
  phone: '+34 600 123 456',
  subject: 'Consulta sesión fotográfica',
  status: 'NEW',
  priority: 'MEDIUM',
  isRead: false,
  isReplied: false,
  readAt: null,
  repliedAt: null,
  leadScore: 0,
  leadSource: null,
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/contacts', () => {
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

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns paginated contacts', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([mockContact] as any)
    vi.mocked(prisma.contact.count)
      .mockResolvedValueOnce(1) // total
      .mockResolvedValueOnce(1) // unreadCount

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.data).toHaveLength(1)
    expect(json.data.pagination).toBeDefined()
  })

  it('applies search filter (name, email, subject)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    await GET(makeRequest(`${BASE_URL}?search=maria`))

    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: { contains: 'maria', mode: 'insensitive' } }),
            expect.objectContaining({ email: { contains: 'maria', mode: 'insensitive' } }),
            expect.objectContaining({ subject: { contains: 'maria', mode: 'insensitive' } }),
          ]),
        }),
      })
    )
  })

  it('applies status filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    await GET(makeRequest(`${BASE_URL}?status=NEW`))

    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'NEW' }),
      })
    )
  })

  it('applies priority filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    await GET(makeRequest(`${BASE_URL}?priority=HIGH`))

    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ priority: 'HIGH' }),
      })
    )
  })

  it('applies unread filter (isRead: false)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    await GET(makeRequest(`${BASE_URL}?unread=true`))

    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isRead: false }),
      })
    )
  })

  it('returns unreadCount in response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([mockContact] as any)
    vi.mocked(prisma.contact.count)
      .mockResolvedValueOnce(1) // total
      .mockResolvedValueOnce(5) // unreadCount

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.unreadCount).toBe(5)
  })

  it('defaults pagination (page 1, limit 50)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 50 })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })

  it('orders by isRead asc, createdAt desc', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(0).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
      })
    )
  })
})
