'use server'

import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/security-server'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'

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

export async function recordAnalyticEvent(
  eventType: string,
  entityId?: string,
  entityType?: string,
  options?: RecordEventOptions
) {
  void eventType
  void entityId
  void entityType
  void options

  /*
   * Custom DB analytics are intentionally disabled.
   * GA4 owns public traffic metrics, and duplicating events in Neon burns
   * free-tier compute for a small portfolio/admin used by one or two people.
   */
  return { success: true, disabled: true }
}

/** Cached operational counts for the admin dashboard. No visitor analytics. */
const _fetchDashboardContentStats = unstable_cache(
  async () => {
    const [
      imagesCount,
      categoriesCount,
      servicesCount,
      testimonialsCount,
      deletedCount,
      contactsCount,
      pendingTestimonials,
      pendingBookings,
      categoriesWithoutImages,
      servicesWithoutImage,
    ] = await Promise.all([
      prisma.categoryImage.count({ where: { category: { deletedAt: null } } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.service.count({ where: { deletedAt: null } }),
      prisma.testimonial.count({ where: { isActive: true, deletedAt: null } }),
      prisma.category.count({ where: { deletedAt: { not: null } } }),
      prisma.contact.count({ where: { isRead: false, deletedAt: null } }),
      prisma.testimonial.count({ where: { isActive: false, deletedAt: null } }),
      prisma.booking.count({ where: { status: 'PENDING', deletedAt: null } }),
      prisma.category.count({
        where: {
          deletedAt: null,
          OR: [{ coverImageUrl: null }, { coverImageUrl: '' }],
          images: { none: {} },
        },
      }),
      prisma.service.count({
        where: {
          deletedAt: null,
          OR: [{ imageUrl: null }, { imageUrl: '' }],
        },
      }),
    ])
    return {
      imagesCount,
      categoriesCount,
      servicesCount,
      testimonialsCount,
      deletedCount,
      contactsCount,
      pendingTestimonials,
      pendingBookings,
      categoriesWithoutImages,
      servicesWithoutImage,
    }
  },
  ['dashboard-content-stats'],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [CACHE_TAGS.categories, CACHE_TAGS.testimonials, CACHE_TAGS.contacts],
  }
)

export async function getDashboardContentStats() {
  await requireAdmin()
  return _fetchDashboardContentStats()
}

export async function getAnalyticsDashboardData() {
  await requireAdmin()
  return null
}

export async function getExtendedAnalyticsData() {
  await requireAdmin()
  return null
}
