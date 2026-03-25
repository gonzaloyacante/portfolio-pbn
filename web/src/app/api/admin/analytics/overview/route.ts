/**
 * GET /api/admin/analytics/overview
 * Resumen de métricas del panel de administración.
 * Devuelve contadores de entidades y actividad reciente.
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalProjects,
      totalCategories,
      totalServices,
      totalTestimonials,
      newContacts,
      pendingBookings,
      pendingTestimonials,
      trashCount,
      pageViews30d,
      uniqueVisitors30d,
      deviceUsageRaw,
      topCountriesRaw,
      topProjectsRaw,
    ] = await Promise.all([
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.service.count({ where: { deletedAt: null } }),
      prisma.testimonial.count({ where: { deletedAt: null } }),
      prisma.contact.count({ where: { isRead: false, deletedAt: null } }),
      prisma.booking.count({
        where: { status: 'PENDING', deletedAt: null },
      }),
      prisma.testimonial.count({
        where: { status: 'PENDING', deletedAt: null },
      }),
      // Total de elementos en la papelera (soft-deleted)
      Promise.all([
        prisma.project.count({ where: { deletedAt: { not: null } } }),
        prisma.category.count({ where: { deletedAt: { not: null } } }),
        prisma.service.count({ where: { deletedAt: { not: null } } }),
        prisma.testimonial.count({ where: { deletedAt: { not: null } } }),
        prisma.contact.count({ where: { deletedAt: { not: null } } }),
        prisma.booking.count({ where: { deletedAt: { not: null } } }),
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
      // Total de páginas vistas (sin bots, últimos 30 días)
      prisma.analyticLog.count({
        where: {
          timestamp: { gte: thirtyDaysAgo },
          eventType: { endsWith: '_VIEW' },
          isBot: false,
        },
      }),
      // Visitantes únicos = sesiones únicas (isDuplicate:false = primer evento de cada sesión)
      prisma.analyticLog.count({
        where: {
          timestamp: { gte: thirtyDaysAgo },
          eventType: { endsWith: '_VIEW' },
          isBot: false,
          isDuplicate: false,
        },
      }),
      // Contamos visitantes únicos por dispositivo (primer evento de sesión)
      prisma.analyticLog.groupBy({
        by: ['device'],
        where: {
          timestamp: { gte: thirtyDaysAgo },
          eventType: { endsWith: '_VIEW' },
          isBot: false,
          isDuplicate: false,
        },
        _count: { _all: true },
      }),
      // Top países por visitas (últimos 30 días)
      // Incluimos country NULL para contabilizar como 'unknown' y mostrar
      // por qué la suma de países puede ser menor que el total de visitas.
      prisma.analyticLog.groupBy({
        by: ['country'],
        where: {
          timestamp: { gte: thirtyDaysAgo },
          eventType: { endsWith: '_VIEW' },
          isBot: false,
          // Mostrar países según visitantes únicos (primer evento de sesión)
          isDuplicate: false,
        },
        _count: { _all: true },
        orderBy: { _count: { id: 'desc' } },
        take: 12,
      }),
      // Top proyectos vistos (últimos 30 días)
      prisma.analyticLog.groupBy({
        by: ['entityId'],
        where: {
          timestamp: { gte: thirtyDaysAgo },
          entityType: 'project',
          isBot: false,
          entityId: { not: null },
        },
        _count: { _all: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ])

    // Reducir deviceUsage: null device se contabiliza como 'unknown'
    const deviceUsage = deviceUsageRaw.reduce<Record<string, number>>((acc, row) => {
      const key = row.device ?? 'unknown'
      acc[key] = (acc[key] ?? 0) + row._count._all
      return acc
    }, {})

    // ── Batch: Resolver coordenadas representativas por país ────────────────
    const countryKeys = topCountriesRaw.map((r) => r.country)
    const countryCoords = await prisma.analyticLog.findMany({
      where: {
        country: { in: countryKeys.filter((c): c is string => c !== null) },
        latitude: { not: null },
        longitude: { not: null },
      },
      select: { country: true, latitude: true, longitude: true },
      distinct: ['country'],
    })
    const coordsByCountry = new Map(
      countryCoords.map((c) => [c.country, { lat: c.latitude, lng: c.longitude }])
    )

    // ── Batch: Top ciudades por país (una sola groupBy con country+city) ──
    const citiesRaw = await prisma.analyticLog.groupBy({
      by: ['country', 'city'],
      where: {
        timestamp: { gte: thirtyDaysAgo },
        eventType: { endsWith: '_VIEW' },
        isBot: false,
        country: { in: countryKeys.filter((c): c is string => c !== null) },
      },
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
    })

    // ── Batch: Coordenadas representativas por ciudad ─────────────────────
    const cityPairs = citiesRaw
      .filter((c) => c.city !== null)
      .map((c) => ({ country: c.country!, city: c.city! }))
    const cityCoords =
      cityPairs.length > 0
        ? await prisma.analyticLog.findMany({
            where: {
              OR: cityPairs.map((p) => ({
                country: p.country,
                city: p.city,
                latitude: { not: null },
                longitude: { not: null },
              })),
            },
            select: { country: true, city: true, latitude: true, longitude: true },
            distinct: ['country', 'city'],
          })
        : []
    const coordsByCity = new Map(
      cityCoords.map((c) => [`${c.country}|${c.city}`, { lat: c.latitude, lng: c.longitude }])
    )

    // ── Agrupar ciudades por país (máx 8 por país) ───────────────────────
    const citiesByCountry = new Map<string, Array<{ city: string | null; count: number }>>()
    for (const row of citiesRaw) {
      const key = row.country ?? 'unknown'
      const arr = citiesByCountry.get(key) ?? []
      if (arr.length < 8) {
        arr.push({ city: row.city, count: row._count._all })
      }
      citiesByCountry.set(key, arr)
    }

    // ── DisplayNames ─────────────────────────────────────────────────────
    type DisplayNamesConstructor = new (
      locales: string | string[],
      options?: { type: 'region' }
    ) => { of(code: string): string | undefined }

    const DisplayNamesCtor = (
      typeof Intl !== 'undefined'
        ? (Intl as unknown as { DisplayNames?: DisplayNamesConstructor }).DisplayNames
        : undefined
    ) as DisplayNamesConstructor | undefined

    const displayNames = DisplayNamesCtor ? new DisplayNamesCtor(['es'], { type: 'region' }) : null

    // ── Construir topLocations sin queries adicionales ────────────────────
    const topLocations = topCountriesRaw.map(({ country, _count }) => {
      const countryKey = country ?? 'unknown'
      const countryTotal = _count._all
      const rep = country ? coordsByCountry.get(country) : undefined

      const rawCities = citiesByCountry.get(countryKey) ?? []
      const cities = rawCities.map(({ city, count }) => {
        let cityName = city ?? 'unknown'
        try {
          cityName = decodeURIComponent(cityName)
        } catch {
          // Keep original if decoding fails
        }
        const cityCoord = city && country ? coordsByCity.get(`${country}|${city}`) : undefined
        return {
          label: cityName,
          count,
          percent: countryTotal > 0 ? Math.round((count / countryTotal) * 100) : 0,
          latitude: cityCoord?.lat ?? null,
          longitude: cityCoord?.lng ?? null,
        }
      })

      let displayName: string
      if (country) {
        displayName = displayNames?.of(country) || country
      } else {
        displayName = 'unknown'
      }

      return {
        code: countryKey,
        label: displayName,
        count: countryTotal,
        latitude: rep?.lat ?? null,
        longitude: rep?.lng ?? null,
        cities,
      }
    })

    // ── Batch: Resolver nombres de proyectos ─────────────────────────────
    const projectIds = topProjectsRaw
      .map((r) => r.entityId)
      .filter((id): id is string => id !== null)
    const projectRecords =
      projectIds.length > 0
        ? await prisma.project.findMany({
            where: { id: { in: projectIds } },
            select: { id: true, title: true },
          })
        : []
    const projectTitleMap = new Map(projectRecords.map((p) => [p.id, p.title]))

    const topProjects = topProjectsRaw.map(({ entityId, _count }) => ({
      label: (entityId ? projectTitleMap.get(entityId) : null) ?? entityId ?? 'Desconocido',
      count: _count._all,
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        totalCategories,
        totalServices,
        totalTestimonials,
        newContacts,
        pendingBookings,
        pendingTestimonials,
        trashCount,
        pageViews30d,
        uniqueVisitors30d,
        deviceUsage,
        topLocations,
        topProjects,
      },
    })
  } catch (err) {
    logger.error('[analytics-overview] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
