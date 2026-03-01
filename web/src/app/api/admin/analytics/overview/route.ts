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

    // Resolver lat/lng representativo por país + nombre y desglose por ciudades
    // Intl.DisplayNames may not exist in all runtimes. Create a typed constructor
    // reference to avoid using `any` or `@ts-ignore` inline comments.
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

    const topLocations = await Promise.all(
      topCountriesRaw.map(async ({ country, _count }) => {
        const countryKey = country ?? 'unknown'

        // Representative coordinates (si existen)
        const rep = await prisma.analyticLog.findFirst({
          where: { country: country, latitude: { not: null }, longitude: { not: null } },
          select: { latitude: true, longitude: true },
        })

        // Top ciudades dentro del país (últimos 30 días)
        const citiesRaw = await prisma.analyticLog.groupBy({
          by: ['city'],
          where: {
            timestamp: { gte: thirtyDaysAgo },
            eventType: { endsWith: '_VIEW' },
            isBot: false,
            country: country,
          },
          _count: { _all: true },
          orderBy: { _count: { id: 'desc' } },
          take: 8,
        })

        const countryTotal = _count._all

        // For each city, try to resolve a representative lat/lng
        const cities = await Promise.all(
          citiesRaw.map(async ({ city, _count: c }) => {
            const cityName = city ?? 'unknown'
            const repCity = await prisma.analyticLog.findFirst({
              where: { country: country, city, latitude: { not: null }, longitude: { not: null } },
              select: { latitude: true, longitude: true },
            })
            return {
              label: cityName,
              count: c._all,
              percent: countryTotal > 0 ? Math.round((c._all / countryTotal) * 100) : 0,
              latitude: repCity?.latitude ?? null,
              longitude: repCity?.longitude ?? null,
            }
          })
        )

        // Resolve display name for country code, prefer Intl.DisplayNames when available
        let displayName: string
        if (country) {
          if (displayNames) {
            displayName = displayNames.of(country) || country
          } else {
            displayName = country
          }
        } else {
          displayName = 'unknown'
        }

        return {
          code: countryKey,
          label: displayName,
          count: countryTotal,
          latitude: rep?.latitude ?? null,
          longitude: rep?.longitude ?? null,
          cities,
        }
      })
    )

    // Resolver nombre de proyecto
    const topProjects = await Promise.all(
      topProjectsRaw.map(async ({ entityId, _count }) => {
        const proj = entityId
          ? await prisma.project.findUnique({
              where: { id: entityId },
              select: { title: true },
            })
          : null
        return { label: proj?.title ?? entityId ?? 'Desconocido', count: _count._all }
      })
    )

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
