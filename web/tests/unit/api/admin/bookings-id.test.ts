import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    booking: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/bookings/booking-1'

const mockBookingDetail = {
  id: 'booking-1',
  date: new Date('2025-03-15'),
  endDate: null,
  status: 'PENDING',
  clientName: 'Carlos Ruiz',
  clientEmail: 'carlos@example.com',
  clientPhone: '+34 600 999 888',
  clientNotes: null,
  guestCount: 1,
  adminNotes: null,
  confirmedAt: null,
  confirmedBy: null,
  cancelledAt: null,
  cancelledBy: null,
  cancellationReason: null,
  totalAmount: 150.0,
  paidAmount: null,
  paymentStatus: 'PENDING',
  paymentMethod: null,
  paymentRef: null,
  reminderSentAt: null,
  reminderCount: 0,
  feedbackSent: false,
  feedbackRating: null,
  feedbackText: null,
  serviceId: 'svc-1',
  service: { name: 'Sesión Retrato', slug: 'sesion-retrato' },
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ── Tests: GET ────────────────────────────────────────────────────────────────

describe('GET /api/admin/bookings/[id]', () => {
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

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    expect(res.status).toBe(401)
  })

  it('returns booking detail on success', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('booking-1')
  })

  it('returns 404 for non-existent booking', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Reserva no encontrada')
  })

  it('serializes totalAmount and paidAmount to string', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce({
      ...mockBookingDetail,
      totalAmount: 200.5,
      paidAmount: 100.0,
    } as any)

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(json.data.totalAmount).toBe('200.5')
    expect(json.data.paidAmount).toBe('100')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

// ── Tests: PATCH ──────────────────────────────────────────────────────────────

describe('PATCH /api/admin/bookings/[id]', () => {
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

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'CONFIRMED' } }),
      { params }
    )
    expect(res.status).toBe(401)
  })

  it('returns 404 when booking does not exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(null)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'CONFIRMED' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Reserva no encontrada')
  })

  it('updates booking successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)
    vi.mocked(prisma.booking.update).mockResolvedValueOnce({
      ...mockBookingDetail,
      adminNotes: 'Updated notes',
    } as any)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { adminNotes: 'Updated notes' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('sets confirmedAt/confirmedBy when status changes to CONFIRMED', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)
    vi.mocked(prisma.booking.update).mockResolvedValueOnce({
      ...mockBookingDetail,
      status: 'CONFIRMED',
    } as any)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'CONFIRMED' } }), {
      params,
    })

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'CONFIRMED',
          confirmedAt: expect.any(Date),
        }),
      })
    )
  })

  it('sets cancelledAt/cancelledBy when status changes to CANCELLED', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)
    vi.mocked(prisma.booking.update).mockResolvedValueOnce({
      ...mockBookingDetail,
      status: 'CANCELLED',
    } as any)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'CANCELLED' } }), {
      params,
    })

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'CANCELLED',
          cancelledAt: expect.any(Date),
          cancelledBy: 'admin',
        }),
      })
    )
  })

  it('parses totalAmount and paidAmount to float', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)
    vi.mocked(prisma.booking.update).mockResolvedValueOnce({
      ...mockBookingDetail,
      totalAmount: 300.5,
      paidAmount: 100.0,
    } as any)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    await PATCH(
      makeRequest(BASE_URL, {
        method: 'PATCH',
        body: { totalAmount: '300.50', paidAmount: '100' },
      }),
      { params }
    )

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          totalAmount: 300.5,
          paidAmount: 100,
        }),
      })
    )
  })

  it('serializes amounts to string in response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)
    vi.mocked(prisma.booking.update).mockResolvedValueOnce({
      ...mockBookingDetail,
      totalAmount: 250.0,
      paidAmount: 50.0,
    } as any)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { adminNotes: 'test' } }),
      { params }
    )
    const json = await res.json()

    expect(json.data.totalAmount).toBe('250')
    expect(json.data.paidAmount).toBe('50')
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)
    vi.mocked(prisma.booking.update).mockRejectedValueOnce(new Error('DB crash'))

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'CONFIRMED' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

// ── Tests: DELETE ─────────────────────────────────────────────────────────────

describe('DELETE /api/admin/bookings/[id]', () => {
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

    const { DELETE } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    expect(res.status).toBe(401)
  })

  it('returns 404 when booking does not exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(null)

    const { DELETE } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Reserva no encontrada')
  })

  it('soft deletes booking (sets deletedAt)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)
    vi.mocked(prisma.booking.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Reserva eliminada')
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'booking-1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findFirst).mockResolvedValueOnce(mockBookingDetail as any)
    vi.mocked(prisma.booking.update).mockRejectedValueOnce(new Error('DB error'))

    const { DELETE } = await import('@/app/api/admin/bookings/[id]/route')
    const params = Promise.resolve({ id: 'booking-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})
