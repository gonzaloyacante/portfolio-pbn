"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useDesign } from "./design-provider"

interface HeroProps {
  onNavigate: (page: string) => void
}

interface HeroSection {
  title: string
  subtitle?: string
  config: {
    tagline?: string
    description?: string
    ctaPrimary?: string
    ctaSecondary?: string
    image?: string
    stats?: Array<{ value: string; label: string }>
  }
}

export default function Hero({ onNavigate }: HeroProps) {
  const { settings } = useDesign()
  const [heroData, setHeroData] = useState<HeroSection | null>(null)

  useEffect(() => {
    async function loadHeroData() {
      try {
        const sections = await apiClient.getPageSections("home")
        const heroSection = sections.find((s: any) => s.sectionType === "HERO")
        if (heroSection) {
          setHeroData(heroSection)
        }
      } catch (error) {
        console.error("Error loading hero:", error)
      }
    }
    loadHeroData()
  }, [])

  const config = heroData?.config || {}
  const stats = config.stats || [
    { value: "5+", label: "Años" },
    { value: "50+", label: "Proyectos" },
    { value: "100%", label: "Satisfacción" },
  ]

  return (
    <section
      className="relative flex items-center justify-center py-8 md:py-16 px-4 md:px-8 overflow-hidden"
      style={{ 
        minHeight: 'calc(100vh - var(--header-height, 72px) - 1px)',
        padding: settings?.sectionPadding || '4rem 2rem',
      }}
    >
      <div className="absolute inset-0 -z-10" 
        style={{
          background: `linear-gradient(to bottom right, var(--cms-background-color, #fff), var(--cms-accent-color, #f0f0f0)20)`
        }}
      />

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
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl mb-2 leading-tight"
                style={{
                  fontFamily: settings?.headingFont || 'Parisienne, serif',
                  fontSize: settings?.headingSize || '4rem',
                  color: settings?.primaryColor || 'var(--primary)',
                }}
              >
                {heroData?.title || "Paola Bolívar Nievas"}
              </h1>
              <div 
                className="h-1 w-20 md:w-24 rounded-full" 
                style={{
                  background: `linear-gradient(to right, ${settings?.accentColor || 'var(--accent)'}, ${settings?.secondaryColor || 'var(--secondary)'})`,
                }}
              />
            </div>

            {/* Tagline */}
            <div>
              <p 
                className="text-lg md:text-2xl font-semibold mb-2 md:mb-4"
                style={{ color: settings?.textColor || 'var(--foreground)' }}
              >
                {config.tagline || heroData?.subtitle || "Maquilladora Profesional"}
              </p>
              <p 
                className="text-sm md:text-lg leading-relaxed max-w-md"
                style={{ 
                  color: settings?.textColor ? `${settings.textColor}99` : 'var(--muted)',
                  lineHeight: settings?.lineHeight || '1.6',
                }}
              >
                {config.description || "Especializada en audiovisuales, cine, televisión y eventos. Transformo visiones en realidad a través del arte del maquillaje."}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
              <button
                onClick={() => onNavigate("projects")}
                className="px-6 py-3 text-sm md:text-base font-medium text-white rounded-lg hover:opacity-90"
                style={{
                  backgroundColor: settings?.primaryColor || 'var(--primary)',
                  borderRadius: settings?.borderRadius || '0.5rem',
                  transition: `all ${settings?.transitionSpeed || '0.3s'}`,
                  boxShadow: settings?.boxShadow,
                }}
              >
                {config.ctaPrimary || "Ver Proyectos"}
              </button>
              <button
                onClick={() => onNavigate("contact")}
                className="px-6 py-3 text-sm md:text-base font-medium text-white rounded-lg hover:opacity-90"
                style={{
                  backgroundColor: settings?.secondaryColor || 'var(--secondary)',
                  borderRadius: settings?.borderRadius || '0.5rem',
                  transition: `all ${settings?.transitionSpeed || '0.3s'}`,
                }}
              >
                {config.ctaSecondary || "Contactarme"}
              </button>
            </div>

            {/* Stats */}
            <div 
              className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-6 border-t"
              style={{ borderColor: settings?.accentColor ? `${settings.accentColor}40` : 'var(--border)' }}
            >
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p 
                    className="text-xl md:text-3xl font-bold"
                    style={{ color: settings?.accentColor || 'var(--accent)' }}
                  >
                    {stat.value}
                  </p>
                  <p 
                    className="text-xs md:text-sm"
                    style={{ color: settings?.textColor ? `${settings.textColor}80` : 'var(--muted)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
