'use client'

import { HomeSettingsData } from '@/actions/theme.actions'
import Link from 'next/link'
import { FadeIn, SlideIn, OptimizedImage, MagneticButton, Button } from '@/components/ui'
import type { ButtonProps } from '@/components/ui/forms/Button'
import { ROUTES } from '@/config/routes'
import { FontLoader } from './FontLoader'

interface HeroSectionProps {
  settings: HomeSettingsData | null
}

export default function HeroSection({ settings }: HeroSectionProps) {
  // Safe defaults to prevent "White Screen" if DB is empty
  const title1 = settings?.heroTitle1Text || 'Make-up'
  const title2 = settings?.heroTitle2Text || 'Portfolio'
  const mainImage = settings?.heroMainImageUrl
  const illustration = settings?.illustrationUrl
  const ownerName = settings?.ownerNameText || 'Paola Bolívar Nievas'
  const ctaText = settings?.ctaText || 'Ver Portfolio'
  const ctaLink = settings?.ctaLink || ROUTES.public.projects
  const illustrationAlt = settings?.illustrationAlt || 'Ilustración'
  const mainImageAlt = settings?.heroMainImageAlt || 'Hero Image'
  const caption = settings?.heroMainImageCaption
  const imageStyle = settings?.heroImageStyle || 'original'

  // Fonts to load
  const fontsToLoad = [
    { name: settings?.heroTitle1Font, url: settings?.heroTitle1FontUrl },
    { name: settings?.heroTitle2Font, url: settings?.heroTitle2FontUrl },
    { name: settings?.ownerNameFont, url: settings?.ownerNameFontUrl },
    { name: settings?.ctaFont, url: settings?.ctaFontUrl },
  ]

  // Dynamic Styles Helpers
  const getTextStyle = (
    size?: number | null,
    font?: string | null,
    color?: string | null,
    colorDark?: string | null,
    defaultSize?: string
  ) => {
    return {
      fontSize: size ? `${size}px` : defaultSize,
      fontFamily: font ? `"${font}", sans-serif` : undefined,
      '--text-color': color || undefined,
      '--text-color-dark': colorDark || color || undefined,
    } as React.CSSProperties
  }

  // Classes for text color that use the variables
  const getDynamicColorClass = (hasCustomColor: boolean) =>
    hasCustomColor
      ? 'text-[var(--text-color)] dark:text-[var(--text-color-dark)] transition-colors duration-300'
      : ''

  // Helper to get container classes and image object-fit based on shape
  const getImageStyleClasses = (style: string) => {
    switch (style) {
      case 'square':
        return {
          container: 'aspect-square w-full max-w-md mx-auto',
          image: 'object-cover rounded-lg',
        }
      case 'circle':
        return {
          container: 'aspect-square w-full max-w-md mx-auto',
          image: 'object-cover rounded-full',
        }
      case 'landscape':
        return {
          container: 'aspect-video w-full',
          image: 'object-cover rounded-lg',
        }
      case 'portrait':
        return {
          container: 'aspect-[3/4] w-full max-w-md mx-auto',
          image: 'object-cover rounded-lg',
        }
      case 'star':
        return {
          container: 'aspect-square w-full max-w-md mx-auto',
          image: 'object-cover',
          clipPath:
            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }
      case 'original':
      default:
        return {
          container: 'h-[50vh] w-full lg:h-[60vh]',
          image: 'object-contain',
        }
    }
  }

  const imageStyles = getImageStyleClasses(imageStyle)

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden bg-[var(--background)] px-4 pt-8 transition-colors duration-500 sm:px-8 lg:px-16 lg:pt-0">
      <FontLoader fonts={fontsToLoad} />

      {/* Container Principal con Grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ===== COLUMNA IZQUIERDA ===== */}
        <div className="relative z-10 flex flex-col justify-between lg:min-h-[70vh]">
          {/* --- PARTE SUPERIOR: Títulos con superposición --- */}
          <div className="relative">
            <FadeIn delay={0.2}>
              {/* Título Brand (Make-up) - Script Font */}
              <h1
                className={`font-script relative z-20 ${getDynamicColorClass(!!settings?.heroTitle1Color)} ${!settings?.heroTitle1Color ? 'text-[var(--primary)]' : ''}`}
                style={{
                  lineHeight: 1,
                  ...getTextStyle(
                    settings?.heroTitle1FontSize,
                    settings?.heroTitle1Font,
                    settings?.heroTitle1Color,
                    settings?.heroTitle1ColorDark,
                    '7rem'
                  ),
                }}
              >
                {title1}
              </h1>
            </FadeIn>

            <SlideIn direction="left" delay={0.4}>
              {/* Título Portfolio - superpuesto ~20% sobre Make-up */}
              <h2
                className={`text-shadow relative z-10 -mt-4 font-bold tracking-tighter sm:-mt-6 lg:-mt-8 xl:-mt-10 ${getDynamicColorClass(!!settings?.heroTitle2Color)} ${!settings?.heroTitle2Color ? 'text-[var(--accent)]' : ''}`}
                style={{
                  lineHeight: 1,
                  ...getTextStyle(
                    settings?.heroTitle2FontSize,
                    settings?.heroTitle2Font,
                    settings?.heroTitle2Color,
                    settings?.heroTitle2ColorDark,
                    '6rem'
                  ),
                }}
              >
                {title2}
              </h2>
            </SlideIn>
          </div>

          {/* --- PARTE INFERIOR: Ilustración + Nombre superpuesto --- */}
          <div className="relative mt-8 lg:mt-0">
            {/* Ilustración - fondo transparente */}
            {illustration && (
              <FadeIn delay={0.6}>
                <div className="relative h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64">
                  <OptimizedImage
                    src={illustration}
                    alt={illustrationAlt}
                    fill
                    className="object-contain"
                    transparentBackground={true}
                  />
                </div>
              </FadeIn>
            )}

            {/* Nombre del Owner - superpuesto sobre la ilustración */}
            <FadeIn delay={0.8}>
              <p
                className={`-mt-6 w-full leading-tight tracking-tight sm:-mt-8 lg:-mt-10 ${getDynamicColorClass(!!settings?.ownerNameColor)} ${!settings?.ownerNameColor ? 'text-[var(--primary)]' : ''}`}
                style={{
                  whiteSpace: 'nowrap',
                  ...getTextStyle(
                    settings?.ownerNameFontSize,
                    settings?.ownerNameFont,
                    settings?.ownerNameColor,
                    settings?.ownerNameColorDark,
                    '3.75rem'
                  ),
                }}
              >
                {ownerName}
              </p>
            </FadeIn>
          </div>
        </div>

        {/* ===== COLUMNA DERECHA: Imagen Principal + CTA ===== */}
        <div className="relative flex flex-col items-center justify-center gap-6 lg:min-h-[70vh]">
          {/* Imagen Destacada - Forma dinámica */}
          {mainImage ? (
            <FadeIn delay={0.5} className="relative flex w-full items-center justify-center">
              {imageStyle === 'original' ? (
                // Modo Original: NO usar fill, respetar aspect ratio natural
                <div className="relative w-full bg-transparent">
                  <OptimizedImage
                    src={mainImage}
                    alt={mainImageAlt}
                    width={1200}
                    height={800}
                    priority
                    variant="hero"
                    className="h-auto w-full object-contain"
                    transparentBackground={true}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {/* Caption flotante (si existe) */}
                  {caption && (
                    <div className="absolute right-6 bottom-6 max-w-xs rounded-xl bg-white/10 p-4 backdrop-blur-md">
                      <p className="font-script text-xl text-white">{caption}</p>
                    </div>
                  )}
                </div>
              ) : (
                // Modos con forma: usar fill con contenedor de dimensiones fijas
                <div
                  className={`relative bg-transparent ${imageStyles.container}`}
                  style={imageStyles.clipPath ? { clipPath: imageStyles.clipPath } : undefined}
                >
                  <OptimizedImage
                    src={mainImage}
                    alt={mainImageAlt}
                    fill
                    priority
                    variant="hero"
                    className={imageStyles.image}
                    transparentBackground={true}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </FadeIn>
          ) : (
            // Placeholder visual si no hay imagen
            <div className="border-primary/20 flex h-[50vh] w-full items-center justify-center border-2 border-dashed lg:h-[60vh]">
              <span className="text-primary/40">Sin Imagen Destacada</span>
            </div>
          )}

          {/* Botón CTA - Usando componente Button con variantes */}
          <FadeIn delay={0.7}>
            <MagneticButton>
              <Button
                asChild
                size="lg"
                variant={(settings?.ctaVariant || 'primary') as ButtonProps['variant']}
                className="h-auto px-8 py-6 text-lg"
                style={{
                  fontSize: settings?.ctaFontSize ? `${settings?.ctaFontSize}px` : undefined,
                  fontFamily: settings?.ctaFont ? `"${settings.ctaFont}", sans-serif` : undefined,
                }}
              >
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </MagneticButton>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
