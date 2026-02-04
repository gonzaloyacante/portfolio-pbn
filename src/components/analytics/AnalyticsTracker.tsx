'use client'

import { useEffect } from 'react'
import { recordAnalyticEvent } from '@/actions/analytics'

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
  useEffect(() => {
    recordAnalyticEvent(eventType, entityId, entityType)
  }, [eventType, entityId, entityType])

  return null
}
