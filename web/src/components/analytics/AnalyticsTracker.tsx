'use client'

interface AnalyticsTrackerProps {
  eventType: string
  entityId?: string
  entityType?: string
}

export default function AnalyticsTracker({
  eventType,
  entityId,
  entityType,
}: AnalyticsTrackerProps) {
  void eventType
  void entityId
  void entityType

  /*
   * DB-backed public analytics are intentionally disabled.
   * GA4 owns pageviews/engagement; re-enabling Neon writes here would burn
   * free-tier compute on every navigation.
   */
  return null
}
