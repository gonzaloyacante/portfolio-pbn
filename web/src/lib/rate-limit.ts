import { logger } from '@/lib/logger'
/**
 * Generic Rate Limiter
 * In-memory rate limiting for various use cases
 * For production with multiple instances, consider using Upstash Redis
 */

import { prisma } from '@/lib/db'
import type { RateLimitConfig } from './rate-limit-config'

interface RateLimitAttempt {
  identifier: string
  timestamp: Date
}

// In-memory storage
const rateLimitStore = new Map<string, RateLimitAttempt[]>()

/**
 * Create a rate limiter with custom configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  /**
   * Check if identifier is rate limited
   */
  async function check(identifier: string): Promise<{
    allowed: boolean
    remaining?: number
    resetIn?: number
  }> {
    const key = `${config.id}:${identifier}`
    const now = new Date()
    const windowStart = new Date(now.getTime() - config.window)

    // Get recent attempts
    let attempts = rateLimitStore.get(key) || []

    // Filter old attempts
    attempts = attempts.filter((attempt) => attempt.timestamp > windowStart)
    rateLimitStore.set(key, attempts)

    // Check if limited
    if (attempts.length >= config.limit) {
      const oldestAttempt = attempts[0]
      const resetIn = Math.ceil(
        (oldestAttempt.timestamp.getTime() + config.window - now.getTime()) / 1000
      )

      return {
        allowed: false,
        resetIn: resetIn > 0 ? resetIn : 1,
      }
    }

    return {
      allowed: true,
      remaining: config.limit - attempts.length,
    }
  }

  /**
   * Record an attempt
   */
  async function record(identifier: string, metadata?: Record<string, unknown>): Promise<void> {
    const key = `${config.id}:${identifier}`
    const attempts = rateLimitStore.get(key) || []

    attempts.push({
      identifier,
      timestamp: new Date(),
    })

    rateLimitStore.set(key, attempts)

    // Log to analytics (optional)
    try {
      await prisma.analyticLog.create({
        data: {
          eventType: `RATE_LIMIT_${config.id.toUpperCase()}`,
          ipAddress: identifier,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      })
    } catch (error) {
      logger.error(`Error logging rate limit attempt for ${config.id}`, { error })
    }
  }

  /**
   * Clear attempts for identifier
   */
  async function clear(identifier: string): Promise<void> {
    const key = `${config.id}:${identifier}`
    rateLimitStore.delete(key)
  }

  return {
    check,
    record,
    clear,
  }
}

/**
 * Cleanup old attempts periodically
 */
export function cleanupRateLimitStore(): void {
  const now = new Date()

  for (const [key, attempts] of rateLimitStore.entries()) {
    // Keep only attempts from last hour (conservative cleanup)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const recentAttempts = attempts.filter((attempt) => attempt.timestamp > oneHourAgo)

    if (recentAttempts.length === 0) {
      rateLimitStore.delete(key)
    } else {
      rateLimitStore.set(key, recentAttempts)
    }
  }
}

// Cleanup every 10 minutes (server-side only)
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000)
}
