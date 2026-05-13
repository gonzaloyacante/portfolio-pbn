import type { Metadata } from 'next'
import { AnimatedTestimonialsGrid } from '@/components/features/testimonials/AnimatedTestimonialsGrid'
import TestimonialForm from '@/components/features/testimonials/TestimonialForm'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import { ROUTES } from '@/config/routes'

export const metadata: Metadata = {
  title: 'Deja tu testimonio | Paola Bolívar Nievas',
  description: '¿Fuiste mi clienta? Me encantaría conocer tu experiencia.',
  alternates: {
    canonical: ROUTES.public.testimonialForm,
  },
  robots: { index: false },
}

export default async function TestimonyPage() {
  const [testimonials, settings] = await Promise.all([
    getActiveTestimonials(6),
    getTestimonialSettings(),
  ])

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
              <AnimatedTestimonialsGrid testimonials={testimonials} compact />
            ) : (
              <TestimonialSlider
                testimonials={testimonials}
                autoAdvanceMs={settings?.sliderAutoAdvanceMs}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
