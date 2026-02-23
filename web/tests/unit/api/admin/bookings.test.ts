import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    booking: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/bookings'

const mockBooking = {
  id: 'booking-1',
  date: new Date('2025-03-15'),
  endDate: null,
  status: 'PENDING',
  clientName: 'Carlos Ruiz',
  clientEmail: 'carlos@example.com',
  clientPhone: '+34 600 999 888',
  guestCount: 1,
  totalAmount: 150.0,
  paymentStatus: 'PENDING',
  serviceId: 'svc-1',
  service: { name: 'Sesión Retrato' },
  createdAt: new Date(),
  updatedAt: new Date(),
}

const validBookingBody = {
  date: '2025-06-01',
  clientName: 'Ana López',
  clientEmail: 'ana@example.com',
  serviceId: 'svc-1',
}

// ── Tests: GET ────────────────────────────────────────────────────────────────

describe('GET /api/admin/bookings', () => {
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

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(BASE_URL))
    expect(res.status).toBe(401)
  })

  it('returns paginated bookings', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([mockBooking] as any)
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.data).toHaveLength(1)
    expect(json.data.pagination).toBeDefined()
  })

  it('applies search filter (clientName, clientEmail)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    await GET(makeRequest(`${BASE_URL}?search=carlos`))

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ clientName: { contains: 'carlos', mode: 'insensitive' } }),
            expect.objectContaining({ clientEmail: { contains: 'carlos', mode: 'insensitive' } }),
          ]),
        }),
      })
    )
  })

  it('applies status filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    await GET(makeRequest(`${BASE_URL}?status=CONFIRMED`))

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'CONFIRMED' }),
      })
    )
  })

  it('applies dateFrom filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    await GET(makeRequest(`${BASE_URL}?dateFrom=2025-01-01`))

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          date: expect.objectContaining({ gte: expect.any(Date) }),
        }),
      })
    )
  })

  it('applies dateTo filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    await GET(makeRequest(`${BASE_URL}?dateTo=2025-12-31`))

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          date: expect.objectContaining({ lte: expect.any(Date) }),
        }),
      })
    )
  })

  it('applies serviceId filter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    await GET(makeRequest(`${BASE_URL}?serviceId=svc-99`))

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ serviceId: 'svc-99' }),
      })
    )
  })

  it('caps limit at 200, defaults to 100', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }))
  })

  it('serializes totalAmount to string', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([mockBooking] as any)
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.data[0].totalAmount).toBe('150')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockRejectedValueOnce(new Error('DB down'))

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

// ── Tests: POST ───────────────────────────────────────────────────────────────

describe('POST /api/admin/bookings', () => {
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

    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validBookingBody }))
    expect(res.status).toBe(401)
  })

  it('creates booking successfully (201)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValueOnce(mockBooking as any)

    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validBookingBody }))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })

  it('returns 400 for missing required fields', async () => {
    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { clientName: 'Only name' } })
    )
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('Campos requeridos')
  })

  it('parses totalAmount to float', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValueOnce(mockBooking as any)

    const { POST } = await import('@/app/api/admin/bookings/route')
    await POST(
      makeRequest(BASE_URL, {
        method: 'POST',
        body: { ...validBookingBody, totalAmount: '250.50' },
      })
    )

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ totalAmount: 250.5 }),
      })
    )
  })

  it('handles null totalAmount', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValueOnce({
      ...mockBooking,
      totalAmount: null,
    } as any)

    const { POST } = await import('@/app/api/admin/bookings/route')
    await POST(makeRequest(BASE_URL, { method: 'POST', body: validBookingBody }))

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ totalAmount: null }),
      })
    )
  })

  it('serializes totalAmount to string in response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValueOnce(mockBooking as any)

    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { ...validBookingBody, totalAmount: '150' } })
    )
    const json = await res.json()

    expect(json.data.totalAmount).toBe('150')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockRejectedValueOnce(new Error('DB crash'))

    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validBookingBody }))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})
