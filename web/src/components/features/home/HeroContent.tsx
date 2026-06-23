'use client'

import { useMemo, useRef } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { buildHeroScrimBackground, buildHeroBackdropTint } from '@/lib/hero-backdrop-styles'
import { FontLoader } from './FontLoader'
import { HeroContentProps } from './heroTypes'
import { HeroTitles } from './HeroTitles'
import { HeroSignature } from './HeroSignature'
import { HeroCta } from './HeroCta'
import { HeroMainImage } from './HeroMainImage'
import { HomeSettingsData } from '@/actions/settings/home'
import { useViewportMode } from '@/hooks/useViewportMode'
import { offsetXKey, offsetYKey, resolveEffectiveValues } from './heroUtils'

type DraggableElement =
  | 'heroTitle1'
  | 'heroTitle2'
  | 'ownerName'
  | 'heroMainImage'
  | 'illustration'
  | 'ctaButton'

export function HeroContent({
  settings,
  isEditor = false,
  selectedElement = null,
  onSelectElement,
  forceViewportMode,
  onUpdate,
  viewportMode: viewportModeProp,
}: HeroContentProps) {
  const s = settings || ({} as Partial<HomeSettingsData>)
  const detectedIsMobile = useIsMobile()
  const detectedViewport = useViewportMode()
  const isMobile = forceViewportMode ? forceViewportMode === 'mobile' : detectedIsMobile
  const viewportMode = forceViewportMode ?? viewportModeProp ?? detectedViewport

  const fontsHash = [
    s.heroTitle1Font,
    s.heroTitle2Font,
    s.ownerNameFont,
    s.ctaFont,
    s.featuredTitleFont,
  ]
    .filter(Boolean)
    .join('|')

  const fontsToLoad = useMemo(() => fontsHash.split('|'), [fontsHash])

  // Drag: mantener un mapa en memoria con los offsets temporales durante el drag.
  // Al terminar (onDragEnd), aplicamos el delta sobre el offset actual y llamamos onUpdate.
  const liveOffsetRef = useRef<Partial<Record<DraggableElement, { x: number; y: number }>>>({})

  const handleDragEnd = (elementId: DraggableElement, deltaX: number, deltaY: number) => {
    if (!onUpdate) return
    const currentXKey = offsetXKey(elementId, viewportMode)
    const currentYKey = offsetYKey(elementId, viewportMode)
    const eff = resolveEffectiveValues(s, viewportMode)
    const currentX =
      elementId === 'heroTitle1'
        ? eff.title1OffsetX
        : elementId === 'heroTitle2'
          ? eff.title2OffsetX
          : elementId === 'ownerName'
            ? eff.ownerOffsetX
            : elementId === 'heroMainImage'
              ? eff.imgOffsetX
              : elementId === 'illustration'
                ? eff.illOffsetX
                : eff.ctaOffsetX
    const currentY =
      elementId === 'heroTitle1'
        ? eff.title1OffsetY
        : elementId === 'heroTitle2'
          ? eff.title2OffsetY
          : elementId === 'ownerName'
            ? eff.ownerOffsetY
            : elementId === 'heroMainImage'
              ? eff.imgOffsetY
              : elementId === 'illustration'
                ? eff.illOffsetY
                : eff.ctaOffsetY
    const newX = Math.round(currentX + deltaX)
    const newY = Math.round(currentY + deltaY)
    onUpdate(currentXKey, newX as HomeSettingsData[typeof currentXKey])
    onUpdate(currentYKey, newY as HomeSettingsData[typeof currentYKey])
  }

  const dragEnabled = isEditor && !!onUpdate
  const makeDragProps = (elementId: DraggableElement) => ({
    enableDrag: dragEnabled,
    onDragEnd: (deltaX: number, deltaY: number) => handleDragEnd(elementId, deltaX, deltaY),
  })

  const sectionProps = {
    s,
    isEditor,
    selectedElement,
    onSelectElement,
    viewportMode,
    ...makeDragProps('heroTitle1'),
  }

  const baseScrimParams = {
    extentPercent: s.heroScrimExtentPercent ?? 45,
    opacityPercent: s.heroScrimOpacity ?? 80,
    featherPercent: s.heroScrimFeatherPercent ?? 50,
    colorLightHex: s.heroScrimColor ?? null,
    colorDarkHex: s.heroScrimColorDark ?? null,
    prefersDark: false,
  }
  const mobileExtent = s.heroScrimMobileExtentPercent ?? baseScrimParams.extentPercent
  const mobileOpacity = s.heroScrimMobileOpacity ?? baseScrimParams.opacityPercent
  const mobileParams = {
    ...baseScrimParams,
    extentPercent: mobileExtent,
    opacityPercent: mobileOpacity,
  }

  const scrims = isMobile
    ? ([
        (s.heroScrimMobileShowLeft ?? false) &&
          buildHeroScrimBackground({ ...mobileParams, edge: 'left' }),
        (s.heroScrimMobileShowRight ?? false) &&
          buildHeroScrimBackground({ ...mobileParams, edge: 'right' }),
      ].filter(Boolean) as string[])
    : ([
        (s.heroScrimShowLeft ?? true) &&
          buildHeroScrimBackground({ ...baseScrimParams, edge: 'left' }),
        (s.heroScrimShowRight ?? false) &&
          buildHeroScrimBackground({ ...baseScrimParams, edge: 'right' }),
      ].filter(Boolean) as string[])

  const tint = buildHeroBackdropTint(s.heroBackdropTintOpacity ?? 0)

  return (
    <div className={cn('relative isolate w-full overflow-x-clip', isEditor && 'h-full')}>
      <section
        className={cn(
          'public-home-hero relative z-10 w-full overflow-x-hidden transition-colors duration-500',
          isEditor
            ? 'h-full min-h-0'
            : 'min-h-[100svh] px-4 pb-16 sm:px-8 md:min-h-[100dvh] lg:px-16 lg:pb-0'
        )}
      >
        {tint && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: tint }}
          />
        )}
        {scrims.map((bg, i) => (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: bg }}
          />
        ))}
        <FontLoader fonts={fontsToLoad} />

        {/* Hero stage: contenedor relativo con altura mínima. Cada hijo es absolute
            con posición base responsive + transform: translate(offsetX, offsetY) desde BD. */}
        <div
          className={cn(
            'relative mx-auto w-full max-w-7xl',
            isEditor ? 'h-full' : 'h-[100svh] md:h-[100dvh]'
          )}
        >
          {/* Title 1: arriba a la izquierda */}
          <div className="absolute top-[18%] left-4 z-20 max-w-[60%] sm:left-8 md:left-12 lg:top-[20%] lg:left-16">
            <HeroTitles {...sectionProps} {...makeDragProps('heroTitle1')} elementId="heroTitle1" />
          </div>

          {/* HeroMainImage: centro-derecha, debajo del scrim */}
          {(isEditor || ((s.showHeroMainImage ?? true) && s.heroMainImageUrl)) && (
            <div className="absolute top-[35%] right-4 z-10 hidden w-[45%] max-w-md sm:right-8 md:right-12 lg:top-[30%] lg:right-16 lg:block">
              <HeroMainImage
                {...sectionProps}
                {...makeDragProps('heroMainImage')}
                elementId="heroMainImage"
              />
            </div>
          )}

          {/* HeroCta: medio-derecha, debajo de la imagen */}
          {(isEditor || (s.showCtaButton ?? true)) && (
            <div className="absolute top-[60%] right-4 z-30 sm:right-8 md:right-12 lg:top-[55%] lg:right-16">
              <HeroCta {...sectionProps} {...makeDragProps('ctaButton')} elementId="ctaButton" />
            </div>
          )}

          {/* HeroSignature (illustration + ownerName): abajo a la izquierda */}
          <div className="absolute bottom-[8%] left-4 z-10 sm:left-8 md:left-12 lg:bottom-[10%] lg:left-16">
            <HeroSignature {...sectionProps} elementId="ownerName" />
          </div>
        </div>
      </section>
    </div>
  )
}
