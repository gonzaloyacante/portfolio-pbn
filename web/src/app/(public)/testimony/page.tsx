import type { Metadata } from 'next'
import TestimonialForm from '@/components/features/testimonials/TestimonialForm'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import { ROUTES } from '@/config/routes'
import { getContactSettings } from '@/actions/settings/contact'
import { getSiteSettings } from '@/actions/settings/site'
import { buildSeoMetadata } from '@/lib/seo-metadata'

/** Cache público — invalidación explícita desde CMS. */
export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const [contact, site] = await Promise.all([getContactSettings(), getSiteSettings()])
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'

  return buildSeoMetadata({
    title: `Deja tu testimonio | ${ownerName}`,
    description: '¿Fuiste mi clienta? Me encantaría conocer tu experiencia.',
    path: ROUTES.public.testimonialForm,
    site,
    ownerName,
    image: site?.defaultOgImage,
    imageAlt: `Testimonios de ${ownerName}`,
    robots: { index: false, follow: false },
  })
}

export default async function TestimonyPage() {
  const [testimonials, settings] = await Promise.all([
    getActiveTestimonials(6),
    getTestimonialSettings(),
  ])

  return (
    <section className="public-testimonial-page min-h-[70dvh] py-16 transition-colors duration-500">
      <div className="mx-auto max-w-lg px-6">
        {/* Form */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <h1 className="public-testimonial-title font-heading mb-3 text-3xl font-bold">
              Deja tu testimonio
            </h1>
            <p className="public-testimonial-meta text-sm leading-relaxed">
              ¿Contrataste mis servicios? Me encantaría leer tu experiencia.
              <br />
              Tu opinión es muy importante para mí. ¡Gracias!
            </p>
          </div>

          <div className="public-testimonial-form-panel rounded-2xl border p-5 shadow-md sm:p-8">
            <TestimonialForm />
          </div>
        </div>

        {/* Existing testimonials — only shown if there are any */}
        {testimonials.length > 0 && (
          <div className="public-testimonial-section border-t pt-16">
            <h2 className="public-testimonial-title font-heading mb-8 text-center text-2xl font-bold">
              Lo que dicen otras clientas
            </h2>
            <TestimonialSlider
              testimonials={testimonials}
              autoAdvanceMs={settings?.sliderAutoAdvanceMs}
            />
          </div>
        )}
      </div>
    </section>
  )
}
