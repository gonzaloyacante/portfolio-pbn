/**
 * Legacy facade kept for compatibility.
 * DB-backed custom analytics are disabled; GA4 owns public traffic metrics.
 */
class AnalyticsManager {
  static async trackEvent(eventType: string, entityId?: string, entityType?: string) {
    void eventType
    void entityId
    void entityType
  }

  static async trackPageView(url: string) {
    void url
  }
}

export default AnalyticsManager
