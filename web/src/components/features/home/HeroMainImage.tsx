'use client'

import { OptimizedImage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { HeroSectionProps } from './heroTypes'
import { HeroWrapper } from './HeroWrapper'
import { resolveEffectiveValues } from './heroUtils'

export function HeroMainImage({
  s,
  isEditor,
  selectedElement,
  onSelectElement,
  isMobile,
}: HeroSectionProps) {
  const mainImage = s.heroMainImageUrl
  const mainImageAlt = s.heroMainImageAlt || 'Hero Image'
  const caption = s.heroMainImageCaption
  const eff = resolveEffectiveValues(s, isMobile)

  return (
    <div className="order-2 flex w-full justify-center lg:order-0 lg:flex-1 lg:items-center">
      <HeroWrapper
        id="heroMainImage"
        isEditor={isEditor}
        selectedElement={selectedElement}
        onSelectElement={onSelectElement}
        className="relative flex max-w-full items-center justify-center"
        style={{
          zIndex: s.heroMainImageZIndex ?? 5,
          transform: `translate(${eff.imgOffsetX}px, ${eff.imgOffsetY}px)`,
        }}
      >
        {mainImage ? (
          <div className="relative w-full">
            <div
              className={cn(
                'relative overflow-hidden transition-all duration-500',
                s.heroImageStyle === 'rounded' && 'rounded-3xl',
                s.heroImageStyle === 'circle' && 'rounded-full',
                s.heroImageStyle === 'portrait' && 'aspect-3/4'
              )}
            >
              <OptimizedImage
                src={mainImage}
                alt={mainImageAlt}
                width={1600}
                height={1600}
                priority
                variant="hero"
                className={cn(
                  'h-auto w-full',
                  s.heroImageStyle === 'circle'
                    ? 'aspect-square object-cover'
                    : 'object-contain',
                  s.heroImageStyle === 'portrait' && 'h-full object-cover'
                )}
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {caption && (
                <div className="absolute right-4 bottom-4 max-w-xs rounded-xl bg-foreground/10 p-3 backdrop-blur-md lg:right-8 lg:bottom-8 lg:p-4">
                  <p className="font-script text-xl text-background lg:text-2xl">{caption}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-primary/5 border-primary/20 flex h-64 w-full items-center justify-center border-2 border-dashed lg:h-96">
            <span className="text-primary/40">Sin Imagen Destacada</span>
          </div>
        )}
      </HeroWrapper>
    </div>
  )
}
