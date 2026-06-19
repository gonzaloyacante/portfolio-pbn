'use client'

import { useMemo } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { buildHeroScrimBackground, buildHeroBackdropTint } from '@/lib/hero-backdrop-styles'
import { FontLoader } from './FontLoader'
import { HeroContentProps } from './heroTypes'
import { HeroTitles } from './HeroTitles'
import { HeroSignature } from './HeroSignature'
import { HeroCta } from './HeroCta'
import { HomeSettingsData } from '@/actions/settings/home'

export function HeroContent({
  settings,
  isEditor = false,
  selectedElement = null,
  onSelectElement,
  forceIsMobile,
}: HeroContentProps) {
  const s = settings || ({} as Partial<HomeSettingsData>)
  const actualIsMobile = useIsMobile()
  const isMobile = forceIsMobile ?? actualIsMobile

  const fontsHash = [
    s.heroTitle1Font,
    s.heroTitle2Font,
    s.ownerNameFont,
    s.ctaFont,
    s.featuredTitleFont,
  ]
    .filter(Boolean)
    .join('|')

  const fontsToLoad = useMemo(() => fontsHash.split('|'), [fontsHash])

  const sectionProps = { s, isEditor, selectedElement, onSelectElement, isMobile }

  const baseScrimParams = {
    extentPercent: s.heroScrimExtentPercent ?? 45,
    opacityPercent: s.heroScrimOpacity ?? 80,
    featherPercent: s.heroScrimFeatherPercent ?? 50,
    colorLightHex: s.heroScrimColor ?? null,
    colorDarkHex: s.heroScrimColorDark ?? null,
    prefersDark: false,
  }
  const mobileExtent = s.heroScrimMobileExtentPercent ?? baseScrimParams.extentPercent
  const mobileOpacity = s.heroScrimMobileOpacity ?? baseScrimParams.opacityPercent
  const mobileParams = {
    ...baseScrimParams,
    extentPercent: mobileExtent,
    opacityPercent: mobileOpacity,
  }

  const scrims = isMobile
    ? ([
        (s.heroScrimMobileShowTop ?? true) &&
          buildHeroScrimBackground({ ...mobileParams, edge: 'top' }),
        (s.heroScrimMobileShowLeft ?? false) &&
          buildHeroScrimBackground({ ...mobileParams, edge: 'left' }),
        (s.heroScrimMobileShowRight ?? false) &&
          buildHeroScrimBackground({ ...mobileParams, edge: 'right' }),
      ].filter(Boolean) as string[])
    : ([
        (s.heroScrimShowTop ?? true) &&
          buildHeroScrimBackground({ ...baseScrimParams, edge: 'top' }),
        (s.heroScrimShowLeft ?? true) &&
          buildHeroScrimBackground({ ...baseScrimParams, edge: 'left' }),
        (s.heroScrimShowRight ?? false) &&
          buildHeroScrimBackground({ ...baseScrimParams, edge: 'right' }),
      ].filter(Boolean) as string[])

  const tint = buildHeroBackdropTint(s.heroBackdropTintOpacity ?? 0)

  return (
    <div className="relative isolate w-full overflow-x-clip">
      <section
        className={cn(
          'public-home-hero relative z-10 flex min-h-[100svh] w-full flex-col justify-end overflow-x-hidden px-4 pb-16 transition-colors duration-500 sm:px-8 md:min-h-[100dvh] lg:justify-center lg:px-16 lg:pb-0'
        )}
      >
        {tint && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: tint }}
          />
        )}
        {scrims.map((bg, i) => (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: bg }}
          />
        ))}
        <FontLoader fonts={fontsToLoad} />
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 lg:grid lg:min-h-[80dvh] lg:grid-cols-12 lg:gap-12 lg:py-0">
          <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:py-16">
            <HeroTitles {...sectionProps} />
            <HeroSignature {...sectionProps} />
          </div>

          <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:items-center lg:justify-center">
            {/* Imagen destacada del hero desactivada temporalmente en pública y preview admin. */}
            <HeroCta {...sectionProps} />
          </div>
        </div>
      </section>
    </div>
  )
}
