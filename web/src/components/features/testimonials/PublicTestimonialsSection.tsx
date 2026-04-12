import Link from 'next/link'
import { Heart } from 'lucide-react'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { ROUTES } from '@/config/routes'
import type { Testimonial } from '@/generated/prisma/client'

function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div
      className={`grid gap-6 ${
        testimonials.length === 1
          ? 'mx-auto max-w-md'
          : testimonials.length === 2
            ? 'mx-auto max-w-2xl md:grid-cols-2'
            : 'md:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="bg-card border-border/50 flex h-full flex-col rounded-2xl border p-6 shadow-md"
        >
          <div className="mb-3 text-yellow-400">{'⭐'.repeat(t.rating)}</div>
          <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed italic">
            &ldquo;{t.text}&rdquo;
          </p>
          <div className="mt-auto">
            <p className="text-card-foreground font-semibold">— {t.name}</p>
            {t.position && <p className="text-muted-foreground text-xs">{t.position}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function PublicTestimonialsSection() {
  const [testimonials, settings] = await Promise.all([
    getActiveTestimonials(9),
    getTestimonialSettings(),
  ])

  return (
    <div className="border-border bg-muted/30 border-t py-16 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {testimonials.length > 0 && (
          <>
            <h2 className="font-heading mb-12 text-center text-3xl font-bold text-(--foreground)">
              {settings?.title || 'Lo que dicen mis clientes'}
            </h2>

            {testimonials.length <= 3 ? (
              <TestimonialsGrid testimonials={testimonials} />
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
