'use client'

import { useEffect } from 'react'
import { FadeIn } from '@/components/ui'
import { FontLoader } from '@/components/features/home/FontLoader'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
  DEFAULT_SERVICES_PAGE_LIST_INTRO,
  type ServicesPageSettingsData,
} from '@/lib/services-page-settings'

interface ServicesPublicHeroProps {
  settings: ServicesPageSettingsData | null
}

export function ServicesPublicHero({ settings }: ServicesPublicHeroProps) {
  // Public web colors are fixed; CMS title colors stay disabled here for now.
  void settings?.listTitleColor
  void settings?.listTitleColorDark

  const isMobile = useIsMobile()
  const rawTitle = settings?.listTitle?.trim() || 'Maquillaje profesional para cada ocasión'
  const title =
    rawTitle.toLowerCase() === 'mis servicios'
      ? 'Maquillaje profesional para cada ocasión'
      : rawTitle
  const intro =
    settings?.listIntro?.trim() && settings.listIntro.trim().length > 0
      ? settings.listIntro.trim()
      : DEFAULT_SERVICES_PAGE_LIST_INTRO

  const fontName = settings?.listTitleFont?.trim() || ''
  const fontUrl = settings?.listTitleFontUrl?.trim() || ''
  const titlePx = isMobile
    ? (settings?.listTitleMobileFontSize ?? settings?.listTitleFontSize)
    : settings?.listTitleFontSize

  useEffect(() => {
    if (!fontUrl) return
    const safe = fontUrl.trim()
    const dup = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (el) => el.getAttribute('href') === safe
    )
    if (dup) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = safe
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }, [fontUrl])

  const fontFamily =
    fontName.length > 0
      ? `"${fontName}", var(--font-heading), sans-serif`
      : 'var(--font-heading), sans-serif'

  return (
    <>
      {!fontUrl && fontName ? <FontLoader fonts={[fontName]} /> : null}
      <FadeIn className="mb-12 text-center">
        <h1
          className="public-services-title mb-4 leading-tight font-semibold"
          style={{
            fontFamily,
            fontSize: titlePx != null ? `${titlePx}px` : 'var(--font-heading-size, 2rem)',
          }}
        >
          {title}
        </h1>
        <p className="public-services-muted mx-auto max-w-2xl text-lg leading-relaxed">{intro}</p>
      </FadeIn>
    </>
  )
}
