import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
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
      findUnique: vi.fn().mockResolvedValue({}),
      findUniqueOrThrow: vi.fn().mockResolvedValue({}),
      findFirst: vi.fn().mockResolvedValue({}),
      findFirstOrThrow: vi.fn().mockResolvedValue({}),
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
      update: vi.fn().mockResolvedValue({}),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      upsert: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    categoryImage: { count: vi.fn().mockResolvedValue(0) },
    category: { count: vi.fn().mockResolvedValue(0) },
    service: { count: vi.fn().mockResolvedValue(0) },
    testimonial: { count: vi.fn().mockResolvedValue(0) },
    contact: { count: vi.fn().mockResolvedValue(0) },
    booking: { count: vi.fn().mockResolvedValue(0), findMany: vi.fn().mockResolvedValue([]) },
  },
}))

describe('Disabled custom analytics contract', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ignores event payloads without writing visitor analytics to DB', async () => {
    const { prisma } = await import('@/lib/db')
    const { recordAnalyticEvent } = await import('@/actions/analytics')

    const result = await recordAnalyticEvent('CUSTOM', 'entity-1', 'Entity', {
      sessionId: 'session-1',
      scrollDepth: 90,
      stm: { source: 'google', medium: 'organic' },
      metadata: { nested: { ok: true } },
    })

    expect(result).toEqual({ success: true, disabled: true })
    expect(prisma.analyticLog.create).not.toHaveBeenCalled()
  })

  it('keeps legacy analytics helpers as no-op admin-safe endpoints', async () => {
    const { prisma } = await import('@/lib/db')
    const { getAnalyticsDashboardData, getExtendedAnalyticsData } =
      await import('@/actions/analytics')

    expect(await getAnalyticsDashboardData()).toBeNull()
    expect(await getExtendedAnalyticsData()).toBeNull()
    expect(prisma.analyticLog.findMany).not.toHaveBeenCalled()
    expect(prisma.analyticLog.groupBy).not.toHaveBeenCalled()
  })
})
