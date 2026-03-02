'use client'

import { useEffect, useRef } from 'react'
import { recordAnalyticEvent } from '@/actions/analytics'
import { ANALYTIC_EVENTS } from '@/lib/analytics-events'
import type { RecordEventOptions } from '@/actions/analytics'

interface AnalyticsTrackerProps {
  eventType: string
  entityId?: string
  entityType?: string
}

// ── Session management (deduplication) ───────────────────────────────────────

const SESSION_TTL_MS = 30 * 60 * 1000 // 30 minutes
const SESSION_KEY = 'pbn_session_id'
const SESSION_PAGES_KEY = 'pbn_session_pages'

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      const { id, expiresAt } = JSON.parse(stored) as { id: string; expiresAt: number }
      if (Date.now() < expiresAt) {
        // Refresh TTL on activity
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ id, expiresAt: Date.now() + SESSION_TTL_MS })
        )
        return id
      }
    }
    const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id: newId, expiresAt: Date.now() + SESSION_TTL_MS })
    )
    return newId
  } catch {
    return `${Date.now()}-anon`
  }
}

function isPageAlreadyTrackedInSession(pageKey: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(SESSION_PAGES_KEY)
    const pages: string[] = stored ? JSON.parse(stored) : []
    return pages.includes(pageKey)
  } catch {
    return false
  }
}

function markPageTrackedInSession(pageKey: string): void {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(SESSION_PAGES_KEY)
    const pages: string[] = stored ? JSON.parse(stored) : []
    if (!pages.includes(pageKey)) {
      pages.push(pageKey)
      localStorage.setItem(SESSION_PAGES_KEY, JSON.stringify(pages))
    }
  } catch {
    // silent
  }
}

// ── Geo consent helpers ──────────────────────────────────────────────────────

function getGeoConsent(): 'granted' | 'denied' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'
  try {
    const v = localStorage.getItem('geo-consent')
    if (v === 'granted') return 'granted'
    if (v === 'denied') return 'denied'
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

/**
 * Intenta obtener las coordenadas del navegador si el usuario dio consentimiento.
 * Resuelve con null en cualquier error o si no hay consentimiento.
 */
function tryGetBrowserCoords(): Promise<GeolocationCoordinates | null> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return Promise.resolve(null)
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5 * 60 * 1000 }
    )
  })
}

// ── Advanced Tracker ─────────────────────────────────────────────────────────

export default function AnalyticsTracker({
  eventType,
  entityId,
  entityType,
}: AnalyticsTrackerProps) {
  const entryTimeRef = useRef<number>(0)
  const maxScrollRef = useRef<number>(0)
  const sessionIdRef = useRef<string>('')
  const trackedRef = useRef<boolean>(false)

  useEffect(() => {
    const sessionId = getOrCreateSessionId()
    sessionIdRef.current = sessionId
    entryTimeRef.current = Date.now()

    // Deduplication: skip if same page+event was already tracked in this session
    const pageKey = `${eventType}:${entityId ?? window.location.pathname}`
    const isDuplicate = isPageAlreadyTrackedInSession(pageKey)

    if (!isDuplicate) {
      markPageTrackedInSession(pageKey)
      trackedRef.current = true

      const geoConsent = getGeoConsent()

      const options: RecordEventOptions = {
        sessionId,
        metadata: {
          url: window.location.href,
          referrer: document.referrer || undefined,
          consentLevel:
            geoConsent === 'granted' ? 'precise' : geoConsent === 'denied' ? 'denied' : 'geoip',
        },
      }

      recordAnalyticEvent(eventType, entityId, entityType, options).catch(() => {})

      // Si el usuario consintió geolocalización precisa, intentar obtener coords
      // y enviar un evento de enriquecimiento geo (no bloquea el tracking principal).
      if (geoConsent === 'granted') {
        tryGetBrowserCoords().then((coords) => {
          if (coords) {
            recordAnalyticEvent(ANALYTIC_EVENTS.PAGE_VIEW, entityId, entityType, {
              sessionId,
              isDuplicate: true, // enriquecimiento, no nueva visita
              metadata: {
                url: window.location.href,
                consentLevel: 'precise',
                geo: {
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  accuracy: Math.round(coords.accuracy),
                },
              },
            }).catch(() => {})
          }
        })
      }
    }

    // ── Scroll depth tracking ────────────────────────────────────────────
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const scrollPercent = Math.round((scrollTop / docHeight) * 100)
        if (scrollPercent > maxScrollRef.current) {
          maxScrollRef.current = scrollPercent
        }
      }
    }

    // ── Click tracking ───────────────────────────────────────────────────
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const label =
        target.getAttribute('aria-label') ||
        target.getAttribute('data-track') ||
        target.closest('[data-track]')?.getAttribute('data-track') ||
        target.tagName.toLowerCase()

      const interestingTags = ['a', 'button', 'img']
      const tagName = target.tagName.toLowerCase()
      if (!interestingTags.includes(tagName) && !target.closest('a, button')) return

      recordAnalyticEvent(ANALYTIC_EVENTS.CLICK, entityId, entityType, {
        sessionId: sessionIdRef.current,
        clickTarget: label,
      }).catch(() => {})
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('click', handleClick)

    // ── Web Vitals ───────────────────────────────────────────────────────
    let vitalsLCP: number | undefined
    let vitalsFCP: number | undefined
    let vitalsINP: number | undefined
    let vitalsCLS: number | undefined

    import('web-vitals')
      .then(({ onLCP, onFCP, onINP, onCLS }) => {
        onLCP((m) => {
          vitalsLCP = m.value
        })
        onFCP((m) => {
          vitalsFCP = m.value
        })
        onINP((m) => {
          vitalsINP = m.value
        })
        onCLS((m) => {
          vitalsCLS = m.value
        })
      })
      .catch(() => {})

    // ── Send engagement data on page unload ──────────────────────────────
    const sendEngagement = () => {
      if (!trackedRef.current) return
      const timeOnPage = Math.round((Date.now() - entryTimeRef.current) / 1000)
      if (timeOnPage < 2) return // Skip very fast bounces

      const opts: RecordEventOptions = {
        sessionId: sessionIdRef.current,
        scrollDepth: maxScrollRef.current,
        timeOnPage,
      }
      if (vitalsLCP !== undefined) opts.vitalsLCP = vitalsLCP
      if (vitalsFCP !== undefined) opts.vitalsFCP = vitalsFCP
      if (vitalsINP !== undefined) opts.vitalsINP = vitalsINP
      if (vitalsCLS !== undefined) opts.vitalsCLS = vitalsCLS

      if (vitalsLCP !== undefined || maxScrollRef.current > 0) {
        recordAnalyticEvent(ANALYTIC_EVENTS.TIME_ON_PAGE, entityId, entityType, opts).catch(
          () => {}
        )
      }
    }

    // Use visibilitychange (more reliable than beforeunload across devices)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendEngagement()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', sendEngagement)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('click', handleClick)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', sendEngagement)
    }
  }, [eventType, entityId, entityType])

  return null
}
