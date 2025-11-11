"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useDesign } from "@/components/utils/design-provider"

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
  const { settings: _settings } = useDesign()
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
      style={{ 
        padding: 'var(--cms-section-padding, 4rem 2rem)',
        backgroundColor: 'var(--cms-background-color, #ffffff)',
      }}
    >
      <div 
        className="mx-auto"
        style={{ maxWidth: 'var(--cms-container-max-width, 1200px)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Right - Profile Image (mobile first) */}
          <div className="flex justify-center lg:justify-end animate-slide-up order-1 lg:order-2" style={{ animationDelay: "100ms" }}>
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-full blur-2xl" 
                style={{
                  background: `linear-gradient(135deg, var(--cms-accent-color, #F59E0B) 0%, transparent 100%)`
                }}
              />
              <div 
                className="relative w-full h-full rounded-full overflow-hidden flex-shrink-0 hover:shadow-2xl hover:scale-105"
                style={{
                  borderWidth: '4px',
                  borderStyle: 'solid',
                  borderColor: 'var(--cms-primary-color, #E11D48)',
                  transition: `all var(--cms-transition-speed, 0.3s)`,
                  boxShadow: 'var(--cms-box-shadow, 0 10px 25px rgba(0,0,0,0.15))',
                  transform: 'var(--cms-hover-transform, translateY(-2px))',
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
          <div className="space-y-8 animate-slide-up order-2 lg:order-1"
            style={{ gap: 'var(--cms-element-spacing, 2rem)' }}
          >
            {/* Name Script */}
            <div>
              <p 
                className="text-sm font-medium mb-2"
                style={{ 
                  color: 'var(--cms-text-color, #6B7280)',
                  fontFamily: 'var(--cms-body-font, Inter, sans-serif)',
                }}
              >
                {aboutData?.subtitle || "Bienvenido a mi portafolio"}
              </p>
              <h1 
                className="text-4xl md:text-5xl"
                style={{
                  fontFamily: 'var(--cms-heading-font, Playfair Display, serif)',
                  fontSize: 'var(--cms-heading-size, 3rem)',
                  color: 'var(--cms-primary-color, #E11D48)',
                  lineHeight: 'var(--cms-line-height, 1.2)',
                }}
              >
                {aboutData?.title || "Paola Bolívar Nievas"}
              </h1>
            </div>

            {/* About Text */}
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ 
                    color: 'var(--cms-text-color, #1F2937)',
                    fontFamily: 'var(--cms-heading-font, Playfair Display, serif)',
                  }}
                >
                  {config.greeting || "Hola, soy Paola."}
                </h2>
                {descriptions.map((text, idx) => (
                  <p 
                    key={idx}
                    className="text-base md:text-lg mb-4"
                    style={{
                      color: 'var(--cms-text-color, #1F2937)',
                      fontFamily: 'var(--cms-body-font, Inter, sans-serif)',
                      fontSize: 'var(--cms-body-size, 1rem)',
                      lineHeight: 'var(--cms-line-height, 1.6)',
                    }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            <div 
              className="pt-6 border-t"
              style={{ borderColor: 'var(--cms-accent-color, #F59E0B)' }}
            >
              <h3 
                className="text-lg font-bold mb-4"
                style={{ 
                  color: 'var(--cms-text-color, #1F2937)',
                  fontFamily: 'var(--cms-heading-font, Playfair Display, serif)',
                }}
              >
                Especialidades
              </h3>
              <div 
                className="grid grid-cols-2"
                style={{ gap: 'var(--cms-element-spacing, 0.75rem)' }}
              >
                {specialties.map((skill) => (
                  <div 
                    key={skill} 
                    className="px-4 py-2 text-sm font-medium"
                    style={{
                      borderRadius: 'var(--cms-border-radius, 0.5rem)',
                      backgroundColor: 'var(--cms-accent-color, #F59E0B)',
                      color: '#ffffff',
                      fontFamily: 'var(--cms-body-font, Inter, sans-serif)',
                      boxShadow: 'var(--cms-box-shadow, 0 2px 4px rgba(0,0,0,0.1))',
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
