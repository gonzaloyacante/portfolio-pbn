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
          {/* --- PARTE SUPERIOR: Títulos (Make-up + Portfolio) --- */}
          <div className="space-y-0">
            <FadeIn delay={0.2}>
              {/* Título Brand (Make-up) - Script Font */}
              <h1
                className="-mb-2 text-6xl text-[var(--primary)] sm:text-7xl lg:text-8xl xl:text-[7rem]"
                style={{ fontFamily: 'var(--font-brand, var(--font-script))' }}
              >
                {title1}
              </h1>
            </FadeIn>

            <SlideIn direction="left" delay={0.4}>
              {/* Título Portfolio - Heading Font Bold */}
              <h2
                className="text-shadow text-5xl leading-none font-bold tracking-tighter text-[var(--accent)] sm:text-6xl lg:text-7xl xl:text-8xl"
                style={{ fontFamily: 'var(--font-portfolio, var(--font-heading))' }}
              >
                {title2}
              </h2>
            </SlideIn>
          </div>

          {/* --- PARTE INFERIOR: Ilustración + Nombre Estirado --- */}
          <div className="relative mt-8 lg:mt-0">
            {/* Ilustración (posicionada a la izquierda/arriba del nombre) */}
            {illustration && (
              <FadeIn delay={0.6} className="mb-4">
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

            {/* Nombre del Owner - Estirado al ancho completo */}
            <FadeIn delay={0.8}>
              <p
                className="w-full text-3xl leading-tight tracking-tight text-[var(--primary)] sm:text-4xl lg:text-5xl xl:text-6xl"
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
          {/* Imagen Destacada Grande */}
          {mainImage ? (
            <FadeIn delay={0.5} className="relative h-[50vh] w-full lg:h-[60vh]">
              <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
                <OptimizedImage
                  src={mainImage}
                  alt={mainImageAlt}
                  fill
                  priority
                  variant="hero"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Overlay gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Caption flotante */}
                {caption && (
                  <div className="absolute right-6 bottom-6 max-w-xs rounded-xl bg-white/10 p-4 backdrop-blur-md">
                    <p className="font-script text-xl text-white">{caption}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ) : (
            // Placeholder visual si no hay imagen
            <div className="bg-primary/5 border-primary/20 flex h-[50vh] w-full items-center justify-center rounded-[2.5rem] border-2 border-dashed lg:h-[60vh]">
              <span className="text-primary/40">Sin Imagen Destacada</span>
            </div>
          )}

          {/* Botón CTA - Debajo de la imagen */}
          <FadeIn delay={0.7}>
            <MagneticButton>
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-4 text-base font-bold text-white uppercase shadow-lg transition-all hover:scale-105 hover:bg-[var(--primary)]/90 hover:shadow-xl"
              >
                {ctaText}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Elementos decorativos flotantes */}
          <div className="absolute -bottom-10 -left-10 -z-10 h-32 w-32 rounded-full bg-[var(--secondary)] opacity-20 blur-2xl"></div>
          <div className="absolute top-20 -right-10 -z-10 h-40 w-40 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"></div>
        </div>
      </div>
    </section>
  )
}
