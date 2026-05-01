'use client'

import { useMemo } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { FontLoader } from './FontLoader'
import { HeroContentProps } from './heroTypes'
import { HeroTitles } from './HeroTitles'
import { HeroSignature } from './HeroSignature'
import { HeroMainImage } from './HeroMainImage'
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
    <section className="relative flex min-h-[calc(100dvh-80px)] w-full flex-col justify-center overflow-x-hidden bg-(--background) px-4 transition-colors duration-500 sm:px-8 lg:px-16">
      <FontLoader fonts={fontsToLoad} />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 lg:grid lg:min-h-[80vh] lg:grid-cols-12 lg:gap-12 lg:py-0">
        {/* Left column: Titles + Signature */}
        <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:py-16">
          <HeroTitles {...sectionProps} />
          <HeroSignature {...sectionProps} />
        </div>

        {/* Right column: Main image + CTA */}
        <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:items-center lg:justify-center">
          <HeroMainImage {...sectionProps} />
          <HeroCta {...sectionProps} />
          <div className="pointer-events-none absolute bottom-0 -left-10 z-0 h-32 w-32 rounded-full bg-(--secondary) opacity-20 blur-2xl" />
        </div>
      </div>
    </section>
  )
}
