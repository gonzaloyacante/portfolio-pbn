import Image from 'next/image'

interface HeroSectionProps {
  heroImageUrl?: string | null
  title?: string
}

/**
 * Hero Section - Diseño exacto de Canva
 * Layout: Grid 2 columnas
 * - Izquierda: "Make-up" (script), "Portfolio" (grande), nombre
 * - Derecha: Imagen de Paola
 */
export default function HeroSection({
  heroImageUrl,
  title = 'Paola Bolívar Nievas',
}: HeroSectionProps) {
  return (
    <section
      className="min-h-[calc(100vh-80px)] w-full"
      style={{
        backgroundColor: 'var(--color-background, #fff1f9)',
      }}
    >
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-12 lg:px-16">
        {/* Columna Izquierda - Textos */}
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          {/* Make-up en script */}
          <h2
            className="font-script relative z-10 leading-none"
            style={{
              color: 'var(--color-text-primary, #6c0a0a)',
              fontSize: 'clamp(3rem, 10vw, 8rem)',
            }}
          >
            Make-up
          </h2>

          {/* Portfolio grande - superpuesto */}
          <h1
            className="font-heading -mt-4 leading-none font-bold sm:-mt-6 lg:-mt-10"
            style={{
              color: 'var(--color-primary, #ffaadd)',
              fontSize: 'clamp(4.5rem, 18vw, 18rem)',
              letterSpacing: '-0.04em',
              fontWeight: 'var(--font-heading-weight, 700)',
            }}
          >
            Portfolio
          </h1>

          {/* Espacio decorativo */}
          <div className="my-6 lg:my-10">
            <span className="text-6xl sm:text-7xl lg:text-8xl">💄</span>
          </div>

          {/* Nombre en script */}
          <h3
            className="font-script leading-tight"
            style={{
              color: 'var(--color-text-primary, #6c0a0a)',
              fontSize: 'clamp(2rem, 6vw, 5rem)',
            }}
          >
            {title}
          </h3>
        </div>

        {/* Columna Derecha - Imagen */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div
            className="relative aspect-[4/5] w-full max-w-sm overflow-hidden shadow-2xl sm:max-w-md lg:max-w-lg"
            style={{
              backgroundColor: 'var(--color-primary, #ffaadd)',
              borderRadius: 'var(--layout-border-radius, 24px)',
            }}
          >
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 500px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-9xl opacity-50">📸</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
