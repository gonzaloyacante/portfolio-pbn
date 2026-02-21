'use client'

import { useSyncExternalStore } from 'react'

/**
 * Returns true when the viewport width is < breakpoint px (default 768 = Tailwind `md`).
 * SSR-safe: returns false on the server, correct value after hydration.
 * Uses useSyncExternalStore to avoid setState-in-effect ESLint violations.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`

  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', callback)
      return () => mq.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false // server snapshot — avoids hydration mismatch
  )
}
