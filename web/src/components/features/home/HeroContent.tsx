'use client'

import { useMemo } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { FontLoader } from './FontLoader'
import { HeroContentProps } from './heroTypes'
import { HeroTitles } from './HeroTitles'
import { HeroSignature } from './HeroSignature'
import { HeroMainImage } from './HeroMainImage'
import { HeroCta } from './HeroCta'
import { HeroImmersiveBackdrop } from './HeroImmersiveBackdrop'
import { HomeSettingsData } from '@/actions/settings/home'

export function HeroContent({
  settings,
  isEditor = false,
  selectedElement = null,
  onSelectElement,
  forceIsMobile,
  ambientExtendsFeatured = false,
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
  const immersive = !!s.heroImmersiveEnabled

  return (
    <div
      className={cn(
        'relative isolate w-full overflow-x-clip',
        immersive && '-mt-[var(--public-nav-offset)] pt-[var(--public-nav-offset)]'
      )}
    >
      {immersive ? (
        <HeroImmersiveBackdrop
          settings={s}
          isMobile={isMobile}
          extendBelowFeatured={ambientExtendsFeatured && !isEditor}
        />
      ) : null}

      <section
        className={cn(
          'relative z-10 flex min-h-[calc(100svh-var(--public-nav-offset))] w-full flex-col justify-center overflow-x-hidden px-4 transition-colors duration-500 sm:px-8 md:min-h-[calc(100dvh-var(--public-nav-offset))] lg:px-16',
          immersive ? 'bg-transparent' : 'bg-(--background)'
        )}
      >
        <FontLoader fonts={fontsToLoad} />

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 lg:grid lg:min-h-[80dvh] lg:grid-cols-12 lg:gap-12 lg:py-0">
          {/* Left column: Titles + Signature */}
          <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:py-16">
            <HeroTitles {...sectionProps} />
            <HeroSignature {...sectionProps} />
          </div>

          {/* Right column: Main image + CTA */}
          <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:items-center lg:justify-center">
            <HeroMainImage {...sectionProps} />
            <HeroCta {...sectionProps} />
            {!immersive ? (
              <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-32 w-32 rounded-full bg-(--secondary) opacity-20 blur-2xl md:-left-6 lg:-left-10" />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
