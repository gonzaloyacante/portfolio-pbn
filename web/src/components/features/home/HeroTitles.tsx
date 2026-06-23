'use client'

import { FadeIn, SlideIn } from '@/components/ui'
import { CMS_HERO_COLORS_ENABLED } from '@/config/feature-flags'
import { cn } from '@/lib/utils'
import { HeroSectionProps } from './heroTypes'
import { HeroWrapper } from './HeroWrapper'
import { resolveEffectiveValues } from './heroUtils'

/**
 * Aplica el color per-elemento del CMS al style inline.
 *
 * - Si el flag está apagado: no aplica nada → CSS theme gana.
 * - Si el flag está prendido y hay color: aplica como CSS var. Si está vacío,
 *   `var(--cms-color)` queda `undefined` → el CSS theme hace fallback al default.
 *
 * Cuando se active el flag, descomentar también las props titleColor en
 * `app/(public)/page.tsx` para que `FeaturedCategories` reciba los colores.
 */
function cmsColorStyle(
  color: string | null | undefined,
  dark: string | null | undefined
): React.CSSProperties {
  if (!CMS_HERO_COLORS_ENABLED) return {}
  const style: Record<string, string | undefined> = {
    '--cms-color': color ?? undefined,
    '--cms-color-dark': dark ?? undefined,
  }
  return style as React.CSSProperties
}

export function HeroTitles({
  s,
  isEditor,
  selectedElement,
  onSelectElement,
  viewportMode,
}: HeroSectionProps) {
  const title1 = s.heroTitle1Text || 'Make-up'
  const title2 = s.heroTitle2Text || 'Portfolio'
  const normalizedTitle2 = title2.trim().toLowerCase()
  const eff = resolveEffectiveValues(s, viewportMode)
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
                ...cmsColorStyle(s.heroTitle1Color, s.heroTitle1ColorDark),
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
                ...cmsColorStyle(s.heroTitle2Color, s.heroTitle2ColorDark),
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
