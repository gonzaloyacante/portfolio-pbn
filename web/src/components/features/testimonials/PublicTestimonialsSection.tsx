import Link from 'next/link'
import { Heart } from 'lucide-react'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { AnimatedTestimonialsGrid } from '@/components/features/testimonials/AnimatedTestimonialsGrid'
import { ROUTES } from '@/config/routes'

export default async function PublicTestimonialsSection() {
  const [testimonials, settings] = await Promise.all([
    getActiveTestimonials(9),
    getTestimonialSettings(),
  ])

  return (
    <div className="border-border bg-accent border-t py-12 transition-colors duration-500 lg:py-14">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {testimonials.length > 0 && (
          <>
            <h2 className="font-heading mb-12 text-center text-3xl font-bold text-(--foreground)">
              {settings?.title || 'Lo que dicen mis clientes'}
            </h2>

            {testimonials.length <= 3 ? (
              <AnimatedTestimonialsGrid testimonials={testimonials} />
            ) : (
              <TestimonialSlider testimonials={testimonials} />
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href={ROUTES.public.testimonialForm}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors"
          >
            <Heart size={16} />
            ¿Fuiste mi clienta? Deja tu opinión
          </Link>
        </div>
      </div>
    </div>
  )
}
