'use client'

import { StaggerChildren, StaggerItem } from '@/components/ui'
import { TestimonialRatingStars } from '@/components/features/testimonials/TestimonialRatingStars'
import type { Testimonial } from '@/generated/prisma/client'

interface AnimatedTestimonialsGridProps {
  testimonials: Testimonial[]
  compact?: boolean
}

export function AnimatedTestimonialsGrid({
  testimonials,
  compact = false,
}: AnimatedTestimonialsGridProps) {
  const cardClass = compact
    ? 'bg-card border-border/50 flex flex-col rounded-2xl border p-5 shadow-sm'
    : 'bg-card border-border/50 flex h-full flex-col rounded-2xl border p-6 shadow-md'

  return (
    <StaggerChildren
      staggerDelay={0.1}
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
          <div className={cardClass}>
            <TestimonialRatingStars rating={t.rating} className={compact ? 'mb-2' : 'mb-3'} />
            <p
              className={
                compact
                  ? 'text-muted-foreground flex-1 text-sm leading-relaxed italic'
                  : 'text-muted-foreground mb-4 flex-1 text-sm leading-relaxed italic'
              }
            >
              &ldquo;{t.text}&rdquo;
            </p>
            <div className={compact ? 'mt-3' : 'mt-auto'}>
              <p
                className={
                  compact
                    ? 'text-xs font-semibold text-(--foreground)'
                    : 'text-card-foreground font-semibold'
                }
              >
                — {t.name}
              </p>
              {t.position && <p className="text-muted-foreground text-xs">{t.position}</p>}
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  )
}
