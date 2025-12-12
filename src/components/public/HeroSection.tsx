import Image from 'next/image'

interface HeroSectionProps {
  heroImageUrl?: string | null
  title?: string
}

export default function HeroSection({
  heroImageUrl,
  title = 'Paola Bolívar Nievas',
}: HeroSectionProps) {
  return (
    <section className="grid min-h-[calc(100vh-140px)] grid-cols-1 lg:grid-cols-12">
      {/* Columna Izquierda: Título + Ilustración (Desktop) */}
      <div className="relative flex flex-col items-center justify-start pt-10 lg:col-span-5 lg:justify-center lg:pt-0">
        {/* Título "Make-up Portfolio" - Contenedor único con textos superpuestos */}
        <div className="z-20 mb-6 flex flex-col items-center lg:mb-8 lg:items-start">
          {/* Make-up arriba */}
          <h2 className="font-script text-makeup text-4xl whitespace-nowrap md:text-5xl lg:text-6xl">
            Make-up
          </h2>
          {/* Portfolio abajo, con margen negativo para que se toquen */}
          <h1 className="font-primary text-portfolio -mt-2 text-3xl leading-none font-bold tracking-tighter uppercase md:-mt-3 md:text-4xl lg:-mt-4 lg:text-5xl">
            Portfolio
          </h1>
        </div>

        {/* Ilustración Pin-up + Nombre Paola */}
        <div className="flex flex-col items-center">
          {/* Imagen de la mujer pin-up */}
          <div className="relative z-10 h-56 w-56 md:h-64 md:w-64 lg:h-72 lg:w-72">
            {/* Light mode image */}
            <Image
              src="/women-dark.png"
              alt="Ilustración Pin-up"
              fill
              className="block object-contain dark:hidden"
              priority
            />
            {/* Dark mode image */}
            <Image
              src="/women-light.png"
              alt="Ilustración Pin-up"
              fill
              className="hidden object-contain dark:block"
              priority
            />
          </div>
          {/* Nombre "Paola Bolívar Nievas" debajo de la imagen */}
          <p className="font-script text-name z-20 -mt-4 text-xl whitespace-nowrap md:-mt-5 md:text-2xl lg:-mt-6 lg:text-3xl">
            Paola Bolívar Nievas
          </p>
        </div>
      </div>

      {/* Columna Derecha: Foto Hero */}
      <div className="relative h-[50vh] w-full lg:col-span-7 lg:h-auto">
        <div className="relative h-full w-full overflow-hidden lg:rounded-l-[4rem]">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={title}
              fill
              className="object-cover object-top"
              priority
            />
          ) : (
            <div className="from-pink-hot to-pink-dark flex h-full w-full flex-col items-center justify-center bg-linear-to-br text-white">
              <span className="text-6xl">✨</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
