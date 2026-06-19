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
  // Public web colors are fixed; CMS color overrides stay disabled here for now.
  void s.heroTitle1Color
  void s.heroTitle1ColorDark
  void s.heroTitle2Color
  void s.heroTitle2ColorDark

  const title1 = s.heroTitle1Text || 'Make-up'
  const title2 = s.heroTitle2Text || 'Portfolio'
  const normalizedTitle2 = title2.trim().toLowerCase()
  const eff = resolveEffectiveValues(s, isMobile)
  const show1 = isEditor || (s.showHeroTitle1 ?? true)
  const shouldSuppressDefaultTitle2 = !isEditor && normalizedTitle2 === 'portfolio'
  const show2 = (isEditor || (s.showHeroTitle2 ?? true)) && !shouldSuppressDefaultTitle2

  return (
    <div className="order-1 col-span-1 flex w-full flex-col items-start text-left lg:order-0">
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
                'public-hero-title-primary leading-[0.9]',
                eff.title1FontSize ? '' : 'text-6xl sm:text-8xl lg:text-[7rem] xl:text-[8rem]'
              )}
              style={{
                fontFamily: s.heroTitle1FontUrl
                  ? s.heroTitle1Font!
                  : 'var(--font-brand, var(--font-script))',
                fontSize: eff.title1FontSize ? `${eff.title1FontSize}px` : undefined,
              }}
            >
              {title1}
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
                'public-hero-title-secondary text-shadow leading-[0.9] font-bold tracking-tighter',
                eff.title2FontSize ? '' : 'text-5xl sm:text-8xl lg:text-[6rem] xl:text-[7rem]'
              )}
              style={{
                fontFamily: s.heroTitle2FontUrl
                  ? s.heroTitle2Font!
                  : 'var(--font-portfolio, var(--font-heading))',
                fontSize: eff.title2FontSize ? `${eff.title2FontSize}px` : undefined,
              }}
            >
              {title2}
            </h2>
          </HeroWrapper>
        </SlideIn>
      )}
    </div>
  )
}
