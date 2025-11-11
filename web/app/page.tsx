"use client"

import Script from "next/script"
import Link from "next/link"
import { ArrowRight, Sparkles, Award, Users, Palette, Star } from "lucide-react"
import { Button } from "@/components/forms"
import AboutSection from "@/components/sections/about-section"

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
      
      <main id="main-content" className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-950" role="main">
        {/* Hero Section - Con animaciones mejoradas */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Elementos decorativos animados */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300 dark:bg-rose-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-500"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-full text-sm mb-8 animate-fade-in-down shadow-lg">
              <Sparkles className="w-4 h-4 text-rose-600 animate-glow" />
              <span className="font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Maquilladora Profesional</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Paola Bolívar Nievas
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-700 dark:text-zinc-300 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Transformando visiones en realidad a través del arte del maquillaje audiovisual
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
              <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Link href="/projects">
                  Ver Proyectos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-rose-300 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Link href="/contact">
                  Contactar
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Scroll Indicator animado */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in animation-delay-500">
            <div className="w-6 h-10 border-2 border-rose-400 dark:border-rose-600 rounded-full flex justify-center animate-float">
              <div className="w-1 h-3 bg-gradient-to-b from-rose-500 to-pink-600 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 px-6 bg-white dark:bg-zinc-900 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                ¿Por qué elegirme?
              </h2>
              <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Experiencia, creatividad y profesionalismo en cada proyecto
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Award,
                  title: "Experiencia",
                  description: "Años de formación y práctica profesional",
                  delay: "100"
                },
                {
                  icon: Users,
                  title: "Confianza",
                  description: "Clientes satisfechos en cada proyecto",
                  delay: "200"
                },
                {
                  icon: Palette,
                  title: "Creatividad",
                  description: "Soluciones únicas para cada visión",
                  delay: "300"
                },
                {
                  icon: Star,
                  title: "Calidad",
                  description: "Productos premium y técnicas profesionales",
                  delay: "500"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group p-6 bg-gradient-to-br from-white to-rose-50/30 dark:from-zinc-800 dark:to-rose-950/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-${feature.delay}`}
                >
                  <div className="w-14 h-14 mb-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <AboutSection onNavigate={() => {}} />

        {/* CTA Section */}
        <section className="py-20 md:py-32 px-6 bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 relative overflow-hidden">
          {/* Animated blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
              ¿Listo para dar vida a tu visión?
            </h2>
            <p className="text-xl text-white/90 mb-10 animate-fade-in-up animation-delay-100">
              Trabajemos juntos en tu próximo proyecto
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white hover:bg-rose-50 text-rose-600 border-2 border-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Link href="/contact">
                  Contactar Ahora
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent hover:bg-white/10 text-white border-2 border-white/50 hover:border-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Link href="/projects">
                  Ver Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
