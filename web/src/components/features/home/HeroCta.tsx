'use client'

import { Button, MagneticButton } from '@/components/ui'
import Link from 'next/link'
import { HeroSectionProps } from './heroTypes'
import { HeroWrapper } from './HeroWrapper'
import { mapButtonSize, mapCtaVariant, resolveEffectiveValues } from './heroUtils'

export function HeroCta({
  s,
  isEditor,
  selectedElement,
  onSelectElement,
  isMobile,
}: HeroSectionProps) {
  const rawCtaText = s.ctaText || 'Ver Portfolio'
  const ctaText =
    !isEditor && rawCtaText.trim().toLowerCase() === 'ver portfolio' ? 'Portfolio' : rawCtaText
  const ctaLink = s.ctaLink || '/portfolio'
  const eff = resolveEffectiveValues(s, isMobile)

  return (
    <div className="order-3 mt-6 lg:order-0 lg:mt-8">
      <HeroWrapper
        id="ctaButton"
        isEditor={isEditor}
        selectedElement={selectedElement}
        onSelectElement={onSelectElement}
        style={{
          transform: `translate(${eff.ctaOffsetX}px, ${eff.ctaOffsetY}px)`,
        }}
      >
        {isEditor ? (
          <div onClick={(e) => e.preventDefault()}>
            <MagneticButton>
              <Button
                size={mapButtonSize(s.ctaSize)}
                variant={mapCtaVariant(s.ctaVariant)}
                style={{
                  fontFamily: s.ctaFontUrl ? s.ctaFont! : 'inherit',
                  fontSize: eff.ctaFontSize ? `${eff.ctaFontSize}px` : undefined,
                }}
              >
                {ctaText}
              </Button>
            </MagneticButton>
          </div>
        ) : (
          <MagneticButton>
            <Link
              href={ctaLink}
              className="public-hero-cta-button inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition-opacity hover:opacity-90"
              style={{
                fontFamily: s.ctaFontUrl ? s.ctaFont! : 'inherit',
                fontSize: eff.ctaFontSize ? `${eff.ctaFontSize}px` : undefined,
              }}
            >
              {ctaText}
            </Link>
          </MagneticButton>
        )}
      </HeroWrapper>
    </div>
  )
}
