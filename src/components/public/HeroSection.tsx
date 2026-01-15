import Image from 'next/image'

interface HeroSectionProps {
  heroImageUrl?: string | null
  silhouetteImageUrl?: string | null
  ownerName?: string | null
  heroTitle1?: string | null
  heroTitle2?: string | null
}

/**
 * Hero Section - Diseño según Canva
 * Columna izquierda: Textos Make-up, Portfolio, nombre + silueta/icono
 * Columna derecha: Imagen de Paola
 */
export default function HeroSection({
  heroImageUrl,
  silhouetteImageUrl,
  ownerName,
  heroTitle1,
  heroTitle2,
}: HeroSectionProps) {
  const displayName = ownerName || 'Paola Bolívar Nievas'
  const title1 = heroTitle1 || 'Make-up'
  const title2 = heroTitle2 || 'Portfolio'

  return (
    <section className="bg-pink-light dark:bg-bg min-h-[calc(100vh-80px)] w-full transition-colors duration-300">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-12 lg:px-16">
        {/* Columna Izquierda - Textos */}
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          {/* Make-up en script */}
          <h2 className="font-script text-wine dark:text-pink-hot relative z-10 text-[2.5rem] leading-none sm:text-[4rem] lg:text-[5rem]">
            {title1}
          </h2>

          {/* Portfolio grande */}
          <h1 className="font-heading text-wine dark:text-pink-light -mt-2 text-[3.5rem] leading-none font-bold tracking-tighter uppercase sm:-mt-4 sm:text-[5rem] lg:-mt-6 lg:text-[7rem] xl:text-[8rem]">
            {title2}
          </h1>

          {/* Silueta/Icono editable */}
          <div className="my-6 lg:my-10">
            {silhouetteImageUrl ? (
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40">
                <Image
                  src={silhouetteImageUrl}
                  alt="Silueta"
                  fill
                  className="object-contain"
                  sizes="160px"
                />
              </div>
            ) : (
              <span className="text-6xl sm:text-7xl lg:text-8xl">💄</span>
            )}
          </div>

          {/* Nombre en script */}
          <h3 className="font-script text-wine dark:text-pink-hot text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {displayName}
          </h3>
        </div>

        {/* Columna Derecha - Imagen */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="bg-wine dark:bg-pink-hot relative aspect-4/5 w-full max-w-sm overflow-hidden rounded-[2rem] shadow-2xl sm:max-w-md lg:max-w-lg lg:rounded-[3rem]">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt={displayName}
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
