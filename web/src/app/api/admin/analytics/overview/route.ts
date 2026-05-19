/**
 * GET /api/admin/analytics/overview
 *
 * Custom visitor analytics are disabled to avoid Neon compute burn.
 * This endpoint is kept for the Flutter admin dashboard contract and returns
 * only operational counters plus empty analytics fields.
 */

import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { CACHE_DURATIONS, CACHE_TAGS } from '@/lib/cache-tags'

const getDashboardOverviewData = unstable_cache(
  async () => {
    const [
      totalImages,
      totalCategories,
      totalServices,
      totalTestimonials,
      newContacts,
      pendingBookings,
      pendingTestimonials,
      trashCount,
    ] = await Promise.all([
      prisma.categoryImage.count({ where: { category: { deletedAt: null } } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.service.count({ where: { deletedAt: null } }),
      prisma.testimonial.count({ where: { deletedAt: null } }),
      prisma.contact.count({ where: { isRead: false, deletedAt: null } }),
      prisma.booking.count({ where: { status: 'PENDING', deletedAt: null } }),
      prisma.testimonial.count({ where: { status: 'PENDING', deletedAt: null } }),
      Promise.all([
        prisma.category.count({ where: { deletedAt: { not: null } } }),
        prisma.service.count({ where: { deletedAt: { not: null } } }),
        prisma.testimonial.count({ where: { deletedAt: { not: null } } }),
        prisma.contact.count({ where: { deletedAt: { not: null } } }),
        prisma.booking.count({ where: { deletedAt: { not: null } } }),
      ]).then((counts) => counts.reduce((total, count) => total + count, 0)),
    ])

    return {
      totalImages,
      totalCategories,
      totalServices,
      totalTestimonials,
      newContacts,
      pendingBookings,
      pendingTestimonials,
      trashCount,
      pageViews30d: 0,
      uniqueVisitors30d: 0,
      deviceUsage: {},
      topLocations: [],
      topCategories: [],
      analyticsDisabled: true,
    }
  },
  ['admin-dashboard-overview-v1'],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [
      CACHE_TAGS.categories,
      CACHE_TAGS.services,
      CACHE_TAGS.testimonials,
      CACHE_TAGS.contacts,
    ],
  }
)

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    return NextResponse.json({
      success: true,
      data: await getDashboardOverviewData(),
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
