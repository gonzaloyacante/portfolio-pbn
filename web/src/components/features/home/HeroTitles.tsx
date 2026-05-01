'use client'

import { FadeIn, SlideIn } from '@/components/ui'
import { cn } from '@/lib/utils'
import { HeroSectionProps } from './heroTypes'
import { HeroWrapper } from './HeroWrapper'
import { resolveEffectiveValues } from './heroUtils'

export function HeroTitles({
  s,
  isEditor,
  selectedElement,
  onSelectElement,
  isMobile,
}: HeroSectionProps) {
  const title1 = s.heroTitle1Text || 'Make-up'
  const title2 = s.heroTitle2Text || 'Portfolio'
  const eff = resolveEffectiveValues(s, isMobile)
  const show1 = isEditor || (s.showHeroTitle1 ?? true)
  const show2 = isEditor || (s.showHeroTitle2 ?? true)

  return (
    <div className="order-1 flex w-full flex-col items-center text-center lg:order-0 lg:items-start lg:text-left">
      {show1 && (
        <FadeIn delay={0.2} className="relative z-20" disabled={isEditor}>
          <HeroWrapper
            id="heroTitle1"
            isEditor={isEditor}
            selectedElement={selectedElement}
            onSelectElement={onSelectElement}
            style={{
              zIndex: s.heroTitle1ZIndex ?? 20,
              transform: `translate(${eff.title1OffsetX}px, ${eff.title1OffsetY}px)`,
            }}
          >
            <h1
              className={cn(
                'leading-[0.9]',
                eff.title1FontSize ? '' : 'text-6xl sm:text-8xl lg:text-[7rem] xl:text-[8rem]'
              )}
              style={{
                fontFamily: s.heroTitle1FontUrl
                  ? s.heroTitle1Font!
                  : 'var(--font-brand, var(--font-script))',
                color: s.heroTitle1Color || 'var(--primary)',
                fontSize: eff.title1FontSize ? `${eff.title1FontSize}px` : undefined,
              }}
            >
              <span className="dark:hidden" style={{ color: s.heroTitle1Color || 'inherit' }}>
                {title1}
              </span>
              <span
                className="hidden dark:inline"
                style={{ color: s.heroTitle1ColorDark || s.heroTitle1Color || 'inherit' }}
              >
                {title1}
              </span>
            </h1>
          </HeroWrapper>
        </FadeIn>
      )}

      {show2 && (
        <SlideIn direction="left" delay={0.4} className="relative z-10" disabled={isEditor}>
          <HeroWrapper
            id="heroTitle2"
            isEditor={isEditor}
            selectedElement={selectedElement}
            onSelectElement={onSelectElement}
            style={{
              zIndex: s.heroTitle2ZIndex ?? 10,
              transform: `translate(${eff.title2OffsetX}px, ${eff.title2OffsetY}px)`,
            }}
          >
            <h2
              className={cn(
                'text-shadow leading-[0.9] font-bold tracking-tighter text-(--accent)',
                eff.title2FontSize ? '' : 'text-5xl sm:text-8xl lg:text-[6rem] xl:text-[7rem]'
              )}
              style={{
                fontFamily: s.heroTitle2FontUrl
                  ? s.heroTitle2Font!
                  : 'var(--font-portfolio, var(--font-heading))',
                fontSize: eff.title2FontSize ? `${eff.title2FontSize}px` : undefined,
              }}
            >
              <span className="dark:hidden" style={{ color: s.heroTitle2Color || 'inherit' }}>
                {title2}
              </span>
              <span
                className="hidden dark:inline"
                style={{ color: s.heroTitle2ColorDark || s.heroTitle2Color || 'inherit' }}
              >
                {title2}
              </span>
            </h2>
          </HeroWrapper>
        </SlideIn>
      )}
    </div>
  )
}
