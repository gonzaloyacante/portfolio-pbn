'use client'

import { FadeIn, OptimizedImage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { HeroSectionProps } from './heroTypes'
import { HeroWrapper } from './HeroWrapper'
import { resolveEffectiveValues } from './heroUtils'

export function HeroSignature({
  s,
  isEditor,
  selectedElement,
  onSelectElement,
  isMobile,
}: HeroSectionProps) {
  const ownerName = s.ownerNameText || 'Paola Bolívar Nievas'
  const illustration = s.illustrationUrl
  const illustrationAlt = s.illustrationAlt || 'Ilustración'
  const eff = resolveEffectiveValues(s, isMobile)

  return (
    <div className="order-4 mt-8 flex w-full items-center justify-center gap-4 lg:relative lg:order-0 lg:mt-0 lg:justify-start lg:gap-0">
      <div className="flex flex-row items-center justify-center lg:flex-col lg:items-end lg:justify-start">
        {/* Illustration */}
        <div className="relative z-0 lg:-mr-20 lg:mb-0 lg:-ml-10">
          <HeroWrapper
            id="illustration"
            isEditor={isEditor}
            selectedElement={selectedElement}
            onSelectElement={onSelectElement}
            className={cn('relative h-24 w-24 lg:h-80 lg:w-80', !isEditor && 'opacity-80')}
            style={{
              zIndex: s.illustrationZIndex ?? 0,
              opacity: (s.illustrationOpacity ?? 80) / 100,
              transform: `translate(${eff.illOffsetX}px, ${eff.illOffsetY}px) rotate(${eff.illRotation}deg) scale(${eff.illSize / 100})`,
            }}
          >
            <div className="relative h-full w-full">
              {illustration ? (
                <OptimizedImage
                  src={illustration}
                  alt={illustrationAlt}
                  fill
                  objectFit="contain"
                  sizes="(max-width: 1024px) 96px, 320px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-pink-500/30 bg-pink-500/10">
                  <span className="text-xs text-pink-500">Sin Ilustración</span>
                </div>
              )}
            </div>
          </HeroWrapper>
        </div>

        {/* Owner name / signature */}
        <div className="relative z-10">
          <FadeIn delay={0.6} disabled={isEditor}>
            <HeroWrapper
              id="ownerName"
              isEditor={isEditor}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              style={{
                zIndex: s.ownerNameZIndex ?? 15,
                transform: `translate(${eff.ownerOffsetX}px, ${eff.ownerOffsetY}px)`,
              }}
            >
              <p
                className="text-sm font-bold tracking-widest text-(--foreground)"
                style={{
                  fontFamily: s.ownerNameFontUrl
                    ? s.ownerNameFont!
                    : 'var(--font-signature, var(--font-heading))',
                  fontSize: eff.ownerFontSize ? `${eff.ownerFontSize}px` : undefined,
                }}
              >
                <span className="dark:hidden" style={{ color: s.ownerNameColor || 'inherit' }}>
                  {ownerName}
                </span>
                <span
                  className="hidden dark:inline"
                  style={{ color: s.ownerNameColorDark || s.ownerNameColor || 'inherit' }}
                >
                  {ownerName}
                </span>
              </p>
            </HeroWrapper>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
