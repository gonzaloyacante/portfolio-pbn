'use server'

import { prisma } from '@/lib/db'
import { headers } from 'next/headers'

export async function recordAnalyticEvent(
  eventType: string,
  entityId?: string,
  entityType?: string,
  additionalData?: {
    stm?: {
      source?: string
      medium?: string
      campaign?: string
      term?: string
      content?: string
    }
    performance?: {
      loadTime?: number
    }
    metadata?: Record<string, unknown>
  }
) {
  try {
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const referer = headersList.get('referer') || null

    // Parse IP if multiple
    const distinctIp = Array.isArray(ipAddress) ? ipAddress[0] : ipAddress.split(',')[0].trim()

    await prisma.analyticLog.create({
      data: {
        eventType,
        entityId,
        entityType,
        // Request Metadata
        ipAddress: distinctIp,
        userAgent,
        referrer: referer,
        // UTM / Marketing
        utmSource: additionalData?.stm?.source,
        utmMedium: additionalData?.stm?.medium,
        utmCampaign: additionalData?.stm?.campaign,
        utmTerm: additionalData?.stm?.term,
        utmContent: additionalData?.stm?.content,
        // Performance
        loadTime: additionalData?.performance?.loadTime,
        // JSON Metadata
        eventData: additionalData?.metadata
          ? JSON.parse(JSON.stringify(additionalData.metadata))
          : undefined,
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Error recording analytic event:', error)
    // Silently fail to not disrupt user experience
    return { success: false }
  }
}

export async function getAnalyticsDashboardData() {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // 1. General Performance
    const totalVisits = await prisma.analyticLog.count({
      where: {
        timestamp: { gte: sevenDaysAgo },
        eventType: { endsWith: '_VIEW' },
      },
    })

    const detailVisits = await prisma.analyticLog.count({
      where: {
        timestamp: { gte: sevenDaysAgo },
        eventType: 'PROJECT_DETAIL_OPEN',
      },
    })

    const contactLeads = await prisma.analyticLog.count({
      where: {
        timestamp: { gte: sevenDaysAgo },
        eventType: 'CONTACT_SUBMIT',
      },
    })

    // 2. Trend Chart (Last 7 days)
    // Prisma doesn't support date truncation in groupBy easily across all DBs,
    // but for Postgres we can use raw query or just fetch and process in JS for small datasets.
    // Given it's a portfolio, dataset might be small enough to fetch last 7 days logs and process.
    // Or use groupBy on timestamp if we can truncate.
    // Let's fetch relevant logs and process in JS for simplicity and DB compatibility.
    const lastWeekLogs = await prisma.analyticLog.findMany({
      where: {
        timestamp: { gte: sevenDaysAgo },
        eventType: { endsWith: '_VIEW' },
      },
      select: { timestamp: true },
    })

    const trendData = processTrendData(lastWeekLogs)

    // 3. Top Projects
    const topProjectsRaw = await prisma.analyticLog.groupBy({
      by: ['entityId'],
      where: {
        eventType: 'PROJECT_DETAIL_OPEN', // Using DETAIL_OPEN as proxy for interest, or PROJECT_VIEW if implemented
        entityType: 'Project',
        entityId: { not: null },
      },
      _count: {
        entityId: true,
      },
      orderBy: {
        _count: {
          entityId: 'desc',
        },
      },
      take: 5,
    })

    // Fetch project titles
    const topProjects = await Promise.all(
      topProjectsRaw.map(async (item) => {
        if (!item.entityId) return null
        const project = await prisma.project.findUnique({
          where: { id: item.entityId },
          select: { title: true },
        })
        return {
          title: project?.title || 'Unknown Project',
          count: item._count.entityId,
        }
      })
    )

    // 4. Device Usage
    const deviceLogs = await prisma.analyticLog.findMany({
      where: { timestamp: { gte: sevenDaysAgo } },
      select: { userAgent: true },
    })

    const deviceUsage = processDeviceUsage(deviceLogs)

    // 5. Location (Top IPs)
    const topLocationsRaw = await prisma.analyticLog.groupBy({
      by: ['ipAddress'],
      where: { timestamp: { gte: sevenDaysAgo } },
      _count: { ipAddress: true },
      orderBy: { _count: { ipAddress: 'desc' } },
      take: 5,
    })

    const topLocations = topLocationsRaw.map((item) => ({
      ip: item.ipAddress || 'Unknown',
      count: item._count.ipAddress,
    }))

    return {
      totalVisits,
      detailVisits,
      contactLeads,
      trendData,
      topProjects: topProjects.filter(Boolean),
      deviceUsage,
      topLocations,
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return null
  }
}

function processTrendData(logs: { timestamp: Date }[]) {
  const days: Record<string, number> = {}

  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    days[dateStr] = 0
  }

  logs.forEach((log) => {
    const dateStr = log.timestamp.toISOString().split('T')[0]
    if (days[dateStr] !== undefined) {
      days[dateStr]++
    }
  })

  return Object.entries(days).map(([date, count]) => ({ date, count }))
}

function processDeviceUsage(logs: { userAgent: string | null }[]) {
  let mobile = 0
  let desktop = 0

  logs.forEach((log) => {
    const ua = log.userAgent?.toLowerCase() || ''
    if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
      mobile++
    } else {
      desktop++
    }
  })

  return { mobile, desktop }
}
