import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    booking: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/email-service', () => ({
  emailService: {
    notifyNewBooking: vi.fn().mockResolvedValue({ success: true }),
    notifyClientBookingReceived: vi.fn().mockResolvedValue({ success: true }),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: { calendar: '/admin/calendar' },
  },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeBookingFormData(fields?: Partial<Record<string, string>>): FormData {
  const fd = new FormData()
  fd.set('date', fields?.date ?? '2026-03-15T10:00:00Z')
  fd.set('clientName', fields?.clientName ?? 'Ana López')
  fd.set('clientEmail', fields?.clientEmail ?? 'ana@example.com')
  fd.set('clientPhone', fields?.clientPhone ?? '+34600111222')
  fd.set('serviceId', fields?.serviceId ?? 'svc-1')
  fd.set('notes', fields?.notes ?? 'Special requests')
  return fd
}

// ── Tests: createBooking ──────────────────────────────────────────────────────

describe('createBooking', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should create booking with valid data', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValue({} as never)

    const { createBooking } = await import('@/actions/user/bookings')
    const result = await createBooking(makeBookingFormData())
    expect(result.success).toBe(true)
  })

  it('should save booking to database with correct data', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValue({} as never)

    const { createBooking } = await import('@/actions/user/bookings')
    await createBooking(makeBookingFormData())

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          clientName: 'Ana López',
          clientEmail: 'ana@example.com',
          serviceId: 'svc-1',
          status: 'PENDING',
        }),
      })
    )
  })

  it('should send notification emails', async () => {
    const { prisma } = await import('@/lib/db')
    const { emailService } = await import('@/lib/email-service')
    vi.mocked(prisma.booking.create).mockResolvedValue({} as never)

    const { createBooking } = await import('@/actions/user/bookings')
    await createBooking(makeBookingFormData())

    expect(emailService.notifyNewBooking).toHaveBeenCalled()
    expect(emailService.notifyClientBookingReceived).toHaveBeenCalled()
  })

  it('should still succeed if email fails', async () => {
    const { prisma } = await import('@/lib/db')
    const { emailService } = await import('@/lib/email-service')
    vi.mocked(prisma.booking.create).mockResolvedValue({} as never)
    vi.mocked(emailService.notifyNewBooking).mockRejectedValue(new Error('Email fail'))

    const { createBooking } = await import('@/actions/user/bookings')
    const result = await createBooking(makeBookingFormData())
    expect(result.success).toBe(true)
  })

  it('should return error for missing client name', async () => {
    const { createBooking } = await import('@/actions/user/bookings')
    const result = await createBooking(makeBookingFormData({ clientName: '' }))
    expect(result.success).toBe(false)
  })

  it('should return error for invalid email', async () => {
    const { createBooking } = await import('@/actions/user/bookings')
    const result = await createBooking(makeBookingFormData({ clientEmail: 'invalid' }))
    expect(result.success).toBe(false)
  })

  it('should return error for missing service', async () => {
    const { createBooking } = await import('@/actions/user/bookings')
    const result = await createBooking(makeBookingFormData({ serviceId: '' }))
    expect(result.success).toBe(false)
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockRejectedValue(new Error('DB error'))

    const { createBooking } = await import('@/actions/user/bookings')
    const result = await createBooking(makeBookingFormData())
    expect(result.success).toBe(false)
  })

  it('should revalidate calendar path', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValue({} as never)

    const { createBooking } = await import('@/actions/user/bookings')
    await createBooking(makeBookingFormData())
    expect(revalidatePath).toHaveBeenCalled()
  })

  it('should set status to PENDING by default', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValue({} as never)

    const { createBooking } = await import('@/actions/user/bookings')
    await createBooking(makeBookingFormData())

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'PENDING' }),
      })
    )
  })

  it('should handle optional phone field', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.create).mockResolvedValue({} as never)

    const fd = new FormData()
    fd.set('date', '2026-03-15T10:00:00Z')
    fd.set('clientName', 'Ana López')
    fd.set('clientEmail', 'ana@example.com')
    fd.set('serviceId', 'svc-1')
    // clientPhone and notes intentionally omitted — but zod .optional() only accepts undefined, not null
    // FormData.get() returns null for missing keys, so we provide empty strings
    fd.set('clientPhone', '')
    fd.set('notes', '')

    const { createBooking } = await import('@/actions/user/bookings')
    const result = await createBooking(fd)
    expect(result.success).toBe(true)
  })
})

// ── Tests: getBookingsByRange ─────────────────────────────────────────────────

describe('getBookingsByRange', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should fetch bookings within date range', async () => {
    const { prisma } = await import('@/lib/db')
    const bookings = [{ id: 'b-1', date: new Date() }]
    vi.mocked(prisma.booking.findMany).mockResolvedValue(bookings as never)

    const start = new Date('2026-03-01')
    const end = new Date('2026-03-31')

    const { getBookingsByRange } = await import('@/actions/user/bookings')
    const result = await getBookingsByRange(start, end)
    expect(result).toEqual(bookings)
  })

  it('should pass correct date filters', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const start = new Date('2026-03-01')
    const end = new Date('2026-03-31')

    const { getBookingsByRange } = await import('@/actions/user/bookings')
    await getBookingsByRange(start, end)

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { date: { gte: start, lte: end } },
      })
    )
  })

  it('should include service details', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const { getBookingsByRange } = await import('@/actions/user/bookings')
    await getBookingsByRange(new Date(), new Date())

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: { service: { select: { name: true, duration: true } } },
      })
    )
  })

  it('should order by date ascending', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const { getBookingsByRange } = await import('@/actions/user/bookings')
    await getBookingsByRange(new Date(), new Date())

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { date: 'asc' } })
    )
  })

  it('should return empty array on error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.findMany).mockRejectedValue(new Error('DB'))

    const { getBookingsByRange } = await import('@/actions/user/bookings')
    const result = await getBookingsByRange(new Date(), new Date())
    expect(result).toEqual([])
  })
})

// ── Tests: updateBookingStatus ────────────────────────────────────────────────

describe('updateBookingStatus', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should update booking status to CONFIRMED', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.update).mockResolvedValue({} as never)

    const { updateBookingStatus } = await import('@/actions/user/bookings')
    const result = await updateBookingStatus('b-1', 'CONFIRMED')
    expect(result.success).toBe(true)
    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { id: 'b-1' },
      data: { status: 'CONFIRMED' },
    })
  })

  it('should update booking status to CANCELLED', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.update).mockResolvedValue({} as never)

    const { updateBookingStatus } = await import('@/actions/user/bookings')
    const result = await updateBookingStatus('b-1', 'CANCELLED')
    expect(result.success).toBe(true)
  })

  it('should update booking status to COMPLETED', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.update).mockResolvedValue({} as never)

    const { updateBookingStatus } = await import('@/actions/user/bookings')
    const result = await updateBookingStatus('b-1', 'COMPLETED')
    expect(result.success).toBe(true)
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.update).mockRejectedValue(new Error('DB'))

    const { updateBookingStatus } = await import('@/actions/user/bookings')
    const result = await updateBookingStatus('b-1', 'CONFIRMED')
    expect(result.success).toBe(false)
  })

  it('should revalidate calendar path on success', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.booking.update).mockResolvedValue({} as never)

    const { updateBookingStatus } = await import('@/actions/user/bookings')
    await updateBookingStatus('b-1', 'CONFIRMED')
    expect(revalidatePath).toHaveBeenCalled()
  })
})
