'use client'

import type { CSSProperties } from 'react'
import { OptimizedImage } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { cn } from '@/lib/utils'
import { HeroSectionProps } from './heroTypes'
import { HeroWrapper } from './HeroWrapper'
import { resolveEffectiveValues } from './heroUtils'

/**
 * Estrella de 5 puntas via clip-path — recorta la imagen en forma de estrella.
 * Mantener sincronizado con la opción "Estrella" del PropertyEditor (IMAGE_STYLES).
 */
const STAR_CLIP_PATH =
  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'

/** Clases CSS por estilo de imagen. "original" no agrega nada (default). */
function styleClassName(style: string | null | undefined): string {
  switch (style) {
    case 'rounded':
      return 'rounded-3xl'
    case 'circle':
      return 'rounded-full'
    case 'square':
      return 'rounded-md'
    case 'landscape':
      return 'rounded-md'
    case 'portrait':
      return 'rounded-md aspect-3/4'
    case 'star':
      return ''
    case 'original':
    case null:
    case undefined:
    default:
      return ''
  }
}

/** Estilos inline por estilo. Solo 'star' necesita clip-path. */
function styleInlineStyle(style: string | null | undefined): CSSProperties {
  if (style === 'star') return { clipPath: STAR_CLIP_PATH }
  return {}
}

export function HeroMainImage({
  s,
  isEditor,
  selectedElement,
  onSelectElement,
  viewportMode,
}: HeroSectionProps) {
  // Toggle "Visible en la web pública": oculto en público si está apagado,
  // pero siempre visible en el editor para poder editarlo.
  if (!isEditor && s.showHeroMainImage === false) return null

  const mainImage = s.heroMainImageUrl
  const mainImageAlt = s.heroMainImageAlt || 'Hero Image'
  const caption = s.heroMainImageCaption
  const eff = resolveEffectiveValues(s, viewportMode)
  const currentStyle = eff.imgImageStyle ?? s.heroImageStyle
  const isCircle = currentStyle === 'circle'
  const isPortrait = currentStyle === 'portrait'
  const isLandscape = currentStyle === 'landscape'
  const isSquare = currentStyle === 'square'
  const isStar = currentStyle === 'star'
  // circle/portrait/landscape/square/star → 'cover' para llenar el aspect-ratio;
  // 'original'/'rounded'/'default' → 'contain' para mostrar la imagen completa.
  const imageObjectFit =
    isCircle || isPortrait || isLandscape || isSquare || isStar ? 'cover' : 'contain'

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
                styleClassName(eff.imgImageStyle ?? s.heroImageStyle)
              )}
              style={styleInlineStyle(eff.imgImageStyle ?? s.heroImageStyle)}
            >
              <OptimizedImage
                src={mainImage}
                alt={mainImageAlt}
                width={1600}
                height={1600}
                priority
                variant="hero"
                objectFit={imageObjectFit}
                className={cn(
                  'h-auto w-full',
                  isCircle && 'aspect-square',
                  isPortrait && 'h-full',
                  isLandscape && 'aspect-video',
                  isSquare && 'aspect-square'
                )}
                sizes={IMAGE_SIZES.heroMain}
              />

              {caption && (
                <div className="bg-primary/10 absolute right-4 bottom-4 max-w-xs rounded-xl p-3 backdrop-blur-md lg:right-8 lg:bottom-8 lg:p-4">
                  <p className="text-primary-foreground font-script text-xl drop-shadow-md lg:text-2xl">
                    {caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : isEditor ? (
          <div className="bg-primary/5 border-primary/20 flex h-64 w-full items-center justify-center border-2 border-dashed lg:h-96">
            <span className="text-primary/40">Sin Imagen Destacada</span>
          </div>
        ) : null}
      </HeroWrapper>
    </div>
  )
}
