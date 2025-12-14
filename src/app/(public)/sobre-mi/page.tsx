import Image from 'next/image'
import { getPageContent } from '@/actions/theme.actions'

export default async function AboutPage() {
  const pageContent = await getPageContent('about')

  let bioData = {
    title: 'Sobre mi',
    bio: `Hola, soy Paola.

Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterizacion y maquillaje profesional.

A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos especiales, peluquería de plató y creación de personajes.

Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la televisión, contribuyendo a proyectos que inspiren y cautiven al público.

En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y amor por mi profesión.`,
    showImage: true,
    imagePosition: 'right',
    imageUrl:
      'https://res.cloudinary.com/djlknirsd/image/upload/v1753747019/IMG-20250729-WA0014_2_plir9l.jpg',
  }

  if (pageContent?.content) {
    try {
      const parsed = JSON.parse(pageContent.content)
      bioData = { ...bioData, ...parsed }
    } catch (e) {
      console.error('Error parsing page content:', e)
    }
  }

  // Dividir bio en párrafos
  const paragraphs = bioData.bio.split('\n\n').filter(Boolean)

  return (
    <section
      className="min-h-screen w-full"
      style={{ backgroundColor: 'var(--color-background, #fff1f9)' }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-12 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        {/* Columna Izquierda - Texto */}
        <div className="order-2 lg:order-1">
          {/* Título con nombre en script + icono */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start lg:gap-4">
            <h1
              className="font-script"
              style={{
                color: 'var(--color-text-primary, #6c0a0a)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
              }}
            >
              Paola Bolívar Nievas
            </h1>
            <span className="text-4xl sm:text-5xl">💄</span>
          </div>

          {/* Biografía */}
          <div
            className="space-y-5 text-justify leading-relaxed"
            style={{
              color: 'var(--color-text-primary, #6c0a0a)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
              lineHeight: '1.8',
            }}
          >
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Columna Derecha - Imagen OVAL */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div
            className="relative aspect-[3/4] w-full max-w-xs overflow-hidden shadow-2xl sm:max-w-sm lg:max-w-md"
            style={{
              borderRadius: '50% / 45%',
            }}
          >
            {bioData.imageUrl ? (
              <Image
                src={bioData.imageUrl}
                alt="Paola Bolívar Nievas"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 400px"
                priority
              />
            ) : (
              <div
                className="flex h-full items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, var(--color-primary, #ffaadd), var(--color-accent, #7a2556))`,
                }}
              >
                <span className="text-8xl">💄</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
