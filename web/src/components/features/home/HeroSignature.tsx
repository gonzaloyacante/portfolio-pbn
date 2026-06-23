'use client'

import { FadeIn, OptimizedImage, motion } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { cn } from '@/lib/utils'
import { HeroSectionProps } from './heroTypes'
import { HeroWrapper } from './HeroWrapper'
import { resolveEffectiveValues } from './heroUtils'

export function HeroSignature({
  s,
  isEditor,
  selectedElement,
  onSelectElement,
  viewportMode,
}: HeroSectionProps) {
  // Public web colors are fixed; CMS color overrides stay disabled here for now.
  void s.ownerNameColor
  void s.ownerNameColorDark

  const ownerName = s.ownerNameText || 'Paola Bolívar Nievas'
  const illustration = s.illustrationUrl
  const illustrationAlt = s.illustrationAlt || 'Ilustración'
  const eff = resolveEffectiveValues(s, viewportMode)
  const showOwner = isEditor || (s.showOwnerName ?? true)
  const showIllustration = isEditor || (s.showIllustration ?? true)

  return (
    <div className="order-3 col-span-2 mt-1 flex w-full items-center justify-start gap-4 lg:relative lg:order-0 lg:mt-2 lg:justify-start lg:gap-0">
      <div className="flex flex-row items-center justify-center lg:flex-col lg:items-start lg:justify-start">
        {/* Illustration */}
        {showIllustration && (
          <div className="relative z-0 lg:mb-0">
            <HeroWrapper
              id="illustration"
              isEditor={isEditor}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              className={cn('relative h-28 w-28 lg:h-72 lg:w-72', !isEditor && 'opacity-90')}
              style={{
                zIndex: s.illustrationZIndex ?? 0,
                opacity: (s.illustrationOpacity ?? 80) / 100,
                transform: `translate(${eff.illOffsetX}px, ${eff.illOffsetY}px) rotate(${eff.illRotation}deg) scale(${eff.illSize / 100})`,
              }}
            >
              <motion.div
                layoutId={!isEditor && illustration ? 'public-brand-mark' : undefined}
                className="relative h-full w-full"
              >
                {illustration ? (
                  <OptimizedImage
                    src={illustration}
                    alt={illustrationAlt}
                    fill
                    objectFit="contain"
                    sizes={IMAGE_SIZES.heroIllustration}
                    priority={!isEditor}
                  />
                ) : (
                  <div className="public-hero-placeholder flex h-full w-full items-center justify-center rounded-full border-2 border-dashed">
                    <span className="text-xs">Sin Ilustración</span>
                  </div>
                )}
              </motion.div>
            </HeroWrapper>
          </div>
        )}

        {/* Owner name / signature */}
        {showOwner && (
          <div className="relative z-10 lg:mt-3">
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
                  className={cn(
                    'public-hero-owner-name font-bold tracking-widest',
                    eff.ownerFontSize ? '' : 'text-sm'
                  )}
                  style={{
                    fontFamily: s.ownerNameFontUrl
                      ? s.ownerNameFont!
                      : 'var(--font-signature, var(--font-heading))',
                    fontSize: eff.ownerFontSize ? `${eff.ownerFontSize}px` : undefined,
                  }}
                >
                  {ownerName}
                </p>
              </HeroWrapper>
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  )
}
