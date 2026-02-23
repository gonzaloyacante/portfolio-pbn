/**
 * Centralized Analytics Event Types
 * Single source of truth for all event type constants.
 * Used by AnalyticsTracker, AnalyticsManager, and analytics actions.
 */

export const ANALYTIC_EVENTS = {
  // ── Page Views ──────────────────────────────────────────────────
  HOME_VIEW: 'HOME_VIEW',
  PROJECTS_VIEW: 'PROJECTS_VIEW',
  PROJECT_DETAIL_VIEW: 'PROJECT_DETAIL_VIEW',
  ABOUT_VIEW: 'ABOUT_VIEW',
  CONTACT_VIEW: 'CONTACT_VIEW',
  PAGE_VIEW: 'PAGE_VIEW',

  // ── Engagement ──────────────────────────────────────────────────
  CONTACT_SUBMIT: 'CONTACT_SUBMIT',
  CONTACT_WHATSAPP: 'CONTACT_WHATSAPP',
  CTA_CLICK: 'CTA_CLICK',
  SOCIAL_CLICK: 'SOCIAL_CLICK',
  CV_DOWNLOAD: 'CV_DOWNLOAD',

  // ── Scroll / Time ───────────────────────────────────────────────
  SCROLL_DEPTH: 'SCROLL_DEPTH',
  TIME_ON_PAGE: 'TIME_ON_PAGE',
  SESSION_END: 'SESSION_END',

  // ── Interaction ─────────────────────────────────────────────────
  CLICK: 'CLICK',
  ZOOM: 'ZOOM',
  VIDEO_PLAY: 'VIDEO_PLAY',

  // ── Performance (Web Vitals) ────────────────────────────────────
  WEB_VITALS: 'WEB_VITALS',
} as const

export type AnalyticEventType = (typeof ANALYTIC_EVENTS)[keyof typeof ANALYTIC_EVENTS]
