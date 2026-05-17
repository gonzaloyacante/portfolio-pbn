'use client'

import { Suspense } from 'react'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        {/*
          DB-backed pageview tracking disabled.
          GA4 already handles public traffic analytics, and duplicating
          navigation events in Neon was wasting free-tier compute.
          TODO: Reintroduce custom analytics only for business-critical
          events or after moving pageview aggregation out of Neon writes.
        */}
        {null}
      </Suspense>
    </>
  )
}
