'use server'

import { unstable_cache } from 'next/cache'

import { prisma } from '@/lib/db'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'
import { logger } from '@/lib/logger'
import { requireAdmin } from '@/lib/security-server'

// ============================================
// PUBLIC GETTERS
// ============================================

/**
 * Get all active services for public view
 */
export const getActiveServices = unstable_cache(
  async () => {
    try {
      const services = await prisma.service.findMany({
        where: { isActive: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      })
      return services
    } catch (error) {
      logger.error('Error fetching active services:', { error })
      return []
    }
  },
  [CACHE_TAGS.services],
  { revalidate: CACHE_DURATIONS.VERY_LONG, tags: [CACHE_TAGS.services] }
)

/**
 * Get a service by slug for public view
 */
export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const service = await prisma.service.findFirst({
        where: { slug, isActive: true, deletedAt: null },
        include: {
          pricingTiers: { orderBy: { sortOrder: 'asc' } },
        },
      })
      return service
    } catch (error) {
      logger.error('Error fetching service by slug:', { error })
      return null
    }
  },
  [CACHE_TAGS.services],
  { revalidate: CACHE_DURATIONS.VERY_LONG, tags: [CACHE_TAGS.services] }
)

/**
 * Get all services for admin view (auth-protected)
 */
const _getServicesCached = unstable_cache(
  async () => {
    try {
      const services = await prisma.service.findMany({
        where: { deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      })
      return services
    } catch (error) {
      logger.error('Error fetching services:', { error })
      return []
    }
  },
  [CACHE_TAGS.services],
  { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.services] }
)

export async function getServices() {
  await requireAdmin()
  return _getServicesCached()
}
