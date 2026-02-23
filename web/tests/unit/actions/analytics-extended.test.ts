import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockHeaders = new Map<string, string>()

vi.mock('next/headers', () => ({
  headers: vi.fn().mockImplementation(async () => ({
    get: (key: string) => mockHeaders.get(key) ?? null,
  })),
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
    project: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

// ── Tests: recordAnalyticEvent ────────────────────────────────────────────────

describe('recordAnalyticEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHeaders.clear()
    mockHeaders.set('x-forwarded-for', '1.2.3.4')
    mockHeaders.set('user-agent', 'Mozilla/5.0 Desktop')
  })

  it('should create an analyticLog entry', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    const result = await recordAnalyticEvent('PAGE_VIEW', 'page-1', 'Page')

    expect(result).toEqual({ success: true })
    expect(prisma.analyticLog.create).toHaveBeenCalledOnce()
  })

  it('should anonymize IPv4 by zeroing last octet', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW')

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    expect((createCall as { data: { ipAddress: string } }).data.ipAddress).toBe('1.2.3.0')
  })

  it('should anonymize IPv6 by zeroing last group', async () => {
    mockHeaders.set('x-forwarded-for', '2001:db8:85a3::8a2e:370:7334')

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW')

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    expect((createCall as { data: { ipAddress: string } }).data.ipAddress).toMatch(/0$/)
  })

  it('should detect mobile device from user agent', async () => {
    mockHeaders.set('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS) Mobile')

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW')

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    expect((createCall as { data: { device: string } }).data.device).toBe('mobile')
  })

  it('should detect tablet device from user agent', async () => {
    mockHeaders.set('user-agent', 'Mozilla/5.0 (iPad; CPU OS 14_0)')

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW')

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    expect((createCall as { data: { device: string } }).data.device).toBe('tablet')
  })

  it('should default to desktop device', async () => {
    mockHeaders.set('user-agent', 'Mozilla/5.0 (X11; Linux x86_64)')

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW')

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    expect((createCall as { data: { device: string } }).data.device).toBe('desktop')
  })

  it('should detect bots from user agent', async () => {
    mockHeaders.set('user-agent', 'Googlebot/2.1 (+http://www.google.com/bot.html)')

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW')

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    expect((createCall as { data: { isBot: boolean } }).data.isBot).toBe(true)
  })

  it('should pass session and scroll options', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW', undefined, undefined, {
      sessionId: 'sess-1',
      scrollDepth: 85,
      timeOnPage: 120,
    })

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    const data = (createCall as { data: Record<string, unknown> }).data
    expect(data.sessionId).toBe('sess-1')
    expect(data.scrollDepth).toBe(85)
    expect(data.timeOnPage).toBe(120)
  })

  it('should pass UTM parameters', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW', undefined, undefined, {
      stm: {
        source: 'google',
        medium: 'cpc',
        campaign: 'spring',
        term: 'portfolio',
        content: 'banner',
      },
    })

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    const data = (createCall as { data: Record<string, unknown> }).data
    expect(data.utmSource).toBe('google')
    expect(data.utmMedium).toBe('cpc')
    expect(data.utmCampaign).toBe('spring')
  })

  it('should pass web vitals options', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW', undefined, undefined, {
      vitalsLCP: 2500,
      vitalsFCP: 1200,
      vitalsINP: 200,
      vitalsCLS: 0.1,
    })

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    const data = (createCall as { data: Record<string, unknown> }).data
    expect(data.vitalsLCP).toBe(2500)
    expect(data.vitalsFCP).toBe(1200)
    expect(data.vitalsINP).toBe(200)
    expect(data.vitalsCLS).toBe(0.1)
  })

  it('should pass Vercel geo headers', async () => {
    mockHeaders.set('x-vercel-ip-country', 'ES')
    mockHeaders.set('x-vercel-ip-city', 'Madrid')
    mockHeaders.set('x-vercel-ip-country-region', 'MD')
    mockHeaders.set('x-vercel-ip-latitude', '40.4168')
    mockHeaders.set('x-vercel-ip-longitude', '-3.7038')

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW')

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    const data = (createCall as { data: Record<string, unknown> }).data
    expect(data.country).toBe('ES')
    expect(data.city).toBe('Madrid')
    expect(data.latitude).toBeCloseTo(40.4168)
    expect(data.longitude).toBeCloseTo(-3.7038)
  })

  it('should take first IP when x-forwarded-for has multiple', async () => {
    mockHeaders.set('x-forwarded-for', '10.0.0.1, 192.168.1.1')

    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW')

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    expect((createCall as { data: { ipAddress: string } }).data.ipAddress).toBe('10.0.0.0')
  })

  it('should handle metadata serialization', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('CUSTOM', undefined, undefined, {
      metadata: { key: 'value', nested: { a: 1 } },
    })

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    const data = (createCall as { data: Record<string, unknown> }).data
    expect(data.eventData).toEqual({ key: 'value', nested: { a: 1 } })
  })

  it('should return success false on database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockRejectedValue(new Error('DB error'))

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    const result = await recordAnalyticEvent('PAGE_VIEW')
    expect(result).toEqual({ success: false })
  })

  it('should use options.device when provided', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.create).mockResolvedValue({} as never)

    const { recordAnalyticEvent } = await import('@/actions/analytics')
    await recordAnalyticEvent('PAGE_VIEW', undefined, undefined, { device: 'tablet' })

    const createCall = vi.mocked(prisma.analyticLog.create).mock.calls[0][0]
    expect((createCall as { data: { device: string } }).data.device).toBe('tablet')
  })
})

// ── Tests: getAnalyticsDashboardData ──────────────────────────────────────────

describe('getAnalyticsDashboardData', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return structured dashboard data', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.count)
      .mockResolvedValueOnce(100) // totalVisits
      .mockResolvedValueOnce(30) // detailVisits
      .mockResolvedValueOnce(5) // contactLeads
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.analyticLog.groupBy)
      .mockResolvedValueOnce([]) // topProjectsRaw
      .mockResolvedValueOnce([]) // deviceGroups
      .mockResolvedValueOnce([]) // topLocationsRaw
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getAnalyticsDashboardData } = await import('@/actions/analytics')
    const result = await getAnalyticsDashboardData()

    expect(result).not.toBeNull()
    expect(result?.totalVisits).toBe(100)
    expect(result?.detailVisits).toBe(30)
    expect(result?.contactLeads).toBe(5)
    expect(result?.trendData).toBeDefined()
    expect(result?.topProjects).toBeDefined()
    expect(result?.deviceUsage).toBeDefined()
    expect(result?.topLocations).toBeDefined()
  })

  it('should return trend data with 7 days', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.count).mockResolvedValue(0)
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.analyticLog.groupBy).mockResolvedValue([] as never)
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getAnalyticsDashboardData } = await import('@/actions/analytics')
    const result = await getAnalyticsDashboardData()

    expect(result?.trendData).toHaveLength(7)
  })

  it('should map projects to titles', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.count).mockResolvedValue(0)
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.analyticLog.groupBy)
      .mockResolvedValueOnce([
        { entityId: 'proj-1', _count: { entityId: 10 } },
        { entityId: 'proj-2', _count: { entityId: 5 } },
      ] as never)
      .mockResolvedValueOnce([]) // deviceGroups
      .mockResolvedValueOnce([]) // topLocations
    vi.mocked(prisma.project.findMany).mockResolvedValue([
      { id: 'proj-1', title: 'My Project' },
      { id: 'proj-2', title: 'Another' },
    ] as never)

    const { getAnalyticsDashboardData } = await import('@/actions/analytics')
    const result = await getAnalyticsDashboardData()

    expect(result?.topProjects).toEqual([
      { title: 'My Project', count: 10 },
      { title: 'Another', count: 5 },
    ])
  })

  it('should aggregate device groups', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.count).mockResolvedValue(0)
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.analyticLog.groupBy)
      .mockResolvedValueOnce([]) // topProjects
      .mockResolvedValueOnce([
        { device: 'mobile', _count: { device: 40 } },
        { device: 'desktop', _count: { device: 60 } },
      ] as never)
      .mockResolvedValueOnce([]) // topLocations
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getAnalyticsDashboardData } = await import('@/actions/analytics')
    const result = await getAnalyticsDashboardData()

    expect(result?.deviceUsage).toEqual({ mobile: 40, tablet: 0, desktop: 60 })
  })

  it('should format top locations', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.count).mockResolvedValue(0)
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.analyticLog.groupBy)
      .mockResolvedValueOnce([]) // topProjects
      .mockResolvedValueOnce([]) // deviceGroups
      .mockResolvedValueOnce([
        { city: 'Madrid', country: 'ES', _count: { city: 20 } },
        { city: null, country: 'US', _count: { city: 10 } },
      ] as never)
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getAnalyticsDashboardData } = await import('@/actions/analytics')
    const result = await getAnalyticsDashboardData()

    expect(result?.topLocations).toEqual([
      { location: 'Madrid, ES', count: 20 },
      { location: 'US', count: 10 },
    ])
  })

  it('should return null on error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.count).mockRejectedValue(new Error('DB error'))

    const { getAnalyticsDashboardData } = await import('@/actions/analytics')
    const result = await getAnalyticsDashboardData()
    expect(result).toBeNull()
  })
})

// ── Tests: getExtendedAnalyticsData ───────────────────────────────────────────

describe('getExtendedAnalyticsData', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return extended analytics with defaults (30 days)', async () => {
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
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([])

    const { getExtendedAnalyticsData } = await import('@/actions/analytics')
    const result = await getExtendedAnalyticsData()

    expect(result).not.toBeNull()
    expect(result?.avgVitalsLCP).toBe(2500)
    expect(result?.avgVitalsFCP).toBe(1200)
    expect(result?.avgScrollDepth).toBe(65)
    expect(result?.avgTimeOnPage).toBe(90)
  })

  it('should build geo points from rows', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.aggregate).mockResolvedValue({
      _avg: {},
    } as never)
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([
      { latitude: 40.41, longitude: -3.7, city: 'Madrid', country: 'ES' },
      { latitude: null, longitude: null, city: null, country: null },
    ] as never)
    vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([])

    const { getExtendedAnalyticsData } = await import('@/actions/analytics')
    const result = await getExtendedAnalyticsData()

    expect(result?.geoPoints).toHaveLength(1)
    expect(result?.geoPoints?.[0]).toEqual({
      lat: 40.41,
      lon: -3.7,
      city: 'Madrid',
      country: 'ES',
    })
  })

  it('should build country counts', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.aggregate).mockResolvedValue({ _avg: {} } as never)
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([
      { country: 'ES', _count: { country: 50 } },
      { country: 'US', _count: { country: 30 } },
    ] as never)

    const { getExtendedAnalyticsData } = await import('@/actions/analytics')
    const result = await getExtendedAnalyticsData()

    expect(result?.countryCounts).toEqual({ ES: 50, US: 30 })
  })

  it('should accept custom days parameter', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.aggregate).mockResolvedValue({ _avg: {} } as never)
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([])

    const { getExtendedAnalyticsData } = await import('@/actions/analytics')
    const result = await getExtendedAnalyticsData(7)

    expect(result).not.toBeNull()
    expect(prisma.analyticLog.aggregate).toHaveBeenCalledOnce()
  })

  it('should return null on error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.aggregate).mockRejectedValue(new Error('DB'))

    const { getExtendedAnalyticsData } = await import('@/actions/analytics')
    const result = await getExtendedAnalyticsData()
    expect(result).toBeNull()
  })

  it('should filter out null lat/lng from geo points', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.analyticLog.aggregate).mockResolvedValue({ _avg: {} } as never)
    vi.mocked(prisma.analyticLog.findMany).mockResolvedValueOnce([
      { latitude: null, longitude: null, city: 'Unknown', country: 'XX' },
    ] as never)
    vi.mocked(prisma.analyticLog.groupBy).mockResolvedValueOnce([])

    const { getExtendedAnalyticsData } = await import('@/actions/analytics')
    const result = await getExtendedAnalyticsData()

    expect(result?.geoPoints).toHaveLength(0)
  })
})
