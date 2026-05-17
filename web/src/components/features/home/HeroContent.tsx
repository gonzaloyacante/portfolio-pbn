'use client'

import { useMemo } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
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

  return (
    <div className="relative isolate w-full overflow-x-clip">
      <section
        className={cn(
          'public-home-hero relative z-10 flex min-h-[calc(100svh-var(--public-nav-offset))] w-full flex-col justify-center overflow-x-hidden px-4 transition-colors duration-500 sm:px-8 md:min-h-[calc(100dvh-var(--public-nav-offset))] lg:px-16'
        )}
      >
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
