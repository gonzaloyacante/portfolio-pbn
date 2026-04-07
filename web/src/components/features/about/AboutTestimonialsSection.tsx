import Link from 'next/link'
import { Heart } from 'lucide-react'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { FadeIn, StaggerChildren, StaggerItem, WordReveal } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import type { Testimonial } from '@/generated/prisma/client'

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-card border-border/50 flex h-full flex-col rounded-2xl border p-6 shadow-md transition-all duration-200 hover:shadow-lg">
      <div className="mb-3 text-yellow-400">{'⭐'.repeat(testimonial.rating)}</div>
      <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed italic">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="mt-auto">
        <p className="text-card-foreground font-semibold">— {testimonial.name}</p>
        {testimonial.position && (
          <p className="text-muted-foreground text-xs">{testimonial.position}</p>
        )}
      </div>
    </div>
  )
}

function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <StaggerChildren
      className={`grid gap-6 ${
        testimonials.length === 1
          ? 'mx-auto max-w-md'
          : testimonials.length === 2
            ? 'mx-auto max-w-2xl md:grid-cols-2'
            : 'md:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {testimonials.map((t) => (
        <StaggerItem key={t.id}>
          <TestimonialCard testimonial={t} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  )
}

interface AboutTestimonialsSectionProps {
  testimonials: Testimonial[]
  title: string
}

export function AboutTestimonialsSection({ testimonials, title }: AboutTestimonialsSectionProps) {
  return (
    <div className="border-border bg-muted/30 border-t py-16 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {testimonials.length > 0 && (
          <>
            <WordReveal
              text={title}
              as="h2"
              className="font-heading mb-12 text-center text-3xl font-bold text-(--foreground)"
            />
            {testimonials.length <= 3 ? (
              <TestimonialsGrid testimonials={testimonials} />
            ) : (
              <TestimonialSlider testimonials={testimonials} />
            )}
          </>
        )}

        <FadeIn className="mt-12 flex justify-center" delay={0.2}>
          <Link
            href={ROUTES.public.testimonialForm}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors"
          >
            <Heart size={16} />
            ¿Fuiste mi clienta? Deja tu opinión
          </Link>
        </FadeIn>
      </div>
    </div>
  )
}
