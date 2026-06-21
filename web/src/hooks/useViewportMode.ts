'use client'

import { useSyncExternalStore } from 'react'
import { BREAKPOINTS } from '@/config/breakpoints'
import type { ViewportMode } from '@/components/features/visual-editor/types'

/**
 * Devuelve el viewport actual: 'mobile' (<md), 'tablet' (md-lg), 'desktop' (>=lg).
 * SSR-safe: devuelve 'desktop' en server, valor real después de hidratación.
 */
export function useViewportMode(): ViewportMode {
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`)
    const tabletQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
    )
    mobileQuery.addEventListener('change', callback)
    tabletQuery.addEventListener('change', callback)
    return () => {
      mobileQuery.removeEventListener('change', callback)
      tabletQuery.removeEventListener('change', callback)
    }
  }

  const getSnapshot = (): ViewportMode => {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    if (w < BREAKPOINTS.md) return 'mobile'
    if (w < BREAKPOINTS.lg) return 'tablet'
    return 'desktop'
  }

  const getServerSnapshot = (): ViewportMode => 'desktop'

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
