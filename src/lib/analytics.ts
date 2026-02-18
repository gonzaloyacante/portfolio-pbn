import { logger } from '@/lib/logger'
import { recordAnalyticEvent } from '@/actions/analytics'

/**
 * Client-side Analytics Manager
 * Facade for tracking events and page views
 */
class AnalyticsManager {
  /**
   * Track a generic event
   */
  static async trackEvent(eventType: string, entityId?: string, entityType?: string) {
    try {
      // Fire and forget - do not await to avoid blocking UI
      recordAnalyticEvent(eventType, entityId, entityType).catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          logger.warn('Analytics Error:', err)
        }
      })
    } catch {
      // Silent fail
    }
  }

  /**
   * Track a page view
   */
  static async trackPageView(url: string) {
    // Determine page type based on URL
    let eventType = 'PAGE_VIEW'
    if (url === '/') eventType = 'HOME_VIEW'
    else if (url.startsWith('/proyectos')) eventType = 'PROJECTS_VIEW'
    else if (url.startsWith('/sobre-mi')) eventType = 'ABOUT_VIEW'
    else if (url.startsWith('/contacto')) eventType = 'CONTACT_VIEW'
    else if (url.startsWith('/proyecto/')) eventType = 'PROJECT_DETAIL_VIEW'

    await this.trackEvent(eventType, url, 'Page')
  }
}

export default AnalyticsManager
