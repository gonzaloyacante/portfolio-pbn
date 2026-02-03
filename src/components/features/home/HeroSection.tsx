'use client'

import { HomeSettingsData } from '@/actions/theme.actions'
import Link from 'next/link'
import { FadeIn, SlideIn, OptimizedImage, MagneticButton } from '@/components/ui'
import { ROUTES } from '@/config/routes'

interface HeroSectionProps {
  settings: HomeSettingsData | null
}

export default function HeroSection({ settings }: HeroSectionProps) {
  // Safe defaults to prevent "White Screen" if DB is empty
  const title1 = settings?.heroTitle1 || 'Make-up'
  const title2 = settings?.heroTitle2 || 'Portfolio'
  const mainImage = settings?.heroMainImageUrl
  const illustration = settings?.illustrationUrl
  const ownerName = settings?.ownerName || 'Paola Bolívar Nievas'
  const ctaText = settings?.ctaText || 'Ver Portfolio'
  const ctaLink = settings?.ctaLink || ROUTES.public.projects
  const illustrationAlt = settings?.illustrationAlt || 'Ilustración'
  const mainImageAlt = settings?.heroMainImageAlt || 'Hero Image'
  const caption = settings?.heroMainImageCaption
  const imageStyle = settings?.heroImageStyle || 'original'

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
      {/* Container Principal con Grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ===== COLUMNA IZQUIERDA ===== */}
        <div className="relative z-10 flex flex-col justify-between lg:min-h-[70vh]">
          {/* --- PARTE SUPERIOR: Títulos con superposición --- */}
          <div className="relative">
            <FadeIn delay={0.2}>
              {/* Título Brand (Make-up) - Script Font */}
              <h1
                className="relative z-20 text-[var(--primary)]"
                style={{
                  fontFamily: 'var(--font-brand, var(--font-script))',
                  fontSize: 'var(--font-size-brand, 7rem)', // Dynamic size
                  lineHeight: 1,
                }}
              >
                {title1}
              </h1>
            </FadeIn>

            <SlideIn direction="left" delay={0.4}>
              {/* Título Portfolio - superpuesto ~20% sobre Make-up */}
              <h2
                className="text-shadow relative z-10 -mt-4 font-bold tracking-tighter text-[var(--accent)] sm:-mt-6 lg:-mt-8 xl:-mt-10"
                style={{
                  fontFamily: 'var(--font-portfolio, var(--font-heading))',
                  fontSize: 'var(--font-size-portfolio, 6rem)', // Dynamic size
                  lineHeight: 1,
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
                className="-mt-6 w-full leading-tight tracking-tight text-[var(--primary)] sm:-mt-8 lg:-mt-10"
                style={{
                  fontFamily: 'var(--font-signature, var(--font-script))',
                  fontSize: 'var(--font-size-signature, 3.75rem)', // Dynamic size
                  whiteSpace: 'nowrap',
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

          {/* Botón CTA - Estilo simple subrayado (sin fondo pill) */}
          <FadeIn delay={0.7}>
            <MagneticButton>
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 text-sm font-bold tracking-wider text-[var(--foreground)] uppercase underline decoration-[var(--primary)] underline-offset-4 transition-colors hover:text-[var(--primary)]"
              >
                {ctaText}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </MagneticButton>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
