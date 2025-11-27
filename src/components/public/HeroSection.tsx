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
    <section className="container mx-auto px-4 py-8 md:py-16">
      {/* Title Section with Overlapping Text */}
      <div className="relative mb-12 flex items-center justify-center md:mb-20">
        <div className="relative h-32 w-full md:h-48">
          {/* "Portfolio" - Background text (Pink, Sans-Serif, Uppercase) */}
          <h1 className="font-primary text-pink-hot dark:text-pink-dark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl leading-none font-bold whitespace-nowrap uppercase md:text-8xl lg:text-9xl">
            PORTFOLIO
          </h1>

          {/* "Make-up" - Foreground text (Wine, Script, Rotated) */}
          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <h2 className="font-script text-wine dark:text-pink-light -rotate-6 text-7xl leading-none whitespace-nowrap md:text-9xl lg:text-[10rem]">
              Make-up
            </h2>
          </div>
        </div>
      </div>

      {/* Grid Section: Illustration + Photo */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-12">
        {/* Left Column - Pin-up Illustration (40% on desktop) */}
        <div className="order-2 flex items-end justify-center md:order-1 md:col-span-2">
          <div className="relative h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
            {/* Placeholder for Pin-up Illustration with lipstick */}
            <div className="bg-pink-hot/20 dark:bg-pink-hot/10 absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
              <div className="text-center">
                <p className="font-script text-wine dark:text-pink-hot text-5xl">💄</p>
                <p className="font-script text-wine dark:text-pink-hot mt-2 text-2xl">Pin-up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Main Photo (60% on desktop) */}
        <div className="order-1 flex flex-col items-center justify-center md:order-2 md:col-span-3">
          {/* Name/Title */}
          <h3 className="font-primary text-wine dark:text-pink-light mb-6 text-center text-3xl font-bold md:text-left md:text-4xl lg:text-5xl">
            {title}
          </h3>

          {/* Hero Photo */}
          <div className="relative aspect-3/4 w-full max-w-md overflow-hidden rounded-4xl bg-gray-200 shadow-2xl">
            {heroImageUrl ? (
              <Image src={heroImageUrl} alt="Hero Image" fill className="object-cover" priority />
            ) : (
              <div className="from-pink-hot to-pink-dark flex h-full w-full flex-col items-center justify-center gap-4 bg-linear-to-br text-white">
                <div className="text-6xl">✨</div>
                <p className="font-script text-3xl">Foto Principal</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
