'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import AnalyticsManager from '@/lib/analytics'

// Paths that must NEVER be tracked — admin UI navigation, auth pages and API calls
const PRIVATE_PREFIXES = ['/admin', '/auth', '/api']

function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Skip internal routes — only track public portfolio pages
    if (PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    AnalyticsManager.trackPageView(url)
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  )
}
