'use client'

import { useMemo } from 'react'
import { HomeSettingsData } from '@/actions/settings/home'
import { OptimizedImage, Button, FadeIn, SlideIn, MagneticButton } from '@/components/ui'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EditableElement } from '../visual-editor/types'
import { ClickableElement } from '../visual-editor/ClickableElement'
import { useIsMobile } from '@/hooks/useIsMobile'

import { FontLoader } from './FontLoader'

// Helper to resolve colors for light/dark mode

function mapButtonSize(size: string | null | undefined): 'sm' | 'md' | 'lg' | 'xl' {
  if (size === 'sm') return 'sm'
  if (size === 'md') return 'md'
  if (size === 'xl') return 'xl'
  if (size === 'default') return 'md'
  if (size === 'icon') return 'md'
  return 'lg'
}

function mapCtaVariant(
  variant: string | null | undefined
): 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' {
  switch (variant) {
    case 'primary':
    case 'default':
      return 'primary'
    case 'secondary':
      return 'secondary'
    case 'outline':
      return 'outline'
    case 'ghost':
      return 'ghost'
    default:
      return 'primary'
  }
}

// Wrapper to simplify Editor vs Public logic
function Wrapper({
  children,
  id,
  isEditor,
  selectedElement,
  onSelectElement,
  className,
  style,
}: {
  children: React.ReactNode
  id: EditableElement
  isEditor: boolean
  selectedElement?: EditableElement
  onSelectElement?: (id: EditableElement) => void
  className?: string
  style?: React.CSSProperties
}) {
  if (isEditor && id) {
    return (
      <ClickableElement
        id={id}
        isSelected={selectedElement === id}
        onClick={() => onSelectElement?.(id)}
        className={className}
        style={style}
      >
        {children}
      </ClickableElement>
    )
  }
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

interface HeroContentProps {
  settings: HomeSettingsData | null
  isEditor?: boolean
  selectedElement?: EditableElement
  onSelectElement?: (element: EditableElement) => void
}

// Pick mobile override when isMobile is true, fallback to desktop value
const mob = <T,>(
  isMobile: boolean,
  mobileVal: T | null | undefined,
  desktopVal: T | null | undefined,
  fallback: T
): T => {
  if (isMobile && mobileVal != null) return mobileVal
  return desktopVal ?? fallback
}

// Mobile-aware effective values helper
function resolveEffectiveValues(s: Partial<HomeSettingsData>, isMobile: boolean) {
  return {
    title1OffsetX: mob(isMobile, s.heroTitle1MobileOffsetX, s.heroTitle1OffsetX, 0),
    title1OffsetY: mob(isMobile, s.heroTitle1MobileOffsetY, s.heroTitle1OffsetY, 0),
    title1FontSize: mob(isMobile, s.heroTitle1MobileFontSize, s.heroTitle1FontSize, null),
    title2OffsetX: mob(isMobile, s.heroTitle2MobileOffsetX, s.heroTitle2OffsetX, 0),
    title2OffsetY: mob(isMobile, s.heroTitle2MobileOffsetY, s.heroTitle2OffsetY, 0),
    title2FontSize: mob(isMobile, s.heroTitle2MobileFontSize, s.heroTitle2FontSize, null),
    ownerOffsetX: mob(isMobile, s.ownerNameMobileOffsetX, s.ownerNameOffsetX, 0),
    ownerOffsetY: mob(isMobile, s.ownerNameMobileOffsetY, s.ownerNameOffsetY, 0),
    ownerFontSize: mob(isMobile, s.ownerNameMobileFontSize, s.ownerNameFontSize, null),
    imgOffsetX: mob(isMobile, s.heroMainImageMobileOffsetX, s.heroMainImageOffsetX, 0),
    imgOffsetY: mob(isMobile, s.heroMainImageMobileOffsetY, s.heroMainImageOffsetY, 0),
    illOffsetX: mob(isMobile, s.illustrationMobileOffsetX, s.illustrationOffsetX, 0),
    illOffsetY: mob(isMobile, s.illustrationMobileOffsetY, s.illustrationOffsetY, 0),
    illSize: mob(isMobile, s.illustrationMobileSize, s.illustrationSize, 100),
    illRotation: mob(isMobile, s.illustrationMobileRotation, s.illustrationRotation, 0),
    ctaOffsetX: mob(isMobile, s.ctaMobileOffsetX, s.ctaOffsetX, 0),
    ctaOffsetY: mob(isMobile, s.ctaMobileOffsetY, s.ctaOffsetY, 0),
    ctaFontSize: mob(isMobile, s.ctaMobileFontSize, s.ctaFontSize, null),
  }
}

export function HeroContent({
  settings,
  isEditor = false,
  selectedElement = null,
  onSelectElement,
}: HeroContentProps) {
  const s = settings || ({} as Partial<HomeSettingsData>)
  const isMobile = useIsMobile()

  // Props mapping
  const title1 = s.heroTitle1Text || 'Make-up'
  const title2 = s.heroTitle2Text || 'Portfolio'
  const mainImage = s.heroMainImageUrl
  const illustration = s.illustrationUrl
  const ownerName = s.ownerNameText || 'Paola Bolívar Nievas'

  const ctaText = s.ctaText || 'Ver Portfolio'
  const ctaLink = s.ctaLink || '/proyectos'
  const illustrationAlt = s.illustrationAlt || 'Ilustración'
  const mainImageAlt = s.heroMainImageAlt || 'Hero Image'
  const caption = s.heroMainImageCaption

  // Mobile-aware effective values
  const eff = resolveEffectiveValues(s, isMobile)

  const fontsHash = [s.heroTitle1Font, s.heroTitle2Font, s.ownerNameFont, s.ctaFont]
    .filter(Boolean)
    .join('|')

  const fontsToLoad = useMemo(() => fontsHash.split('|'), [fontsHash])

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] w-full flex-col justify-center overflow-x-hidden bg-(--background) px-4 transition-colors duration-500 sm:px-8 lg:px-16">
      <FontLoader fonts={fontsToLoad} />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 lg:grid lg:min-h-[80vh] lg:grid-cols-12 lg:gap-12 lg:py-0">
        {/* === LEFT COLUMN GROUP (Titles + Signature) === */}
        <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:py-16">
          {/* 1. TITLES (Order 1 on Mobile) */}
          <div className="order-1 flex w-full flex-col items-center text-center lg:order-0 lg:items-start lg:text-left">
            <FadeIn delay={0.2} className="relative z-20" disabled={isEditor}>
              <Wrapper
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
                  className="text-6xl leading-[0.9] sm:text-8xl lg:text-[7rem] xl:text-[8rem]"
                  style={{
                    fontFamily: s.heroTitle1FontUrl
                      ? s.heroTitle1Font!
                      : 'var(--font-brand, var(--font-script))',
                    color: s.heroTitle1Color || 'var(--primary)',
                    fontSize: eff.title1FontSize ? `${eff.title1FontSize}px` : undefined,
                  }}
                >
                  <span className="dark:hidden" style={{ color: s.heroTitle1Color || 'inherit' }}>
                    {title1}
                  </span>
                  <span
                    className="hidden dark:inline"
                    style={{ color: s.heroTitle1ColorDark || s.heroTitle1Color || 'inherit' }}
                  >
                    {title1}
                  </span>
                </h1>
              </Wrapper>
            </FadeIn>

            <SlideIn direction="left" delay={0.4} className="relative z-10" disabled={isEditor}>
              <Wrapper
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
                  className="text-shadow text-5xl leading-[0.9] font-bold tracking-tighter text-(--accent) sm:text-8xl lg:text-[6rem] xl:text-[7rem]"
                  style={{
                    fontFamily: s.heroTitle2FontUrl
                      ? s.heroTitle2Font!
                      : 'var(--font-portfolio, var(--font-heading))',
                    fontSize: eff.title2FontSize ? `${eff.title2FontSize}px` : undefined,
                  }}
                >
                  <span className="dark:hidden" style={{ color: s.heroTitle2Color || 'inherit' }}>
                    {title2}
                  </span>
                  <span
                    className="hidden dark:inline"
                    style={{ color: s.heroTitle2ColorDark || s.heroTitle2Color || 'inherit' }}
                  >
                    {title2}
                  </span>
                </h2>
              </Wrapper>
            </SlideIn>
          </div>

          {/* 4. SIGNATURE + ILLUSTRATION (Order 4 on Mobile) */}
          <div className="order-4 mt-8 flex w-full items-center justify-center gap-4 lg:relative lg:order-0 lg:mt-0 lg:justify-start lg:gap-0">
            {/* Illustration & Signature Wrapper - FLEX with NEGATIVE MARGIN OVERLAP */}
            <div className="flex flex-row items-center justify-center lg:flex-col lg:items-end lg:justify-start">
              {/* Illustration: Horizontally aligned with signature on mobile */}
              <div className="relative z-0 lg:-mr-20 lg:mb-0 lg:-ml-10">
                <Wrapper
                  id="illustration"
                  isEditor={isEditor}
                  selectedElement={selectedElement}
                  onSelectElement={onSelectElement}
                  className={cn(
                    'relative h-24 w-24 lg:h-80 lg:w-80',
                    !isEditor && 'opacity-80 mix-blend-multiply dark:mix-blend-screen'
                  )}
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
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-pink-500/30 bg-pink-500/10">
                        <span className="text-xs text-pink-500">Sin Ilustración</span>
                      </div>
                    )}
                  </div>
                </Wrapper>
              </div>

              {/* Signature: Higher Z-Index to sit on top */}
              <div className="relative z-10">
                <FadeIn delay={0.6} disabled={isEditor}>
                  <Wrapper
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
                      <span
                        className="dark:hidden"
                        style={{ color: s.ownerNameColor || 'inherit' }}
                      >
                        {ownerName}
                      </span>
                      <span
                        className="hidden dark:inline"
                        style={{ color: s.ownerNameColorDark || s.ownerNameColor || 'inherit' }}
                      >
                        {ownerName}
                      </span>
                    </p>
                  </Wrapper>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN GROUP (Image + CTA) === */}
        <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:items-center lg:justify-center">
          {/* 2. IMAGE (Order 2 on Mobile) */}
          <div className="order-2 flex w-full justify-center lg:order-0 lg:flex-1 lg:items-center">
            <Wrapper
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
                <FadeIn delay={0.5} className="relative w-full" disabled={isEditor}>
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
                      width={800}
                      height={800}
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

                    {/* Caption float */}
                    {caption && (
                      <div className="absolute right-4 bottom-4 max-w-xs rounded-xl bg-white/10 p-3 backdrop-blur-md lg:right-8 lg:bottom-8 lg:p-4">
                        <p className="font-script text-xl text-white lg:text-2xl">{caption}</p>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ) : (
                <div className="bg-primary/5 border-primary/20 flex h-64 w-full items-center justify-center border-2 border-dashed lg:h-96">
                  <span className="text-primary/40">Sin Imagen Destacada</span>
                </div>
              )}
            </Wrapper>
          </div>

          {/* 3. CTA BUTTON (Order 3 on Mobile) */}
          <div className="order-3 mt-6 lg:order-0 lg:mt-8">
            <Wrapper
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
                  <Link href={ctaLink}>
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
                  </Link>
                </MagneticButton>
              )}
            </Wrapper>
          </div>

          {/* Decorative Background Elements (Absolute to Right Col) */}
          <div className="pointer-events-none absolute bottom-0 -left-10 z-0 h-32 w-32 rounded-full bg-(--secondary) opacity-20 blur-2xl"></div>
        </div>
      </div>
    </section>
  )
}
