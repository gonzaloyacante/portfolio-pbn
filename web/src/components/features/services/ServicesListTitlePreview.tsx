'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun, ExternalLink, Monitor, Smartphone } from 'lucide-react'
import { BRAND } from '@/lib/design-tokens'
import { ROUTES } from '@/config/routes'
import { DEFAULT_SERVICES_PAGE_LIST_INTRO } from '@/lib/services-page-settings'

interface ServicesListTitlePreviewProps {
  listTitle: string
  listIntro: string
  listTitleFont: string
  listTitleFontUrl: string
  listTitleFontSize: number | undefined
  listTitleMobileFontSize: number | undefined
  listTitleColor: string | undefined
  listTitleColorDark: string | undefined
}

export function ServicesListTitlePreview({
  listTitle,
  listIntro,
  listTitleFont,
  listTitleFontUrl,
  listTitleFontSize,
  listTitleMobileFontSize,
  listTitleColor,
  listTitleColorDark,
}: ServicesListTitlePreviewProps) {
  const [isDark, setIsDark] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  // Load custom font if provided
  useEffect(() => {
    if (!listTitleFontUrl) return
    const safe = listTitleFontUrl.trim()
    const dup = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (el) => el.getAttribute('href') === safe
    )
    if (dup) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = safe
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }, [listTitleFontUrl])

  const bg = isDark ? BRAND.darkBackground : BRAND.background
  const fg = isDark ? BRAND.darkForeground : BRAND.foreground
  const muted = isDark ? '#9ca3af' : '#6b7280'
  const borderColor = isDark ? '#2a1015' : '#e5e5e5'

  const lightColor = listTitleColor?.trim() || undefined
  const darkColor = listTitleColorDark?.trim() || listTitleColor?.trim() || undefined
  const titleColor = isDark ? (darkColor ?? fg) : (lightColor ?? fg)

  const fontFamily =
    listTitleFont.trim().length > 0
      ? `"${listTitleFont}", var(--font-heading), sans-serif`
      : 'var(--font-heading), sans-serif'

  const desktopSize = listTitleFontSize ?? 32
  const mobileSize = listTitleMobileFontSize ?? listTitleFontSize ?? 28
  const activeFontSize = isMobileView ? mobileSize : desktopSize

  const title = listTitle.trim() || 'Mis Servicios'
  const intro = listIntro.trim().length > 0 ? listIntro.trim() : DEFAULT_SERVICES_PAGE_LIST_INTRO

  return (
    <div
      className="border-border bg-card space-y-3 rounded-2xl border p-4"
      aria-label="Vista previa de la cabecera de servicios"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Vista previa — Servicios
        </p>
        <div className="flex items-center gap-2">
          <a
            href={ROUTES.public.services}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Ver en la web"
          >
            <ExternalLink className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setIsMobileView((v) => !v)}
            className={`text-muted-foreground hover:text-foreground bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${isMobileView ? 'text-foreground bg-accent' : ''}`}
            aria-label={isMobileView ? 'Ver en escritorio' : 'Ver en móvil'}
            title={isMobileView ? `Escritorio (${desktopSize}px)` : `Móvil (${mobileSize}px)`}
          >
            {isMobileView ? <Smartphone className="size-3" /> : <Monitor className="size-3" />}
            {isMobileView ? 'Móvil' : 'Escritorio'}
          </button>
          <button
            type="button"
            onClick={() => setIsDark((d) => !d)}
            className="text-muted-foreground hover:text-foreground bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun className="size-3" /> : <Moon className="size-3" />}
            {isDark ? 'Claro' : 'Oscuro'}
          </button>
        </div>
      </div>

      {/* Hero simulation */}
      <div className="overflow-hidden rounded-xl border" style={{ background: bg, borderColor }}>
        <div className="px-6 py-8 text-center">
          <h2
            className="mb-3 leading-tight font-semibold"
            style={{
              fontFamily,
              fontSize: activeFontSize,
              color: titleColor,
              transition: 'color 0.3s, font-size 0.2s',
            }}
          >
            {title}
          </h2>
          <p className="mx-auto max-w-xs text-sm leading-relaxed" style={{ color: muted }}>
            {intro.length > 140 ? intro.slice(0, 140) + '…' : intro}
          </p>
        </div>

        {/* Simulated service cards */}
        <div className="grid grid-cols-2 gap-2 border-t px-4 pt-3 pb-4" style={{ borderColor }}>
          {['Servicio A', 'Servicio B', 'Servicio C', 'Servicio D'].map((s) => (
            <div
              key={s}
              className="rounded-lg px-3 py-2.5 text-center text-xs font-medium"
              style={{
                background: isDark ? '#1c0a0f' : '#fff',
                color: isDark ? '#fafafa' : '#1a050a',
                border: `1px solid ${borderColor}`,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Font info */}
      {listTitleFont && (
        <p className="text-muted-foreground text-xs">
          Fuente: <span className="font-medium">{listTitleFont}</span>
          {' · '}
          {isMobileView ? mobileSize : desktopSize}px
          {listTitleMobileFontSize !== listTitleFontSize &&
            ` (escritorio: ${desktopSize}px · móvil: ${mobileSize}px)`}
        </p>
      )}
    </div>
  )
}
