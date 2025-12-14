import ContactForm from '@/components/public/ContactForm'

/**
 * Página de Contacto - Diseño según Canva
 * Izquierda: Ilustración + nombre + info
 * Derecha: Formulario de contacto
 */
export default function ContactPage() {
  return (
    <section
      className="min-h-screen w-full"
      style={{ backgroundColor: 'var(--color-background, #fff1f9)' }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-12 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        {/* Columna Izquierda - Ilustración y nombre */}
        <div className="order-2 flex flex-col items-center lg:order-1 lg:items-start">
          {/* Ilustración */}
          <div className="mb-6 lg:mb-8">
            <span className="text-[8rem] sm:text-[10rem] lg:text-[14rem]">💄</span>
          </div>

          {/* Nombre en script */}
          <h1
            className="font-script mb-8 text-center lg:text-left"
            style={{
              color: 'var(--color-text-primary, #6c0a0a)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
            }}
          >
            Paola Bolívar Nievas
          </h1>

          {/* Info de contacto */}
          <div
            className="space-y-4 text-center lg:text-left"
            style={{ color: 'var(--color-text-primary, #6c0a0a)' }}
          >
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="text-xl">📧</span>
              <a
                href="mailto:paolabolivarnievas@gmail.com"
                className="transition-opacity hover:opacity-70"
              >
                paolabolivarnievas@gmail.com
              </a>
            </div>

            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="text-xl">📍</span>
              <span>Granada, España</span>
            </div>

            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="text-xl">📱</span>
              <a
                href="https://www.instagram.com/paolabolivarnievas"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
              >
                @paolabolivarnievas
              </a>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="order-1 lg:order-2">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
