'use client'

import { useMemo } from 'react'
import { HomeSettingsData } from '@/actions/settings/home'
import { OptimizedImage, Button, FadeIn, SlideIn, MagneticButton } from '@/components/ui'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EditableElement } from '../visual-editor/types'
import { ClickableElement } from '../visual-editor/ClickableElement'

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

export function HeroContent({
  settings,
  isEditor = false,
  selectedElement = null,
  onSelectElement,
}: HeroContentProps) {
  const s = settings || ({} as Partial<HomeSettingsData>)

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

  const fontsHash = [s.heroTitle1Font, s.heroTitle2Font, s.ownerNameFont, s.ctaFont]
    .filter(Boolean)
    .join('|')

  const fontsToLoad = useMemo(() => fontsHash.split('|'), [fontsHash])

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] w-full flex-col justify-center overflow-x-hidden bg-[var(--background)] px-4 transition-colors duration-500 sm:px-8 lg:px-16">
      <FontLoader fonts={fontsToLoad} />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 lg:grid lg:min-h-[80vh] lg:grid-cols-12 lg:gap-12 lg:py-0">
        {/* === LEFT COLUMN GROUP (Titles + Signature) === */}
        <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:py-16">
          {/* 1. TITLES (Order 1 on Mobile) */}
          <div className="order-1 flex w-full flex-col items-center text-center lg:order-none lg:items-start lg:text-left">
            <FadeIn delay={0.2} className="relative z-20" disabled={isEditor}>
              <Wrapper
                id="heroTitle1"
                isEditor={isEditor}
                selectedElement={selectedElement}
                onSelectElement={onSelectElement}
                style={{
                  zIndex: s.heroTitle1ZIndex ?? 20,
                  transform: `translate(${s.heroTitle1OffsetX || 0}px, ${s.heroTitle1OffsetY || 0}px)`,
                }}
              >
                <h1
                  className="text-6xl leading-[0.9] sm:text-8xl lg:text-[7rem] xl:text-[8rem]"
                  style={{
                    fontFamily: s.heroTitle1FontUrl
                      ? s.heroTitle1Font!
                      : 'var(--font-brand, var(--font-script))',
                    color: s.heroTitle1Color || 'var(--primary)',
                    fontSize: s.heroTitle1FontSize ? `${s.heroTitle1FontSize}px` : undefined,
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
                  transform: `translate(${s.heroTitle2OffsetX || 0}px, ${s.heroTitle2OffsetY || 0}px)`,
                }}
              >
                <h2
                  className="text-shadow text-5xl leading-[0.9] font-bold tracking-tighter text-[var(--accent)] sm:text-8xl lg:text-[6rem] xl:text-[7rem]"
                  style={{
                    fontFamily: s.heroTitle2FontUrl
                      ? s.heroTitle2Font!
                      : 'var(--font-portfolio, var(--font-heading))',
                    fontSize: s.heroTitle2FontSize ? `${s.heroTitle2FontSize}px` : undefined,
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
          <div className="order-4 mt-8 flex w-full items-center justify-center gap-4 lg:relative lg:order-none lg:mt-0 lg:justify-start lg:gap-0">
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
                    transform: `translate(${s.illustrationOffsetX || 0}px, ${s.illustrationOffsetY || 0}px) rotate(${s.illustrationRotation || 0}deg) scale(${(s.illustrationSize ?? 100) / 100})`,
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
                      transform: `translate(${s.ownerNameOffsetX || 0}px, ${s.ownerNameOffsetY || 0}px)`,
                    }}
                  >
                    <p
                      className="text-sm font-bold tracking-widest text-[var(--foreground)]"
                      style={{
                        fontFamily: s.ownerNameFontUrl
                          ? s.ownerNameFont!
                          : 'var(--font-signature, var(--font-heading))',
                        fontSize: s.ownerNameFontSize ? `${s.ownerNameFontSize}px` : undefined,
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
          <div className="order-2 flex w-full justify-center lg:order-none lg:flex-1 lg:items-center">
            <Wrapper
              id="heroMainImage"
              isEditor={isEditor}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              className="relative flex max-w-full items-center justify-center"
              style={{
                zIndex: s.heroMainImageZIndex ?? 5,
                transform: `translate(${s.heroMainImageOffsetX || 0}px, ${s.heroMainImageOffsetY || 0}px)`,
              }}
            >
              {mainImage ? (
                <FadeIn delay={0.5} className="relative w-full" disabled={isEditor}>
                  <div
                    className={cn(
                      'relative overflow-hidden transition-all duration-500',
                      s.heroImageStyle === 'rounded' && 'rounded-3xl',
                      s.heroImageStyle === 'circle' && 'rounded-full',
                      s.heroImageStyle === 'portrait' && 'aspect-[3/4]'
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
          <div className="order-3 mt-6 lg:order-none lg:mt-8">
            <Wrapper
              id="ctaButton"
              isEditor={isEditor}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              style={{
                transform: `translate(${s.ctaOffsetX || 0}px, ${s.ctaOffsetY || 0}px)`,
              }}
            >
              {isEditor ? (
                <div onClick={(e) => e.preventDefault()}>
                  <MagneticButton>
                    <Button
                      size={mapButtonSize(s.ctaSize)}
                      variant="ghost"
                      style={{
                        fontFamily: s.ctaFontUrl ? s.ctaFont! : 'inherit',
                        fontSize: s.ctaFontSize ? `${s.ctaFontSize}px` : undefined,
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
                      variant="ghost"
                      style={{
                        fontFamily: s.ctaFontUrl ? s.ctaFont! : 'inherit',
                        fontSize: s.ctaFontSize ? `${s.ctaFontSize}px` : undefined,
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
          <div className="pointer-events-none absolute bottom-0 -left-10 z-0 h-32 w-32 rounded-full bg-[var(--secondary)] opacity-20 blur-2xl"></div>
        </div>
      </div>
    </section>
  )
}
