import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    analyticLog: {
      create: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      groupBy: vi.fn().mockResolvedValue([]),
      aggregate: vi.fn().mockResolvedValue({
        _avg: {
          vitalsLCP: null,
          vitalsFCP: null,
          vitalsINP: null,
          vitalsCLS: null,
          scrollDepth: null,
          timeOnPage: null,
        },
      }),
    },
    project: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(
    new Map([
      ['x-forwarded-for', '192.168.1.1'],
      ['user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)'],
      ['x-vercel-ip-country', 'ES'],
      ['x-vercel-ip-city', 'Madrid'],
      ['x-vercel-ip-country-region', 'MD'],
      ['x-vercel-ip-latitude', '40.4168'],
      ['x-vercel-ip-longitude', '-3.7038'],
    ])
  ),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: Function) => fn),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

describe('Analytics Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── recordAnalyticEvent ──────────────────────────

  describe('recordAnalyticEvent', () => {
    it('records event successfully', async () => {
      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      const result = await recordAnalyticEvent('PAGE_VIEW')

      expect(result.success).toBe(true)
      expect(prisma.analyticLog.create).toHaveBeenCalledTimes(1)
    })

    it('anonymizes IP address (zeroes last octet)', async () => {
      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PAGE_VIEW')

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.ipAddress).toBe('192.168.1.0')
    })

    it('detects iPhone device from user-agent', async () => {
      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PAGE_VIEW')

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.device).toBe('mobile')
    })

    it('detects Android mobile device', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockResolvedValueOnce(
        new Map([
          ['x-forwarded-for', '10.0.0.1'],
          [
            'user-agent',
            'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0 Mobile Safari/537.36',
          ],
        ]) as never
      )

      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PAGE_VIEW')

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.device).toBe('mobile')
    })

    it('detects desktop device', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockResolvedValueOnce(
        new Map([
          ['x-forwarded-for', '10.0.0.1'],
          ['user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
        ]) as never
      )

      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PAGE_VIEW')

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.device).toBe('desktop')
    })

    it('handles missing user-agent', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockResolvedValueOnce(new Map([['x-forwarded-for', '10.0.0.1']]) as never)

      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      const result = await recordAnalyticEvent('PAGE_VIEW')

      expect(result.success).toBe(true)
      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.userAgent).toBe('unknown')
    })

    it('includes geo data from Vercel headers', async () => {
      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PAGE_VIEW')

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.country).toBe('ES')
      expect(createCall.data.city).toBe('Madrid')
      expect(createCall.data.latitude).toBe(40.4168)
      expect(createCall.data.longitude).toBe(-3.7038)
    })

    it('handles missing geo headers', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockResolvedValueOnce(
        new Map([
          ['x-forwarded-for', '10.0.0.1'],
          ['user-agent', 'Mozilla/5.0'],
        ]) as never
      )

      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PAGE_VIEW')

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.country).toBeUndefined()
      expect(createCall.data.city).toBeUndefined()
    })

    it('flags bot traffic via isBot', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockResolvedValueOnce(
        new Map([
          ['x-forwarded-for', '10.0.0.1'],
          ['user-agent', 'Googlebot/2.1 (+http://www.google.com/bot.html)'],
        ]) as never
      )

      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PAGE_VIEW')

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.isBot).toBe(true)
    })

    it('logs errors without crashing', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.create).mockRejectedValueOnce(new Error('DB down'))

      const { logger } = await import('@/lib/logger')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      const result = await recordAnalyticEvent('PAGE_VIEW')

      expect(result.success).toBe(false)
      expect(logger.error).toHaveBeenCalled()
    })

    it('stores entityId and entityType', async () => {
      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PROJECT_DETAIL_VIEW', 'proj-1', 'Project')

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.entityId).toBe('proj-1')
      expect(createCall.data.entityType).toBe('Project')
    })

    it('passes optional fields from options', async () => {
      const { prisma } = await import('@/lib/db')
      const { recordAnalyticEvent } = await import('@/actions/analytics/index')

      await recordAnalyticEvent('PAGE_VIEW', undefined, undefined, {
        sessionId: 'sess-abc',
        scrollDepth: 75,
        timeOnPage: 120,
      })

      const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
      expect(createCall.data.sessionId).toBe('sess-abc')
      expect(createCall.data.scrollDepth).toBe(75)
      expect(createCall.data.timeOnPage).toBe(120)
    })
  })

  // ─── getAnalyticsDashboardData ────────────────────

  describe('getAnalyticsDashboardData', () => {
    it('returns dashboard data structure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.count).mockResolvedValue(10 as never)
      vi.mocked(prisma.analyticLog.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValue([] as never)
      vi.mocked(prisma.project.findMany).mockResolvedValue([] as never)

      const { getAnalyticsDashboardData } = await import('@/actions/analytics/index')
      const result = await getAnalyticsDashboardData()

      expect(result).toBeDefined()
      expect(result).toHaveProperty('totalVisits')
      expect(result).toHaveProperty('trendData')
      expect(result).toHaveProperty('topProjects')
      expect(result).toHaveProperty('deviceUsage')
    })

    it('returns zero counts for empty DB', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.count).mockResolvedValue(0 as never)
      vi.mocked(prisma.analyticLog.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValue([] as never)

      const { getAnalyticsDashboardData } = await import('@/actions/analytics/index')
      const result = await getAnalyticsDashboardData()

      expect(result).toBeDefined()
      expect(result!.totalVisits).toBe(0)
      expect(result!.detailVisits).toBe(0)
      expect(result!.contactLeads).toBe(0)
    })

    it('returns device usage breakdown', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.count).mockResolvedValue(0 as never)
      vi.mocked(prisma.analyticLog.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([
        { entityId: 'p1', _count: { entityId: 5 } },
      ] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([
        { device: 'mobile', _count: { device: 40 } },
        { device: 'desktop', _count: { device: 55 } },
        { device: 'tablet', _count: { device: 5 } },
      ] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([] as never)

      const { getAnalyticsDashboardData } = await import('@/actions/analytics/index')
      const result = await getAnalyticsDashboardData()

      expect(result).toBeDefined()
      expect(result!.deviceUsage).toEqual({
        mobile: 40,
        desktop: 55,
        tablet: 5,
      })
    })

    it('returns trend data for 7 days', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.count).mockResolvedValue(0 as never)
      vi.mocked(prisma.analyticLog.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValue([] as never)

      const { getAnalyticsDashboardData } = await import('@/actions/analytics/index')
      const result = await getAnalyticsDashboardData()

      expect(result).toBeDefined()
      expect(result!.trendData).toHaveLength(7)
      expect(result!.trendData[0]).toHaveProperty('date')
      expect(result!.trendData[0]).toHaveProperty('count')
    })

    it('handles DB errors gracefully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.count).mockRejectedValue(new Error('DB error'))

      const { logger } = await import('@/lib/logger')
      const { getAnalyticsDashboardData } = await import('@/actions/analytics/index')
      const result = await getAnalyticsDashboardData()

      expect(result).toBeNull()
      expect(logger.error).toHaveBeenCalled()
    })
  })

  // ─── getExtendedAnalyticsData ─────────────────────

  describe('getExtendedAnalyticsData', () => {
    it('returns extended data', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.aggregate).mockResolvedValue({
        _avg: {
          vitalsLCP: 2500,
          vitalsFCP: 1200,
          vitalsINP: 200,
          vitalsCLS: 0.1,
          scrollDepth: 65,
          timeOnPage: 90,
        },
      } as never)
      vi.mocked(prisma.analyticLog.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValue([] as never)

      const { getExtendedAnalyticsData } = await import('@/actions/analytics/index')
      const result = await getExtendedAnalyticsData()

      expect(result).toBeDefined()
      expect(result).toHaveProperty('avgVitalsLCP')
      expect(result).toHaveProperty('geoPoints')
      expect(result).toHaveProperty('countryCounts')
    })

    it('accepts custom days parameter', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.aggregate).mockResolvedValue({
        _avg: {
          vitalsLCP: null,
          vitalsFCP: null,
          vitalsINP: null,
          vitalsCLS: null,
          scrollDepth: null,
          timeOnPage: null,
        },
      } as never)
      vi.mocked(prisma.analyticLog.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValue([] as never)

      const { getExtendedAnalyticsData } = await import('@/actions/analytics/index')
      const result = await getExtendedAnalyticsData(90)

      expect(result).toBeDefined()
    })

    it('returns geo points for map', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.aggregate).mockResolvedValue({
        _avg: {
          vitalsLCP: null,
          vitalsFCP: null,
          vitalsINP: null,
          vitalsCLS: null,
          scrollDepth: null,
          timeOnPage: null,
        },
      } as never)
      vi.mocked(prisma.analyticLog.findMany).mockResolvedValue([
        { latitude: 40.4168, longitude: -3.7038, city: 'Madrid', country: 'ES' },
        { latitude: 41.3874, longitude: 2.1686, city: 'Barcelona', country: 'ES' },
      ] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValue([] as never)

      const { getExtendedAnalyticsData } = await import('@/actions/analytics/index')
      const result = await getExtendedAnalyticsData()

      expect(result).toBeDefined()
      expect(result!.geoPoints).toHaveLength(2)
      expect(result!.geoPoints[0]).toHaveProperty('lat')
      expect(result!.geoPoints[0]).toHaveProperty('lon')
      expect(result!.geoPoints[0].city).toBe('Madrid')
    })

    it('returns country counts', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.aggregate).mockResolvedValue({
        _avg: {
          vitalsLCP: null,
          vitalsFCP: null,
          vitalsINP: null,
          vitalsCLS: null,
          scrollDepth: null,
          timeOnPage: null,
        },
      } as never)
      vi.mocked(prisma.analyticLog.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.analyticLog.groupBy).mockResolvedValue([
        { country: 'ES', _count: { country: 50 } },
        { country: 'US', _count: { country: 30 } },
      ] as never)

      const { getExtendedAnalyticsData } = await import('@/actions/analytics/index')
      const result = await getExtendedAnalyticsData()

      expect(result).toBeDefined()
      expect(result!.countryCounts).toEqual({ ES: 50, US: 30 })
    })

    it('handles DB errors gracefully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.analyticLog.aggregate).mockRejectedValue(new Error('DB error'))

      const { logger } = await import('@/lib/logger')
      const { getExtendedAnalyticsData } = await import('@/actions/analytics/index')
      const result = await getExtendedAnalyticsData()

      expect(result).toBeNull()
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
