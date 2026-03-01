import { logger } from '@/lib/logger'
import { recordAnalyticEvent } from '@/actions/analytics'
import { ROUTES } from '@/config/routes'
import { ANALYTIC_EVENTS } from '@/lib/analytics-events'

// ── Session Management ──────────────────────────────────────────────────────
// Una sesión = un visitante navegando la web sin cerrar el tab.
// sessionStorage se resetea al cerrar el tab → cada apertura nueva = nueva sesión.
const SESSION_KEY = 'pbn_sid'

function getOrCreateSessionId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    let sid = sessionStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid = crypto.randomUUID()
      sessionStorage.setItem(SESSION_KEY, sid)
    }
    return sid
  } catch {
    return undefined
  }
}

/**
 * Client-side Analytics Manager
 * Facade for tracking events and page views.
 *
 * Cada llamada lleva el sessionId de sessionStorage que identifica
 * unívocamente la sesión del visitante sin guardar datos personales.
 */
class AnalyticsManager {
  /**
   * Track a generic event
   */
  static async trackEvent(eventType: string, entityId?: string, entityType?: string) {
    try {
      const sessionId = getOrCreateSessionId()
      // Fire and forget - do not await to avoid blocking UI
      recordAnalyticEvent(eventType, entityId, entityType, { sessionId }).catch((err) => {
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
    // Determine page type based on URL — check detail before list to avoid false match
    let eventType: string = ANALYTIC_EVENTS.PAGE_VIEW
    if (url === ROUTES.home) eventType = ANALYTIC_EVENTS.HOME_VIEW
    else if (url.startsWith(ROUTES.public.projects + '/'))
      eventType = ANALYTIC_EVENTS.PROJECT_DETAIL_VIEW
    else if (url.startsWith(ROUTES.public.projects)) eventType = ANALYTIC_EVENTS.PROJECTS_VIEW
    else if (url.startsWith(ROUTES.public.about)) eventType = ANALYTIC_EVENTS.ABOUT_VIEW
    else if (url.startsWith(ROUTES.public.contact)) eventType = ANALYTIC_EVENTS.CONTACT_VIEW

    await this.trackEvent(eventType, url, 'Page')
  }
}

export default AnalyticsManager
