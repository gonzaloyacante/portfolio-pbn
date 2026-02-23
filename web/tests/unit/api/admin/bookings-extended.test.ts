import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    booking: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/jwt-admin', () => ({
  withAdminJwt: vi.fn().mockResolvedValue({
    ok: true,
    payload: { userId: 'admin-1', role: 'ADMIN', type: 'access', email: 'admin@test.com' },
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
  date: new Date('2025-07-15'),
  endDate: null,
  status: 'PENDING',
  clientName: 'Ana García',
  clientEmail: 'ana@test.com',
  clientPhone: '+34 600 000 000',
  guestCount: 2,
  totalAmount: null,
  paymentStatus: 'PENDING',
  serviceId: 'svc-1',
  service: { name: 'Wedding Photography' },
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ============================================
// GET /api/admin/bookings — extended
// ============================================

describe('GET /api/admin/bookings — extended', () => {
  it('GET returns bookings sorted by date', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockBooking])
    ;(prisma.booking.count as ReturnType<typeof vi.fn>).mockResolvedValue(1)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { date: 'asc' } })
    )
  })

  it('GET with status filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.booking.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(`${BASE_URL}?status=CONFIRMED`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'CONFIRMED' }),
      })
    )
  })

  it('GET with dateFrom filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.booking.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(`${BASE_URL}?dateFrom=2025-07-01`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          date: expect.objectContaining({ gte: expect.any(Date) }),
        }),
      })
    )
  })

  it('GET with dateTo filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.booking.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(`${BASE_URL}?dateTo=2025-12-31`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          date: expect.objectContaining({ lte: expect.any(Date) }),
        }),
      })
    )
  })

  it('GET with service filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.booking.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(`${BASE_URL}?serviceId=svc-1`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ serviceId: 'svc-1' }),
      })
    )
  })

  it('GET with search filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.booking.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(`${BASE_URL}?search=Ana`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ clientName: expect.objectContaining({ contains: 'Ana' }) }),
          ]),
        }),
      })
    )
  })

  it('GET returns pagination metadata', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.booking.count as ReturnType<typeof vi.fn>).mockResolvedValue(25)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=1&limit=10`))
    const json = await res.json()

    expect(json.data.pagination.total).toBe(25)
    expect(json.data.pagination.totalPages).toBe(3)
    expect(json.data.pagination.hasNext).toBe(true)
  })

  it('GET converts totalAmount to string', async () => {
    const { prisma } = await import('@/lib/db')
    const bookingWithAmount = { ...mockBooking, totalAmount: 150.5 }
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([bookingWithAmount])
    ;(prisma.booking.count as ReturnType<typeof vi.fn>).mockResolvedValue(1)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.data.data[0].totalAmount).toBe('150.5')
  })

  it('GET handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB'))

    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET(makeRequest(BASE_URL))

    expect(res.status).toBe(500)
  })
})

// ============================================
// POST /api/admin/bookings — extended
// ============================================

describe('POST /api/admin/bookings — extended', () => {
  const validBooking = {
    date: '2025-08-20',
    clientName: 'Ana García',
    clientEmail: 'ana@test.com',
    serviceId: 'svc-1',
  }

  it('POST creates booking with required fields', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockBooking,
      id: 'new',
    })

    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validBooking }))

    expect(res.status).toBe(201)
  })

  it('POST returns 400 when date is missing', async () => {
    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { ...validBooking, date: undefined } })
    )

    expect(res.status).toBe(400)
  })

  it('POST returns 400 when clientName is missing', async () => {
    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { ...validBooking, clientName: undefined } })
    )

    expect(res.status).toBe(400)
  })

  it('POST returns 400 when clientEmail is missing', async () => {
    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { ...validBooking, clientEmail: undefined } })
    )

    expect(res.status).toBe(400)
  })

  it('POST returns 400 when serviceId is missing', async () => {
    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { ...validBooking, serviceId: undefined } })
    )

    expect(res.status).toBe(400)
  })

  it('POST creates with optional fields', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockBooking,
      id: 'new',
    })

    const body = {
      ...validBooking,
      clientPhone: '+34 600 111 222',
      guestCount: 4,
      adminNotes: 'VIP client',
      totalAmount: '250.00',
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
    }

    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body }))

    expect(res.status).toBe(201)
    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          guestCount: 4,
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        }),
      })
    )
  })

  it('POST parses totalAmount as float', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockBooking,
      id: 'new',
    })

    const { POST } = await import('@/app/api/admin/bookings/route')
    await POST(
      makeRequest(BASE_URL, { method: 'POST', body: { ...validBooking, totalAmount: '99.99' } })
    )

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ totalAmount: 99.99 }),
      })
    )
  })

  it('POST handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.create as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

    const { POST } = await import('@/app/api/admin/bookings/route')
    const res = await POST(makeRequest(BASE_URL, { method: 'POST', body: validBooking }))

    expect(res.status).toBe(500)
  })
})

// ============================================
// PATCH & DELETE /api/admin/bookings/[id] — extended
// ============================================

describe('PATCH & DELETE /api/admin/bookings/[id] — extended', () => {
  const existingBooking = {
    id: 'booking-1',
    status: 'PENDING',
    deletedAt: null,
  }

  it('GET single booking by ID', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockBooking,
      totalAmount: 100,
      paidAmount: 50,
    })

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await GET(makeRequest(`${BASE_URL}/booking-1`), {
      params: Promise.resolve({ id: 'booking-1' }),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.totalAmount).toBe('100')
    expect(json.data.paidAmount).toBe('50')
  })

  it('GET returns 404 for nonexistent booking', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await GET(makeRequest(`${BASE_URL}/booking-404`), {
      params: Promise.resolve({ id: 'booking-404' }),
    })

    expect(res.status).toBe(404)
  })

  it('PATCH updates booking status to CONFIRMED', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(existingBooking)
    ;(prisma.booking.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockBooking,
      status: 'CONFIRMED',
      totalAmount: null,
      paidAmount: null,
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/booking-1`, { method: 'PATCH', body: { status: 'CONFIRMED' } }),
      { params: Promise.resolve({ id: 'booking-1' }) }
    )

    expect(res.status).toBe(200)
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'CONFIRMED',
          confirmedAt: expect.any(Date),
        }),
      })
    )
  })

  it('PATCH updates booking status to CANCELLED', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(existingBooking)
    ;(prisma.booking.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockBooking,
      status: 'CANCELLED',
      totalAmount: null,
      paidAmount: null,
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/booking-1`, { method: 'PATCH', body: { status: 'CANCELLED' } }),
      { params: Promise.resolve({ id: 'booking-1' }) }
    )

    expect(res.status).toBe(200)
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'CANCELLED',
          cancelledAt: expect.any(Date),
        }),
      })
    )
  })

  it('PATCH updates admin notes', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(existingBooking)
    ;(prisma.booking.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockBooking,
      totalAmount: null,
      paidAmount: null,
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/booking-1`, {
        method: 'PATCH',
        body: { adminNotes: 'Important client' },
      }),
      { params: Promise.resolve({ id: 'booking-1' }) }
    )

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ adminNotes: 'Important client' }),
      })
    )
  })

  it('PATCH returns 404 when booking not found', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/booking-404`, { method: 'PATCH', body: { status: 'CONFIRMED' } }),
      { params: Promise.resolve({ id: 'booking-404' }) }
    )

    expect(res.status).toBe(404)
  })

  it('DELETE soft deletes booking', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(existingBooking)
    ;(prisma.booking.update as ReturnType<typeof vi.fn>).mockResolvedValue({})

    const { DELETE } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await DELETE(makeRequest(`${BASE_URL}/booking-1`, { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'booking-1' }),
    })

    expect(res.status).toBe(200)
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      })
    )
  })

  it('DELETE returns 404 when booking not found', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { DELETE } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await DELETE(makeRequest(`${BASE_URL}/booking-404`, { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'booking-404' }),
    })

    expect(res.status).toBe(404)
  })

  it('PATCH handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(existingBooking)
    ;(prisma.booking.update as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/booking-1`, { method: 'PATCH', body: { status: 'CONFIRMED' } }),
      { params: Promise.resolve({ id: 'booking-1' }) }
    )

    expect(res.status).toBe(500)
  })

  it('DELETE handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(existingBooking)
    ;(prisma.booking.update as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

    const { DELETE } = await import('@/app/api/admin/bookings/[id]/route')
    const res = await DELETE(makeRequest(`${BASE_URL}/booking-1`, { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'booking-1' }),
    })

    expect(res.status).toBe(500)
  })
})
