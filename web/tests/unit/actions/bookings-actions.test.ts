import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    booking: {
      create: vi.fn().mockResolvedValue({ id: 'bk-1' }),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}))

vi.mock('@/lib/email-service', () => ({
  emailService: {
    notifyNewBooking: vi.fn().mockResolvedValue({}),
    notifyClientBookingReceived: vi.fn().mockResolvedValue({}),
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: { calendar: '/admin/calendario' },
    public: { home: '/' },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

// ─── Helpers ────────────────────────────────────────

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value)
  }
  return fd
}

const validBookingData = {
  date: '2025-06-15T10:00:00.000Z',
  clientName: 'Ana García',
  clientEmail: 'ana@example.com',
  clientPhone: '+34666111222',
  serviceId: 'svc-1',
  notes: 'Reserva de prueba',
}

describe('Bookings Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── createBooking ────────────────────────────────

  describe('createBooking', () => {
    it('creates booking from FormData', async () => {
      const { prisma } = await import('@/lib/db')
      const { createBooking } = await import('@/actions/user/bookings')

      const fd = makeFormData(validBookingData)
      const result = await createBooking(fd)

      expect(result.success).toBe(true)
      expect(prisma.booking.create).toHaveBeenCalledTimes(1)
    })

    it('validates required fields', async () => {
      const { createBooking } = await import('@/actions/user/bookings')

      const fd = makeFormData({})
      const result = await createBooking(fd)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('returns error for missing date', async () => {
      const { createBooking } = await import('@/actions/user/bookings')

      const { date: _date, ...withoutDate } = validBookingData
      const fd = makeFormData(withoutDate)
      const result = await createBooking(fd)

      expect(result.success).toBe(false)
    })

    it('returns error for missing clientEmail', async () => {
      const { createBooking } = await import('@/actions/user/bookings')

      const { clientEmail: _clientEmail, ...withoutEmail } = validBookingData
      const fd = makeFormData(withoutEmail)
      const result = await createBooking(fd)

      expect(result.success).toBe(false)
    })

    it('returns error for invalid email format', async () => {
      const { createBooking } = await import('@/actions/user/bookings')

      const fd = makeFormData({ ...validBookingData, clientEmail: 'not-an-email' })
      const result = await createBooking(fd)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('returns success with booking data', async () => {
      const { createBooking } = await import('@/actions/user/bookings')

      const fd = makeFormData(validBookingData)
      const result = await createBooking(fd)

      expect(result).toEqual({ success: true })
    })

    it('sends notification emails', async () => {
      const { emailService } = await import('@/lib/email-service')
      const { createBooking } = await import('@/actions/user/bookings')

      const fd = makeFormData(validBookingData)
      await createBooking(fd)

      expect(emailService.notifyNewBooking).toHaveBeenCalled()
      expect(emailService.notifyClientBookingReceived).toHaveBeenCalled()
    })

    it('revalidates cache after success', async () => {
      const { revalidatePath } = await import('next/cache')
      const { createBooking } = await import('@/actions/user/bookings')

      const fd = makeFormData(validBookingData)
      await createBooking(fd)

      expect(revalidatePath).toHaveBeenCalledWith('/admin/calendario')
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.booking.create).mockRejectedValueOnce(new Error('DB error'))

      const { createBooking } = await import('@/actions/user/bookings')
      const fd = makeFormData(validBookingData)
      const result = await createBooking(fd)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  // ─── getBookingsByRange ───────────────────────────

  describe('getBookingsByRange', () => {
    it('returns bookings in date range', async () => {
      const mockBooking = {
        id: 'bk-1',
        date: new Date('2025-06-15'),
        clientName: 'Ana',
        service: { name: 'Fotos', duration: 60 },
      }
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.booking.findMany).mockResolvedValue([mockBooking] as never)

      const { getBookingsByRange } = await import('@/actions/user/bookings')
      const start = new Date('2025-06-01')
      const end = new Date('2025-06-30')
      const result = await getBookingsByRange(start, end)

      expect(result).toHaveLength(1)
      expect(prisma.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            date: { gte: start, lte: end },
          },
        })
      )
    })

    it('includes service relation', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.booking.findMany).mockResolvedValue([] as never)

      const { getBookingsByRange } = await import('@/actions/user/bookings')
      await getBookingsByRange(new Date(), new Date())

      expect(prisma.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            service: expect.anything(),
          }),
        })
      )
    })

    it('returns empty for no matches', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.booking.findMany).mockResolvedValue([] as never)

      const { getBookingsByRange } = await import('@/actions/user/bookings')
      const result = await getBookingsByRange(new Date(), new Date())

      expect(result).toEqual([])
    })

    it('returns empty on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.booking.findMany).mockRejectedValue(new Error('DB error'))

      const { getBookingsByRange } = await import('@/actions/user/bookings')
      const result = await getBookingsByRange(new Date(), new Date())

      expect(result).toEqual([])
    })
  })

  // ─── updateBookingStatus ──────────────────────────

  describe('updateBookingStatus', () => {
    it('updates status successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.booking.update).mockResolvedValue({} as never)

      const { updateBookingStatus } = await import('@/actions/user/bookings')
      const result = await updateBookingStatus('bk-1', 'CONFIRMED')

      expect(result.success).toBe(true)
      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: { id: 'bk-1' },
        data: { status: 'CONFIRMED' },
      })
    })

    it('revalidates cache after update', async () => {
      const { revalidatePath } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.booking.update).mockResolvedValue({} as never)

      const { updateBookingStatus } = await import('@/actions/user/bookings')
      await updateBookingStatus('bk-1', 'COMPLETED')

      expect(revalidatePath).toHaveBeenCalledWith('/admin/calendario')
    })

    it('returns error on failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.booking.update).mockRejectedValue(new Error('DB error'))

      const { updateBookingStatus } = await import('@/actions/user/bookings')
      const result = await updateBookingStatus('bk-1', 'CONFIRMED')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
