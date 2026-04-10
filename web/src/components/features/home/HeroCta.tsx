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
  const ctaText = s.ctaText || 'Ver Portfolio'
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
            <Button
              asChild
              size={mapButtonSize(s.ctaSize)}
              variant={mapCtaVariant(s.ctaVariant)}
              style={{
                fontFamily: s.ctaFontUrl ? s.ctaFont! : 'inherit',
                fontSize: eff.ctaFontSize ? `${eff.ctaFontSize}px` : undefined,
              }}
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </MagneticButton>
        )}
      </HeroWrapper>
    </div>
  )
}
