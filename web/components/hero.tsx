"use client"

import { Button } from "./button"

interface HeroProps {
  onNavigate: (page: string) => void
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center py-8 md:py-16 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/20 -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Illustration - Left Side */}
          <div className="flex justify-center md:justify-start animate-slide-up">
            <div className="relative w-40 h-40 md:w-80 md:h-80 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-card/30 to-transparent rounded-full blur-3xl" />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proyecto%20%2820250922053728%29-G0TPYQ1DpNcU4y9B5b8BwSdn7WALr3.webp"
                alt="Paola Bolívar Nievas"
                className="w-full h-full object-contain relative z-10"
                loading="eager"
              />
            </div>
          </div>

          {/* Content - Right Side */}
          <div
            className="flex flex-col justify-center space-y-6 md:space-y-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            {/* Name */}
            <div>
              <h1 className="script-font text-4xl md:text-6xl lg:text-7xl text-primary mb-2 leading-tight">
                Paola Bolívar Nievas
              </h1>
              <div className="h-1 w-20 md:w-24 bg-gradient-to-r from-card to-accent rounded-full" />
            </div>

            {/* Tagline */}
            <div>
              <p className="text-lg md:text-2xl font-semibold text-foreground mb-2 md:mb-4">Maquilladora Profesional</p>
              <p className="text-sm md:text-lg text-muted leading-relaxed max-w-md">
                Especializada en audiovisuales, cine, televisión y eventos. Transformo visiones en realidad a través del
                arte del maquillaje.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
              <Button
                onClick={() => onNavigate("projects")}
                variant="primary"
                size="md"
                className="text-sm md:text-base"
              >
                Ver Proyectos
              </Button>
              <Button
                onClick={() => onNavigate("contact")}
                variant="secondary"
                size="md"
                className="text-sm md:text-base"
              >
                Contactarme
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-6 border-t border-border">
              <div>
                <p className="text-xl md:text-3xl font-bold text-card">5+</p>
                <p className="text-xs md:text-sm text-muted">Años</p>
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-card">50+</p>
                <p className="text-xs md:text-sm text-muted">Proyectos</p>
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-card">100%</p>
                <p className="text-xs md:text-sm text-muted">Satisfacción</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
