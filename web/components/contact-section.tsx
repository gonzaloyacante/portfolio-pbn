"use client"

import { Mail, MapPin, Instagram, Linkedin, Send } from "lucide-react"
import ContactForm from "./contact-form"
import ContactInfoCard from "./contact-info-card"

interface ContactSectionProps {
  onNavigate: (page: string) => void
}

export default function ContactSection({ onNavigate }: ContactSectionProps) {
  return (
    <section className="py-8 md:py-24 px-4 md:px-8 min-h-screen animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 md:mb-4">Trabajemos Juntos</h2>
          <p className="text-base md:text-lg text-muted max-w-2xl">
            ¿Tienes un proyecto en mente? Me encantaría escuchar sobre él. Contáctame y hablemos sobre cómo puedo
            ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <ContactInfoCard
              icon={Mail}
              title="Email"
              value="paola@example.com"
              href="mailto:paola@example.com"
              type="email"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <ContactInfoCard
              icon={Send}
              title="Teléfono"
              value="+34 600 123 456"
              href="tel:+34600123456"
              type="phone"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <ContactInfoCard icon={MapPin} title="Ubicación" value="Granada, España" type="location" />
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

        <div
          className="mt-12 md:mt-16 pt-8 md:pt-12 border-t-2 border-border animate-slide-up"
          style={{ animationDelay: "250ms" }}
        >
          <p className="text-sm md:text-base font-medium text-muted mb-4 md:mb-6">Sígueme en redes sociales</p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 hover:shadow-lg active:scale-95 text-sm md:text-base"
              aria-label="Sígueme en Instagram"
            >
              <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 hover:shadow-lg active:scale-95 text-sm md:text-base"
              aria-label="Sígueme en LinkedIn"
            >
              <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
              LinkedIn
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 hover:shadow-lg active:scale-95 text-sm md:text-base"
              aria-label="Sígueme en TikTok"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
              TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
