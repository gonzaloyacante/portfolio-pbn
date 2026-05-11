import type { Metadata } from 'next'
import { TestimonialRatingStars } from '@/components/features/testimonials/TestimonialRatingStars'
import TestimonialForm from '@/components/features/testimonials/TestimonialForm'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { ROUTES } from '@/config/routes'
import type { Testimonial } from '@/generated/prisma/client'

export const metadata: Metadata = {
  title: 'Deja tu testimonio | Paola Bolívar Nievas',
  description: '¿Fuiste mi clienta? Me encantaría conocer tu experiencia.',
  alternates: {
    canonical: ROUTES.public.testimonialForm,
  },
  robots: { index: false },
}

function TestimonialsRow({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div
      className={`grid gap-6 ${
        testimonials.length === 1
          ? 'mx-auto max-w-md'
          : testimonials.length === 2
            ? 'mx-auto max-w-2xl sm:grid-cols-2'
            : 'sm:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="bg-card border-border/50 flex flex-col rounded-2xl border p-5 shadow-sm"
        >
          <TestimonialRatingStars rating={t.rating} className="mb-2" />
          <p className="text-muted-foreground flex-1 text-sm leading-relaxed italic">
            &ldquo;{t.text}&rdquo;
          </p>
          <p className="mt-3 text-xs font-semibold text-(--foreground)">— {t.name}</p>
          {t.position && <p className="text-muted-foreground text-xs">{t.position}</p>}
        </div>
      ))}
    </div>
  )
}

export default async function TestimonyPage() {
  const testimonials = await getActiveTestimonials(6)

  return (
    <section className="bg-background min-h-[70dvh] py-16 transition-colors duration-500">
      <div className="mx-auto max-w-lg px-6">
        {/* Form */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <h1 className="font-heading mb-3 text-3xl font-bold text-(--foreground)">
              Deja tu testimonio
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              ¿Contrataste mis servicios? Me encantaría leer tu experiencia.
              <br />
              Tu opinión es muy importante para mí. ¡Gracias!
            </p>
          </div>

          <div className="bg-card border-border/50 rounded-2xl border p-5 shadow-md sm:p-8">
            <TestimonialForm />
          </div>
        </div>

        {/* Existing testimonials — only shown if there are any */}
        {testimonials.length > 0 && (
          <div className="border-t border-(--border) pt-16">
            <h2 className="font-heading mb-8 text-center text-2xl font-bold text-(--foreground)">
              Lo que dicen otras clientas
            </h2>
            {testimonials.length <= 3 ? (
              <TestimonialsRow testimonials={testimonials} />
            ) : (
              <TestimonialSlider testimonials={testimonials} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
