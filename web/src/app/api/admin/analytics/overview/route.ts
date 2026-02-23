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
      pageViews30d,
    ] = await Promise.all([
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.service.count({ where: { deletedAt: null } }),
      prisma.testimonial.count({ where: { deletedAt: null } }),
      prisma.contact.count({ where: { isRead: false, deletedAt: null } }),
      prisma.booking.count({
        where: { status: 'PENDING', deletedAt: null },
      }),
      prisma.analyticLog.count({
        where: { timestamp: { gte: thirtyDaysAgo } },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        totalCategories,
        totalServices,
        totalTestimonials,
        newContacts,
        pendingBookings,
        pageViews30d,
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
