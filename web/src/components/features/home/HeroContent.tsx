'use client'

import { useMemo, useRef } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { buildHeroScrimBackground, buildHeroBackdropTint } from '@/lib/hero-backdrop-styles'
import { FontLoader } from './FontLoader'
import { HeroContentProps } from './heroTypes'
import { HeroTitle1, HeroTitle2 } from './HeroTitles'
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
  const _isMobile = forceViewportMode ? forceViewportMode === 'mobile' : detectedIsMobile
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
  const _liveOffsetRef = useRef<Partial<Record<DraggableElement, { x: number; y: number }>>>({})

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

  // NOTA: `prefersDark: false` es intencional — la web pública se sirve en modo
  // claro fijo (los colores de la UI cliente vienen del CSS theme global + overrides
  // de ThemeColorOverride, no del dark mode del sistema). Los campos
  // `heroScrimColorDark` están en schema/DB por simetría con `heroScrimColor`
  // pero el render público no los consume.
  const baseScrimParams = {
    extentPercent: s.heroScrimExtentPercent ?? 45,
    opacityPercent: s.heroScrimOpacity ?? 80,
    featherPercent: s.heroScrimFeatherPercent ?? 50,
    colorLightHex: s.heroScrimColor ?? null,
    colorDarkHex: s.heroScrimColorDark ?? null,
    prefersDark: false,
  }

  // 3 sets de params independientes (escritorio / tablet / móvil) — sin
  // herencia entre viewports. Si el campo del viewport activo está vacío,
  // se usa el default específico de ese viewport.
  const tabletParams = {
    ...baseScrimParams,
    extentPercent: s.heroScrimTabletExtentPercent ?? baseScrimParams.extentPercent,
    opacityPercent: s.heroScrimTabletOpacity ?? baseScrimParams.opacityPercent,
  }
  const mobileParams = {
    ...baseScrimParams,
    extentPercent: s.heroScrimMobileExtentPercent ?? baseScrimParams.extentPercent,
    opacityPercent: s.heroScrimMobileOpacity ?? baseScrimParams.opacityPercent,
  }
  const paramsByViewport = {
    desktop: baseScrimParams,
    tablet: tabletParams,
    mobile: mobileParams,
  } as const

  // `show` por sombra × viewport: cada uno tiene su propio boolean,
  // y la sombra "top" del hero se renderiza finalmente (arregla el bug
  // zombie donde heroScrimShowTop existía en schema pero no se pintaba).
  const showLeftByViewport = {
    desktop: s.heroScrimShowLeft ?? true,
    tablet: s.heroScrimTabletShowLeft ?? true,
    mobile: s.heroScrimMobileShowLeft ?? false,
  } as const
  const showRightByViewport = {
    desktop: s.heroScrimShowRight ?? false,
    tablet: s.heroScrimTabletShowRight ?? false,
    mobile: s.heroScrimMobileShowRight ?? false,
  } as const
  const showTopByViewport = {
    desktop: s.heroScrimShowTop ?? true,
    tablet: s.heroScrimTabletShowTop ?? true,
    mobile: s.heroScrimMobileShowTop ?? true,
  } as const

  const activeParams = paramsByViewport[viewportMode]
  const scrimCandidates = [
    showLeftByViewport[viewportMode] && buildHeroScrimBackground({ ...activeParams, edge: 'left' }),
    showRightByViewport[viewportMode] &&
      buildHeroScrimBackground({ ...activeParams, edge: 'right' }),
    showTopByViewport[viewportMode] && buildHeroScrimBackground({ ...activeParams, edge: 'top' }),
  ]
  const scrims = scrimCandidates.filter((bg): bg is string => Boolean(bg))

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
          {/* Title 1: arriba a la izquierda — wrapper independiente */}
          <div
            className={cn(
              'absolute top-[18%] left-4 z-20 max-w-[60%] sm:left-8 md:left-12 lg:top-[20%] lg:left-16',
              isEditor && s.showHeroTitle1 === false && 'opacity-40'
            )}
          >
            <HeroTitle1 {...sectionProps} {...makeDragProps('heroTitle1')} elementId="heroTitle1" />
          </div>

          {/* Title 2: debajo del título 1 — wrapper independiente con su propio opacity */}
          <div
            className={cn(
              'absolute top-[32%] left-4 z-10 max-w-[60%] sm:left-8 md:left-12 lg:top-[35%] lg:left-16',
              isEditor && s.showHeroTitle2 === false && 'opacity-40'
            )}
          >
            <HeroTitle2 {...sectionProps} {...makeDragProps('heroTitle2')} elementId="heroTitle2" />
          </div>

          {/* HeroMainImage: centro-derecha, debajo del scrim */}
          {(isEditor || ((s.showHeroMainImage ?? true) && s.heroMainImageUrl)) && (
            <div
              className={cn(
                'absolute top-[35%] right-4 z-10 hidden w-[45%] max-w-md sm:right-8 md:right-12 lg:top-[30%] lg:right-16 lg:block',
                isEditor && s.showHeroMainImage === false && 'opacity-40'
              )}
            >
              <HeroMainImage
                {...sectionProps}
                {...makeDragProps('heroMainImage')}
                elementId="heroMainImage"
              />
            </div>
          )}

          {/* HeroCta: medio-derecha, debajo de la imagen */}
          {(isEditor || (s.showCtaButton ?? true)) && (
            <div
              className={cn(
                'absolute top-[60%] right-4 z-30 sm:right-8 md:right-12 lg:top-[55%] lg:right-16',
                isEditor && s.showCtaButton === false && 'opacity-40'
              )}
            >
              <HeroCta {...sectionProps} {...makeDragProps('ctaButton')} elementId="ctaButton" />
            </div>
          )}

          {/* HeroSignature (illustration + ownerName): abajo a la izquierda */}
          <div
            className={cn(
              'absolute bottom-[8%] left-4 z-10 sm:left-8 md:left-12 lg:bottom-[10%] lg:left-16',
              isEditor &&
                (s.showOwnerName === false || s.showIllustration === false) &&
                'opacity-40'
            )}
          >
            <HeroSignature {...sectionProps} elementId="ownerName" />
          </div>
        </div>
      </section>
    </div>
  )
}
