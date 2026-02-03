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
                className="relative z-20 text-6xl text-[var(--primary)] sm:text-7xl lg:text-8xl xl:text-[7rem]"
                style={{ fontFamily: 'var(--font-brand, var(--font-script))' }}
              >
                {title1}
              </h1>
            </FadeIn>

            <SlideIn direction="left" delay={0.4}>
              {/* Título Portfolio - superpuesto ~20% sobre Make-up */}
              <h2
                className="text-shadow relative z-10 -mt-4 text-5xl leading-none font-bold tracking-tighter text-[var(--accent)] sm:-mt-6 sm:text-6xl lg:-mt-8 lg:text-7xl xl:-mt-10 xl:text-8xl"
                style={{ fontFamily: 'var(--font-portfolio, var(--font-heading))' }}
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
                  />
                </div>
              </FadeIn>
            )}

            {/* Nombre del Owner - superpuesto sobre la ilustración */}
            <FadeIn delay={0.8}>
              <p
                className="-mt-6 w-full text-3xl leading-tight tracking-tight text-[var(--primary)] sm:-mt-8 sm:text-4xl lg:-mt-10 lg:text-5xl xl:text-6xl"
                style={{
                  fontFamily: 'var(--font-signature, var(--font-script))',
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
          {/* Imagen Destacada - SIN bordes redondeados, SIN zoom */}
          {mainImage ? (
            <FadeIn delay={0.5} className="relative h-[50vh] w-full lg:h-[60vh]">
              {/* Contenedor sin bordes redondeados, fondo transparente */}
              <div className="relative h-full w-full" style={{ background: 'transparent' }}>
                <OptimizedImage
                  src={mainImage}
                  alt={mainImageAlt}
                  fill
                  priority
                  variant="hero"
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Caption flotante (si existe) */}
                {caption && (
                  <div className="absolute right-6 bottom-6 max-w-xs rounded-xl bg-white/10 p-4 backdrop-blur-md">
                    <p className="font-script text-xl text-white">{caption}</p>
                  </div>
                )}
              </div>
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
