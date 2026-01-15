import Image from 'next/image'
import { getAboutSettings } from '@/actions/theme.actions'
import { getActiveTestimonials } from '@/actions/testimonials.actions'
import TestimonialForm from '@/components/public/TestimonialForm'

export default async function AboutPage() {
  const [testimonials, aboutSettings] = await Promise.all([
    getActiveTestimonials(6),
    getAboutSettings(),
  ])

  // Use normalized AboutSettings directly (no JSON parsing needed!)
  const bioData = {
    ownerName: aboutSettings?.bioTitle || 'Paola Bolívar Nievas',
    bio: aboutSettings?.bioDescription || '',
    imageUrl: aboutSettings?.profileImageUrl || '',
    skills: aboutSettings?.skills || [],
  }

  const paragraphs = (bioData.bio || '').split('\n\n').filter(Boolean)

  return (
    <section
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-12 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        {/* Columna Izquierda - Texto */}
        <div className="order-2 lg:order-1">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start lg:gap-4">
            <h1
              className="font-script"
              style={{ color: 'var(--color-text)', fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              {bioData.ownerName || 'Paola Bolívar Nievas'}
            </h1>
            <span className="text-4xl sm:text-5xl">💄</span>
          </div>

          <div
            className="space-y-5 text-justify leading-relaxed"
            style={{
              color: 'var(--color-text)',
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
            className="relative aspect-3/4 w-full max-w-xs overflow-hidden shadow-2xl sm:max-w-sm lg:max-w-md"
            style={{ borderRadius: '50% / 45%' }}
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
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                }}
              >
                <span className="text-8xl">💄</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Testimonios */}
      <div
        className="border-t py-16 transition-colors duration-300"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-background)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16">
          <h2
            className="font-heading mb-12 text-center text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            Lo que dicen mis clientes
          </h2>

          {/* Testimonios existentes */}
          {testimonials.length > 0 && (
            <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <div className="mb-3 text-yellow-400">{'⭐'.repeat(testimonial.rating)}</div>
                  <p
                    className="mb-4 text-sm leading-relaxed"
                    style={{ color: 'var(--color-text)' }}
                  >
                    &quot;{testimonial.text}&quot;
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    — {testimonial.name}
                  </p>
                  {testimonial.position && (
                    <p className="text-xs" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                      {testimonial.position}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Formulario para dejar testimonio */}
          <div className="mx-auto max-w-lg">
            <h3
              className="mb-6 text-center text-xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              ¿Has trabajado conmigo? ¡Deja tu opinión!
            </h3>
            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <TestimonialForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
