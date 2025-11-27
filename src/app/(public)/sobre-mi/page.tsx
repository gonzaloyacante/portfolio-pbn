import Image from 'next/image'
import { getSiteConfig } from '@/actions/settings.actions'

export default async function AboutPage() {
  const siteConfig = await getSiteConfig()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-script text-wine dark:text-pink-hot mb-4 text-5xl md:text-6xl">
            Sobre Mí
          </h1>
          <p className="text-wine/70 dark:text-pink-light/70 mx-auto max-w-2xl text-lg">
            Conoce mi historia y pasión por el maquillaje artístico
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Photo */}
          <div className="flex justify-center md:justify-end">
            <div className="relative h-80 w-80 md:h-96 md:w-96">
              <div className="border-pink-hot dark:border-wine absolute inset-0 overflow-hidden rounded-full border-8 shadow-2xl">
                {siteConfig?.heroImageUrl ? (
                  <Image
                    src={siteConfig.heroImageUrl}
                    alt="Paola Bolívar Nievas"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="from-pink-hot to-pink-dark flex h-full w-full flex-col items-center justify-center bg-linear-to-br text-white">
                    <div className="text-6xl">✨</div>
                    <p className="font-script mt-4 text-2xl">Paola</p>
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 text-6xl">💄</div>
              <div className="absolute -bottom-4 -left-4 text-5xl">✨</div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div className="bg-pink-hot/30 dark:bg-purple-dark/30 rounded-4xl p-8">
              <div className="prose prose-lg text-wine dark:text-pink-light max-w-none">
                {siteConfig?.aboutText ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{siteConfig.aboutText}</p>
                ) : (
                  <>
                    <p className="mb-4 leading-relaxed">
                      Hola, soy <span className="font-script text-2xl">Paola Bolívar Nievas</span>,
                      maquilladora profesional con años de experiencia en el mundo de la belleza y
                      el arte.
                    </p>
                    <p className="mb-4 leading-relaxed">
                      Mi pasión por el maquillaje comenzó desde muy joven, y con el tiempo se
                      transformó en mi carrera profesional. Me especializo en maquillaje para
                      eventos, novias, sesiones fotográficas y producciones artísticas.
                    </p>
                    <p className="leading-relaxed">
                      Cada rostro es un lienzo único, y mi objetivo es resaltar la belleza natural
                      de cada persona, creando looks que reflejen su personalidad y estilo.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Skills/Specialties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-wine dark:bg-purple-dark rounded-3xl p-6 text-center shadow-md">
                <div className="mb-2 text-4xl">💼</div>
                <h3 className="text-pink-light font-semibold">Eventos</h3>
                <p className="text-pink-light/80 text-sm">Bodas & Fiestas</p>
              </div>

              <div className="bg-wine dark:bg-purple-dark rounded-3xl p-6 text-center shadow-md">
                <div className="mb-2 text-4xl">📸</div>
                <h3 className="text-pink-light font-semibold">Fotografía</h3>
                <p className="text-pink-light/80 text-sm">Editorial & Fashion</p>
              </div>

              <div className="bg-wine dark:bg-purple-dark rounded-3xl p-6 text-center shadow-md">
                <div className="mb-2 text-4xl">🎨</div>
                <h3 className="text-pink-light font-semibold">Artístico</h3>
                <p className="text-pink-light/80 text-sm">Creatividad & Color</p>
              </div>

              <div className="bg-wine dark:bg-purple-dark rounded-3xl p-6 text-center shadow-md">
                <div className="mb-2 text-4xl">👰</div>
                <h3 className="text-pink-light font-semibold">Novias</h3>
                <p className="text-pink-light/80 text-sm">Tu día especial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
