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
      // Uso por dispositivo (últimos 30 días) — incluye null como "unknown"
      prisma.analyticLog.groupBy({
        by: ['device'],
        where: {
          timestamp: { gte: thirtyDaysAgo },
          eventType: { endsWith: '_VIEW' },
          isBot: false,
        },
        _count: { _all: true },
      }),
      // Top países por visitas (últimos 30 días)
      prisma.analyticLog.groupBy({
        by: ['country'],
        where: {
          timestamp: { gte: thirtyDaysAgo },
          eventType: { endsWith: '_VIEW' },
          isBot: false,
          country: { not: null },
        },
        _count: { _all: true },
        orderBy: { _count: { id: 'desc' } },
        take: 8,
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

    // Resolver lat/lng representativo por país + nombre
    const topLocations = await Promise.all(
      topCountriesRaw.map(async ({ country, _count }) => {
        const rep = await prisma.analyticLog.findFirst({
          where: { country, latitude: { not: null }, longitude: { not: null } },
          select: { latitude: true, longitude: true },
        })
        return {
          label: country!,
          count: _count._all,
          latitude: rep?.latitude ?? null,
          longitude: rep?.longitude ?? null,
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
