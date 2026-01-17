'use client'

import { HomeSettingsData } from '@/actions/theme.actions'
import Image from 'next/image'
import Link from 'next/link'
import { FadeIn, SlideIn } from '@/components/ui/Animations'
import { ROUTES } from '@/config/routes'

interface HeroSectionProps {
  settings: HomeSettingsData | null
}

export default function HeroSection({ settings }: HeroSectionProps) {
  if (!settings) return null

  // Use defaults if settings fields are missing (though basic required fields are set in DB)
  const title1 = settings.heroTitle1 || 'Make-up'
  const title2 = settings.heroTitle2 || 'Portfolio'
  const mainImage = settings.heroMainImageUrl
  const illustration = settings.illustrationUrl

  return (
    <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-[var(--background)] px-4 pt-20 transition-colors duration-500 sm:px-8 lg:px-16">
      {/* Container Principal con Grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Columna Izquierda: Textos e Ilustración */}
        <div className="relative z-10 flex flex-col justify-center lg:col-span-5 lg:h-full lg:justify-end lg:pb-20">
          <FadeIn delay={0.2} className="relative z-20">
            {/* Título Script (Make-up) */}
            <h1 className="font-script -mb-4 text-7xl text-[var(--primary)] sm:text-8xl lg:text-[7rem] xl:text-[8rem]">
              {title1}
            </h1>
          </FadeIn>

          <SlideIn direction="left" delay={0.4} className="relative z-10">
            {/* Título Heading (Portfolio) */}
            <h2 className="font-heading text-shadow text-6xl leading-none font-bold tracking-tighter text-[var(--accent)] uppercase sm:text-8xl lg:text-[6rem] xl:text-[7rem]">
              {title2}
            </h2>
          </SlideIn>

          {/* Información Owner e Ilustración */}
          <div className="relative mt-8 flex items-center gap-6">
            <FadeIn delay={0.6}>
              <div className="max-w-[150px] space-y-2">
                <p className="font-heading text-sm font-bold tracking-widest text-[var(--text)] uppercase">
                  {settings.ownerName}
                </p>
                <div className="h-1 w-12 bg-[var(--primary)]"></div>
                <Link
                  href={settings.ctaLink || ROUTES.public.projects}
                  className="mt-4 inline-block text-xs font-bold text-[var(--text)] uppercase underline decoration-[var(--primary)] underline-offset-4 hover:text-[var(--primary)]"
                >
                  {settings.ctaText}
                </Link>
              </div>
            </FadeIn>

            {/* Ilustración Decorativa (detrás/al lado) */}
            {illustration && (
              <FadeIn
                delay={0.8}
                className="absolute -top-20 -right-10 -z-10 opacity-80 mix-blend-multiply md:top-auto md:left-40 dark:mix-blend-screen"
              >
                <div className="relative h-64 w-64 md:h-80 md:w-80">
                  <Image
                    src={illustration}
                    alt={settings.illustrationAlt || 'Ilustración'}
                    fill
                    className="object-contain"
                  />
                </div>
              </FadeIn>
            )}
          </div>
        </div>

        {/* Columna Derecha: Imagen Principal */}
        <div className="relative flex h-[50vh] w-full items-center justify-center lg:col-span-7 lg:h-[80vh]">
          {mainImage && (
            <FadeIn delay={0.5} className="relative h-full w-full">
              {/* Imagen con forma personalizada (rounded large) */}
              <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
                <Image
                  src={mainImage}
                  alt={settings.heroMainImageAlt || 'Hero Image'}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />

                {/* Overlay gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Caption flotante */}
                {settings.heroMainImageCaption && (
                  <div className="absolute right-8 bottom-8 max-w-xs rounded-xl bg-white/10 p-4 backdrop-blur-md">
                    <p className="font-script text-2xl text-white">
                      {settings.heroMainImageCaption}
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          )}

          {/* Elementos decorativos flotantes (círculos, formas) */}
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[var(--secondary)] opacity-20 blur-2xl"></div>
          <div className="absolute top-20 -right-10 h-40 w-40 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"></div>
        </div>
      </div>
    </section>
  )
}
