"use client"

import { useEffect, useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"
import ContactForm from "./contact-form"
import ContactInfoCard from "./contact-info-card"
import { apiClient } from "@/lib/api-client"
import { useDesign } from "@/components/utils/design-provider"

interface ContactSectionProps {
  onNavigate: (page: string) => void
}

interface ContactData {
  title: string
  subtitle?: string
  config: {
    email?: string
    phone?: string
    location?: string
    showSocialLinks?: boolean
  }
}

interface Settings {
  ownerEmail?: string
  ownerPhone?: string
  ownerLocation?: string
}

export default function ContactSection({ onNavigate: _onNavigate }: ContactSectionProps) {
  const { settings: designSettings } = useDesign()
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [portfolioSettings, setPortfolioSettings] = useState<Settings | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [sections, settings] = await Promise.all([
          apiClient.getPageSections("home"),
          apiClient.getSettings(),
        ])

        const contactSection = sections.find((s: any) => s.sectionType === "CONTACT")
        if (contactSection) {
          setContactData(contactSection)
        }
        setPortfolioSettings(settings)
      } catch (error) {
        console.error("Error loading contact:", error)
      }
    }
    loadData()
  }, [])

  const config = contactData?.config || {}
  const email = config.email || portfolioSettings?.ownerEmail || "paola@example.com"
  const phone = config.phone || portfolioSettings?.ownerPhone || "+34 600 123 456"
  const location = config.location || portfolioSettings?.ownerLocation || "Granada, España"

  return (
    <section 
      className="py-8 md:py-24 px-4 md:px-8 min-h-screen animate-fade-in"
      style={{ padding: designSettings?.sectionPadding }}
    >
      <div 
        className="mx-auto"
        style={{ maxWidth: designSettings?.containerMaxWidth || '1200px' }}
      >
        {/* Header */}
        <div className="mb-8 md:mb-16 animate-slide-up">
          <h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4"
            style={{
              fontFamily: designSettings?.headingFont,
              color: designSettings?.primaryColor,
            }}
          >
            {contactData?.title || "Trabajemos Juntos"}
          </h2>
          <p 
            className="text-base md:text-lg max-w-2xl"
            style={{
              color: designSettings?.textColor ? `${designSettings.textColor}80` : 'var(--muted)',
              fontFamily: designSettings?.bodyFont,
              lineHeight: designSettings?.lineHeight,
            }}
          >
            {contactData?.subtitle || "¿Tienes un proyecto en mente? Me encantaría escuchar sobre él. Contáctame y hablemos sobre cómo puedo ayudarte."}
          </p>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
          style={{ gap: designSettings?.elementSpacing }}
        >
          <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <ContactInfoCard
              icon={Mail}
              title="Email"
              value={email}
              href={`mailto:${email}`}
              type="email"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <ContactInfoCard
              icon={Phone}
              title="Teléfono"
              value={phone}
              href={`tel:${phone.replace(/\s/g, '')}`}
              type="phone"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <ContactInfoCard 
              icon={MapPin} 
              title="Ubicación" 
              value={location} 
              type="location" 
            />
          </div>
        </div>

        {/* Contact Form */}
        <div
          className="bg-card/10 border-2 border-border rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">Envíame un Mensaje</h3>
          <ContactForm />
        </div>


      </div>
    </section>
  )
}
