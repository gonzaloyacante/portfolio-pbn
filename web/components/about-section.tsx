"use client"

interface AboutSectionProps {
  onNavigate: (page: string) => void
}

export default function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <section className="py-12 md:py-24 px-4 md:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Name Script */}
            <div>
              <p className="text-sm font-medium text-muted mb-2">Bienvenido a mi portafolio</p>
              <h1 className="script-font text-4xl md:text-5xl text-muted leading-tight">Paola Bolívar Nievas</h1>
            </div>

            {/* About Text */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Hola, soy Paola.</h2>
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como
                  técnica en estética y belleza, y técnica en caracterización y maquillaje profesional.
                </p>
              </div>

              <p className="text-base md:text-lg text-foreground leading-relaxed">
                A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han
                permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos
                especiales, peluquería de platô y creación de personajes.
              </p>

              <p className="text-base md:text-lg text-foreground leading-relaxed">
                Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la
                televisión, contribuyendo a proyectos que inspiren y cautiven al público.
              </p>

              <p className="text-base md:text-lg text-foreground leading-relaxed">
                En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y
                amor por mi profesión.
              </p>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Especialidades</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Maquillaje Social",
                  "Caracterización",
                  "Efectos Especiales",
                  "Peluquería de Platô",
                  "Cine & TV",
                  "Creación de Personajes",
                ].map((skill) => (
                  <div key={skill} className="px-4 py-2 bg-card/50 rounded-lg text-sm font-medium text-card-foreground">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Profile Image */}
          <div className="flex justify-center lg:justify-end animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-card/40 to-transparent rounded-full blur-2xl" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary flex-shrink-0 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-makeup-artist-portrait-fB0OGBlMWsjdo32CzB8V0JiOesGVDr.jpg"
                  alt="Paola Bolívar Nievas"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
