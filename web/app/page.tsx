"use client"

import Script from "next/script"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      {/* Structured Data - JSON-LD para SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Paola Bolívar Nievas",
            jobTitle: "Maquilladora Profesional",
            description: "Maquilladora especializada en audiovisuales, cine, televisión y eventos con más de 5 años de experiencia",
            url: typeof window !== 'undefined' ? window.location.origin : 'https://paolabolivar.com',
            image: typeof window !== 'undefined' ? `${window.location.origin}/og-image.jpg` : 'https://paolabolivar.com/og-image.jpg',
            address: {
              "@type": "PostalAddress",
              addressLocality: "Granada",
              addressCountry: "ES",
            },
            knowsAbout: ["Maquillaje Audiovisual", "Maquillaje para Cine", "Maquillaje para Televisión", "Maquillaje de Bodas", "Caracterización"],
            workExample: {
              "@type": "CreativeWork",
              name: "Portfolio de Trabajos",
              url: typeof window !== 'undefined' ? `${window.location.origin}/projects` : 'https://paolabolivar.com/projects',
            },
          }),
        }}
      />
      
      <main id="main-content" className="min-h-screen bg-white dark:bg-zinc-950" role="main">
        {/* Hero Section - Minimalista */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Maquilladora Profesional</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
              Paola Bolívar Nievas
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
              Transformando visiones en realidad a través del arte del maquillaje audiovisual
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/projects">
                  Ver Proyectos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/contact">
                  Contactar
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-10 border-2 border-zinc-300 dark:border-zinc-700 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-zinc-800 dark:bg-zinc-200 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
