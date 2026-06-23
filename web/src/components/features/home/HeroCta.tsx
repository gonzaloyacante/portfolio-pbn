'use client'

import { MagneticButton } from '@/components/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { HeroSectionProps } from './heroTypes'
import { HeroWrapper } from './HeroWrapper'
import { mapButtonSize, mapCtaVariant, resolveEffectiveValues } from './heroUtils'

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
} as const

export function HeroCta({
  s,
  isEditor,
  selectedElement,
  onSelectElement,
  viewportMode,
}: HeroSectionProps) {
  // Toggle "Visible en la web pública": oculto en público si está apagado,
  // pero siempre visible en el editor para poder editarlo.
  if (!isEditor && s.showCtaButton === false) return null

  const rawCtaText = s.ctaText || 'Ver Portfolio'
  const ctaText =
    !isEditor && rawCtaText.trim().toLowerCase() === 'ver portfolio' ? 'Portfolio' : rawCtaText
  const ctaLink = s.ctaLink || '/portfolio'
  const eff = resolveEffectiveValues(s, viewportMode)

  const variant = mapCtaVariant(s.ctaVariant)
  const size = mapButtonSize(eff.ctaSize ?? s.ctaSize)
  const sizeClasses = SIZE_CLASSES[size]

  // El variant se aplica vía `data-variant` y se resuelve en `public-fixed-theme.css`
  // para que el CSS theme siga siendo la única fuente de colores del CTA.
  const ctaClassName = cn(
    'public-hero-cta-button inline-flex items-center justify-center rounded-xl font-semibold transition-opacity hover:opacity-90',
    sizeClasses
  )

  return (
    <div className="order-2 col-span-1 mt-0 flex items-center justify-end lg:order-0 lg:mt-8 lg:justify-start">
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
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                data-variant={variant}
                className={ctaClassName}
                style={{
                  fontFamily: s.ctaFontUrl ? s.ctaFont! : 'inherit',
                  fontSize: eff.ctaFontSize ? `${eff.ctaFontSize}px` : undefined,
                }}
              >
                {ctaText}
              </a>
            </MagneticButton>
          </div>
        ) : (
          <MagneticButton>
            <Link
              href={ctaLink}
              data-variant={variant}
              className={ctaClassName}
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
