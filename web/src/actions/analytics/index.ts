'use server'

import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import { headers } from 'next/headers'
import { requireAdmin } from '@/lib/security-server'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'

// -----------------------------------------------
// Types
// -----------------------------------------------
export interface RecordEventOptions {
  sessionId?: string
  scrollDepth?: number
  timeOnPage?: number
  sessionDuration?: number
  device?: string
  clickTarget?: string
  vitalsLCP?: number
  vitalsFCP?: number
  vitalsINP?: number
  vitalsCLS?: number
  isDuplicate?: boolean
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

// -----------------------------------------------
// Helpers
// -----------------------------------------------
function anonymizeIp(ip: string): string {
  // Zero last octet for GDPR compliance
  if (ip.includes('.')) {
    // IPv4
    const parts = ip.split('.')
    parts[3] = '0'
    return parts.join('.')
  }
  if (ip.includes(':')) {
    // IPv6: zero last group
    const parts = ip.split(':')
    parts[parts.length - 1] = '0'
    return parts.join(':')
  }
  return ip
}

function detectDevice(ua: string): string {
  const lower = ua.toLowerCase()
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(lower)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(lower)) return 'mobile'
  return 'desktop'
}

const BOT_RE =
  /bot|crawl|spider|slurp|scan|headless|phantom|selenium|puppeteer|playwright|wget|curl|python-requests/i

// -----------------------------------------------
// Record Event
// -----------------------------------------------

/** Ventana de sesión: si la misma IP aparece en menos de 30 minutos,
 *  se considera la misma sesión (isDuplicate = true). */
const SESSION_WINDOW_MS = 30 * 60 * 1000

export async function recordAnalyticEvent(
  eventType: string,
  entityId?: string,
  entityType?: string,
  options?: RecordEventOptions
) {
  try {
    const headersList = await headers()
    const rawIp = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const referer = headersList.get('referer') || null

    // Vercel edge geo headers (GeoIP — probabilístico, nivel ciudad)
    const vercelCountry = headersList.get('x-vercel-ip-country') || undefined
    const vercelCity = headersList.get('x-vercel-ip-city') || undefined
    const vercelRegion = headersList.get('x-vercel-ip-country-region') || undefined
    const latRaw = headersList.get('x-vercel-ip-latitude')
    const lonRaw = headersList.get('x-vercel-ip-longitude')

    // Coordenadas del cliente (precisas, con consentimiento explícito)
    const clientGeo = options?.metadata?.geo as
      | { latitude?: number; longitude?: number; accuracy?: number }
      | undefined
    const consentLevel = (options?.metadata?.consentLevel as string | undefined) ?? 'geoip'

    // Preferir coordenadas del cliente sobre GeoIP cuando el consentimiento es preciso
    const usePrecise = consentLevel === 'precise' && clientGeo?.latitude !== undefined
    const country = vercelCountry
    const city = vercelCity
    const region = vercelRegion
    const latitude = usePrecise ? clientGeo!.latitude : latRaw ? parseFloat(latRaw) : undefined
    const longitude = usePrecise ? clientGeo!.longitude : lonRaw ? parseFloat(lonRaw) : undefined

    const distinctIp = rawIp.split(',')[0].trim()
    const ipAddress = anonymizeIp(distinctIp)
    const isBot = BOT_RE.test(userAgent)
    const device = options?.device ?? detectDevice(userAgent)

    // ── Deduplicación de sesión ───────────────────────────────────────────────
    // Si la misma IP ya registró un evento en los últimos 30 min →
    //   isDuplicate = true (misma sesión navegando entre páginas).
    // Esto permite contar visitantes únicos filtrando isDuplicate:false.
    let isDuplicate = options?.isDuplicate ?? false
    let sessionIdToUse = options?.sessionId

    // Solo deduplicar eventos de página (no acciones como CONTACT_SUBMIT)
    if (!isDuplicate && !isBot && eventType.endsWith('_VIEW')) {
      const windowStart = new Date(Date.now() - SESSION_WINDOW_MS)
      const recentEvent = await prisma.analyticLog.findFirst({
        where: {
          ipAddress,
          timestamp: { gte: windowStart },
          isBot: false,
        },
        select: { sessionId: true },
        orderBy: { timestamp: 'desc' },
      })
      if (recentEvent !== null) {
        isDuplicate = true
        // Heredar sessionId del primer evento de la sesión
        if (!sessionIdToUse && recentEvent.sessionId) {
          sessionIdToUse = recentEvent.sessionId
        }
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    await prisma.analyticLog.create({
      data: {
        eventType,
        entityId,
        entityType,
        ipAddress,
        userAgent,
        referrer: referer,
        country,
        city,
        region,
        latitude,
        longitude,
        device,
        isBot,
        isDuplicate,
        sessionId: sessionIdToUse,
        scrollDepth: options?.scrollDepth,
        timeOnPage: options?.timeOnPage,
        sessionDuration: options?.sessionDuration,
        clickTarget: options?.clickTarget,
        vitalsLCP: options?.vitalsLCP,
        vitalsFCP: options?.vitalsFCP,
        vitalsINP: options?.vitalsINP,
        vitalsCLS: options?.vitalsCLS,
        utmSource: options?.stm?.source,
        utmMedium: options?.stm?.medium,
        utmCampaign: options?.stm?.campaign,
        utmTerm: options?.stm?.term,
        utmContent: options?.stm?.content,
        loadTime: options?.performance?.loadTime,
        pageUrl: options?.metadata?.url as string | undefined,
        consentLevel: consentLevel,
      },
    })
    return { success: true }
  } catch (error) {
    logger.error('Error recording analytic event:', { error })
    return { success: false }
  }
}

/** Cached content counts for Dashboard header section — TTL 2 min */
const _fetchDashboardContentStats = unstable_cache(
  async () => {
    const [
      imagesCount,
      categoriesCount,
      testimonialsCount,
      deletedCount,
      contactsCount,
      pendingTestimonials,
    ] = await Promise.all([
      prisma.categoryImage.count(),
      prisma.category.count(),
      prisma.testimonial.count({ where: { isActive: true } }),
      prisma.category.count({ where: { deletedAt: { not: null } } }),
      prisma.contact.count({ where: { isRead: false } }),
      prisma.testimonial.count({ where: { isActive: false } }),
    ])
    return {
      imagesCount,
      categoriesCount,
      testimonialsCount,
      deletedCount,
      contactsCount,
      pendingTestimonials,
    }
  },
  ['dashboard-content-stats'],
  {
    revalidate: CACHE_DURATIONS.SHORT * 2,
    tags: [CACHE_TAGS.categories, CACHE_TAGS.testimonials, CACHE_TAGS.contacts],
  }
)

export async function getDashboardContentStats() {
  await requireAdmin()
  return _fetchDashboardContentStats()
}

// -----------------------------------------------
// Dashboard Data (7-day summary) — all queries in parallel
// -----------------------------------------------
/** Cached DB queries for the 7-day summary — auth check excluded from cache */
const _fetchAnalyticsDashboardData = unstable_cache(
  async () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const where7d = { timestamp: { gte: sevenDaysAgo } }

    const [
      totalVisits,
      detailVisits,
      contactLeads,
      trendRaw,
      topViewsRaw,
      deviceGroups,
      topLocationsRaw,
    ] = await Promise.all([
      // 1. Total page views (last 7 days)
      prisma.analyticLog.count({
        where: { ...where7d, eventType: { endsWith: '_VIEW' }, isBot: false },
      }),
      // 2. Category gallery views
      prisma.analyticLog.count({
        where: { ...where7d, eventType: 'CATEGORY_VIEW', isBot: false },
      }),
      // 3. Contact form leads
      prisma.analyticLog.count({
        where: { ...where7d, eventType: 'CONTACT_SUBMIT', isBot: false },
      }),
      // 4. Trend data: aggregate by day in DB — avoids fetching all timestamps
      prisma.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE_TRUNC('day', timestamp) AS date, COUNT(*)::bigint AS count
        FROM "AnalyticLog"
        WHERE timestamp >= ${sevenDaysAgo}
          AND "eventType" LIKE '%_VIEW'
          AND "isBot" = false
        GROUP BY DATE_TRUNC('day', timestamp)
        ORDER BY date ASC
      `,
      // 5. Top categories by view count
      prisma.analyticLog.groupBy({
        by: ['entityId'],
        where: {
          ...where7d,
          eventType: 'CATEGORY_VIEW',
          entityType: 'Category',
          entityId: { not: null },
          isBot: false,
        },
        _count: { entityId: true },
        orderBy: { _count: { entityId: 'desc' } },
        take: 5,
      }),
      // 6. Device groups (unique visitors: isDuplicate=false)
      prisma.analyticLog.groupBy({
        by: ['device'],
        where: { ...where7d, isBot: false, isDuplicate: false },
        _count: { device: true },
      }),
      // 7. Top locations by city+country (no raw IPs)
      prisma.analyticLog.groupBy({
        by: ['city', 'country'],
        where: { ...where7d, city: { not: null }, isBot: false, isDuplicate: false },
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
        take: 8,
      }),
    ])

    // --- Build trend map from DB aggregation ---
    const trendData = buildTrendData(trendRaw)

    // --- Process top categories ---
    const categoryIds = topViewsRaw.map((r) => r.entityId).filter(Boolean) as string[]
    const categoriesMap = new Map(
      (
        await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, name: true },
        })
      ).map((p) => [p.id, p.name])
    )
    const topCategories = topViewsRaw
      .map((item) => {
        if (!item.entityId) return null
        return {
          title: categoriesMap.get(item.entityId) ?? 'Categoría desconocida',
          count: item._count.entityId,
        }
      })
      .filter(Boolean) as { title: string; count: number }[]

    // --- Process device usage ---
    const deviceUsage = { mobile: 0, tablet: 0, desktop: 0 }
    for (const row of deviceGroups) {
      const dev = (row.device ?? 'desktop') as 'mobile' | 'tablet' | 'desktop'
      if (dev in deviceUsage) deviceUsage[dev] = row._count.device
    }

    // --- Process top locations (city/country, no IPs) ---
    const topLocations = topLocationsRaw.map((row) => ({
      location: [row.city, row.country].filter(Boolean).join(', ') || 'Desconocido',
      count: row._count.city,
    }))

    return {
      totalVisits,
      detailVisits,
      contactLeads,
      trendData,
      topCategories,
      deviceUsage,
      topLocations,
    }
  },
  ['analytics-dashboard-7d'],
  { revalidate: CACHE_DURATIONS.SHORT * 2, tags: [CACHE_TAGS.analytics] }
)

export async function getAnalyticsDashboardData() {
  await requireAdmin()
  try {
    return await _fetchAnalyticsDashboardData()
  } catch (error) {
    logger.error('Error fetching analytics data:', { error })
    return null
  }
}

// -----------------------------------------------
// Extended Analytics (for world map + vitals)
// -----------------------------------------------
const _fetchExtendedAnalyticsData = unstable_cache(
  async (days: number) => {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const where = { timestamp: { gte: since }, isBot: false }

    const [vitalsRows, geoRows, countryRows] = await Promise.all([
      prisma.analyticLog.aggregate({
        where: { ...where, vitalsLCP: { not: null } },
        _avg: {
          vitalsLCP: true,
          vitalsFCP: true,
          vitalsINP: true,
          vitalsCLS: true,
          scrollDepth: true,
          timeOnPage: true,
        },
      }),
      prisma.analyticLog.findMany({
        where: { ...where, latitude: { not: null }, longitude: { not: null } },
        select: { latitude: true, longitude: true, city: true, country: true },
        distinct: ['city', 'country'],
        take: 200,
      }),
      prisma.analyticLog.groupBy({
        by: ['country'],
        where: { ...where, country: { not: null } },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 60,
      }),
    ])

    return {
      avgVitalsLCP: vitalsRows._avg.vitalsLCP,
      avgVitalsFCP: vitalsRows._avg.vitalsFCP,
      avgVitalsINP: vitalsRows._avg.vitalsINP,
      avgVitalsCLS: vitalsRows._avg.vitalsCLS,
      avgScrollDepth: vitalsRows._avg.scrollDepth,
      avgTimeOnPage: vitalsRows._avg.timeOnPage,
      geoPoints: buildGeoPoints(geoRows),
      countryCounts: buildCountryCounts(countryRows),
    }
  },
  ['analytics-extended'],
  { revalidate: CACHE_DURATIONS.SHORT * 2, tags: [CACHE_TAGS.analytics] }
)

export async function getExtendedAnalyticsData(days = 30) {
  await requireAdmin()
  try {
    return await _fetchExtendedAnalyticsData(days)
  } catch (error) {
    logger.error('Error fetching extended analytics:', { error })
    return null
  }
}

// -----------------------------------------------
// Helpers
// -----------------------------------------------

/**
 * Builds a 7-day trend array from DB-aggregated rows (DATE_TRUNC query).
 * Days with no data get count = 0.
 */
function buildTrendData(rows: { date: Date; count: bigint }[]) {
  const days: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days[d.toISOString().split('T')[0]] = 0
  }
  for (const row of rows) {
    const key = new Date(row.date).toISOString().split('T')[0]
    if (key in days) days[key] = Number(row.count)
  }
  return Object.entries(days).map(([date, count]) => ({ date, count }))
}

function buildGeoPoints(
  rows: {
    latitude: number | null
    longitude: number | null
    city: string | null
    country: string | null
  }[]
) {
  return rows
    .filter((r) => r.latitude !== null && r.longitude !== null)
    .map((r) => ({
      lat: r.latitude!,
      lon: r.longitude!,
      city: r.city ?? '',
      country: r.country ?? '',
    }))
}

function buildCountryCounts(rows: { country: string | null; _count: { country: number } }[]) {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    if (row.country) counts[row.country] = row._count.country
  }
  return counts
}
