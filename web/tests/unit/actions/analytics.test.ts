import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', email: 'admin@test.com' }),
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    analyticLog: {
      create: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
      groupBy: vi.fn(),
      aggregate: vi.fn(),
    },
    categoryImage: { count: vi.fn() },
    category: { count: vi.fn() },
    service: { count: vi.fn() },
    testimonial: { count: vi.fn() },
    contact: { count: vi.fn() },
    booking: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

describe('Analytics actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('keeps custom DB analytics disabled', async () => {
    const { prisma } = await import('@/lib/db')
    const { recordAnalyticEvent } = await import('@/actions/analytics')

    const result = await recordAnalyticEvent('PAGE_VIEW', '/portfolio', 'Page')

    expect(result).toEqual({ success: true, disabled: true })
    expect(prisma.analyticLog.create).not.toHaveBeenCalled()
  })

  it('does not return legacy visitor analytics data from Neon', async () => {
    const { prisma } = await import('@/lib/db')
    const { getAnalyticsDashboardData, getExtendedAnalyticsData } =
      await import('@/actions/analytics')

    await expect(getAnalyticsDashboardData()).resolves.toBeNull()
    await expect(getExtendedAnalyticsData()).resolves.toBeNull()
    expect(prisma.analyticLog.count).not.toHaveBeenCalled()
    expect(prisma.analyticLog.aggregate).not.toHaveBeenCalled()
  })

  it('returns cached operational dashboard counters', async () => {
    const { prisma } = await import('@/lib/db')

    vi.mocked(prisma.categoryImage.count).mockResolvedValueOnce(10)
    vi.mocked(prisma.category.count)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(7)
    vi.mocked(prisma.service.count)
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(9)
    vi.mocked(prisma.testimonial.count)
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(6)
    vi.mocked(prisma.contact.count).mockResolvedValueOnce(4).mockResolvedValueOnce(3)
    vi.mocked(prisma.booking.count).mockResolvedValueOnce(5).mockResolvedValueOnce(2)

    const { getDashboardContentStats } = await import('@/actions/analytics')
    const stats = await getDashboardContentStats()

    expect(stats).toEqual({
      imagesCount: 10,
      categoriesCount: 5,
      servicesCount: 8,
      testimonialsCount: 12,
      deletedCount: 15,
      contactsCount: 3,
      pendingTestimonials: 6,
      pendingBookings: 2,
      categoriesWithoutImages: 7,
      servicesWithoutImage: 9,
    })
  })

  it('returns cached recent bookings for the admin dashboard', async () => {
    const { prisma } = await import('@/lib/db')
    const date = new Date('2026-06-03T10:00:00.000Z')
    vi.mocked(prisma.booking.findMany).mockResolvedValueOnce([
      {
        id: 'booking-1',
        clientName: 'Paola',
        date,
        status: 'PENDING',
        service: { name: 'Maquillaje' },
      },
    ])

    const { getDashboardRecentBookings } = await import('@/actions/analytics')
    const bookings = await getDashboardRecentBookings()

    expect(bookings).toHaveLength(1)
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
        orderBy: { date: 'asc' },
      })
    )
  })
})
