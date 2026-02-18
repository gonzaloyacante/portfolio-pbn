import TestimonialForm from '@/components/features/testimonials/TestimonialForm'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import type { Testimonial } from '@prisma/client'

interface TestimonialCardProps {
  testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-card border-border/50 rounded-2xl border p-6 shadow-md transition-all duration-200 hover:shadow-lg">
      <div className="mb-3 text-yellow-400">{'⭐'.repeat(testimonial.rating)}</div>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        &quot;{testimonial.text}&quot;
      </p>
      <p className="text-card-foreground font-semibold">— {testimonial.name}</p>
      {testimonial.position && (
        <p className="text-muted-foreground text-xs">{testimonial.position}</p>
      )}
    </div>
  )
}

function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  )
}

interface AboutTestimonialsSectionProps {
  testimonials: Testimonial[]
  title: string
}

export function AboutTestimonialsSection({ testimonials, title }: AboutTestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <div className="border-border bg-muted/30 border-t py-16 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <h2 className="font-heading mb-12 text-center text-3xl font-bold text-(--foreground)">
          {title}
        </h2>

        {testimonials.length <= 3 ? (
          <TestimonialsGrid testimonials={testimonials} />
        ) : (
          <TestimonialSlider testimonials={testimonials} />
        )}

        <div className="mx-auto mt-16 max-w-lg">
          <h3 className="mb-6 text-center text-xl font-bold text-(--foreground)">
            ¿Has trabajado conmigo? ¡Deja tu opinión!
          </h3>
          <div className="bg-card border-border/50 rounded-2xl border p-6 shadow-md">
            <TestimonialForm />
          </div>
        </div>
      </div>
    </div>
  )
}
