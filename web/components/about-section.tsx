"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useDesign } from "./design-provider"

interface AboutSectionProps {
  onNavigate: (page: string) => void
}

interface AboutData {
  title: string
  subtitle?: string
  config: {
    image?: string
    greeting?: string
    description?: string[]
    specialties?: string[]
  }
}

export default function AboutSection({ onNavigate: _onNavigate }: AboutSectionProps) {
  const { settings } = useDesign()
  const [aboutData, setAboutData] = useState<AboutData | null>(null)

  useEffect(() => {
    async function loadAboutData() {
      try {
        const sections = await apiClient.getPageSections("home")
        const aboutSection = sections.find((s: any) => s.sectionType === "ABOUT")
        if (aboutSection) {
          setAboutData(aboutSection)
        }
      } catch (error) {
        console.error("Error loading about:", error)
      }
    }
    loadAboutData()
  }, [])

  const config = aboutData?.config || {}
  const specialties = config.specialties || [
    "Maquillaje Social",
    "Caracterización",
    "Efectos Especiales",
    "Peluquería de Platô",
    "Cine & TV",
    "Creación de Personajes",
  ]

  const descriptions = config.description || [
    "Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterización y maquillaje profesional.",
    "A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos especiales, peluquería de platô y creación de personajes.",
    "Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la televisión, contribuyendo a proyectos que inspiren y cautiven al público.",
    "En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y amor por mi profesión.",
  ]

  return (
    <section 
      className="py-12 md:py-24 px-4 md:px-8 animate-fade-in"
      style={{ padding: settings?.sectionPadding }}
    >
      <div 
        className="mx-auto"
        style={{ maxWidth: settings?.containerMaxWidth || '1200px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Right - Profile Image (mobile first) */}
          <div className="flex justify-center lg:justify-end animate-slide-up order-1 lg:order-2" style={{ animationDelay: "100ms" }}>
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-full blur-2xl" 
                style={{
                  background: `linear-gradient(to bottom right, ${settings?.accentColor}40, transparent)`
                }}
              />
              <div 
                className="relative w-full h-full rounded-full overflow-hidden flex-shrink-0 hover:shadow-2xl transition-all hover:scale-105"
                style={{
                  borderWidth: '4px',
                  borderStyle: 'solid',
                  borderColor: settings?.primaryColor || 'var(--primary)',
                  transition: `all ${settings?.transitionSpeed || '0.3s'}`,
                  boxShadow: settings?.boxShadow,
                }}
              >
                <img
                  src={config.image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-makeup-artist-portrait-fB0OGBlMWsjdo32CzB8V0JiOesGVDr.jpg"}
                  alt={aboutData?.title || "Paola Bolívar Nievas"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Left Content */}
          <div className="space-y-8 animate-slide-up order-2 lg:order-1">
            {/* Name Script */}
            <div>
              <p 
                className="text-sm font-medium mb-2"
                style={{ color: settings?.textColor ? `${settings.textColor}80` : 'var(--muted)' }}
              >
                {aboutData?.subtitle || "Bienvenido a mi portafolio"}
              </p>
              <h1 
                className="text-4xl md:text-5xl leading-tight"
                style={{
                  fontFamily: settings?.headingFont || 'Parisienne, serif',
                  color: settings?.textColor ? `${settings.textColor}99` : 'var(--muted)',
                }}
              >
                {aboutData?.title || "Paola Bolívar Nievas"}
              </h1>
            </div>

            {/* About Text */}
            <div 
              className="space-y-6"
              style={{ 
                fontFamily: settings?.bodyFont,
                lineHeight: settings?.lineHeight,
              }}
            >
              <div>
                <h2 
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ color: settings?.textColor || 'var(--foreground)' }}
                >
                  {config.greeting || "Hola, soy Paola."}
                </h2>
                {descriptions.map((text, idx) => (
                  <p 
                    key={idx}
                    className="text-base md:text-lg leading-relaxed mb-4"
                    style={{ color: settings?.textColor || 'var(--foreground)' }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            <div 
              className="pt-6 border-t"
              style={{ borderColor: settings?.accentColor ? `${settings.accentColor}40` : 'var(--border)' }}
            >
              <h3 
                className="text-lg font-bold mb-4"
                style={{ color: settings?.textColor || 'var(--foreground)' }}
              >
                Especialidades
              </h3>
              <div 
                className="grid grid-cols-2 gap-3"
                style={{ gap: settings?.elementSpacing || '2rem' }}
              >
                {specialties.map((skill) => (
                  <div 
                    key={skill} 
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: settings?.accentColor ? `${settings.accentColor}20` : 'var(--card)',
                      color: settings?.textColor || 'var(--card-foreground)',
                      borderRadius: settings?.borderRadius,
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* (image moved above for mobile) */}
        </div>
      </div>
    </section>
  )
}
