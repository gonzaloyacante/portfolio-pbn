'use client'

import { OptimizedImage } from '@/components/ui'
import { TestimonialRatingStars } from '@/components/features/testimonials/TestimonialRatingStars'
import type { Testimonial } from '@/generated/prisma/client'

interface TestimonialCardProps {
  testimonial: Testimonial
  compact?: boolean
  showAvatar?: boolean
}

export function TestimonialCard({
  testimonial,
  compact = false,
  showAvatar = false,
}: TestimonialCardProps) {
  return (
    <div
      className={
        compact
          ? 'public-testimonial-card flex flex-col rounded-2xl border p-5 shadow-sm'
          : 'public-testimonial-card flex h-full min-h-[22rem] flex-col rounded-2xl border p-6 shadow-md transition-all duration-200 hover:shadow-lg'
      }
    >
      <TestimonialRatingStars rating={testimonial.rating} className={compact ? 'mb-2' : 'mb-3'} />

      <p
        className={
          compact
            ? 'public-testimonial-meta flex-1 text-sm leading-relaxed italic'
            : 'public-testimonial-meta mb-4 flex-1 text-sm leading-relaxed italic'
        }
      >
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {showAvatar ? (
        <div className="mt-auto flex items-center gap-3">
          {testimonial.avatarUrl ? (
            <div className="public-testimonial-avatar h-10 w-10 overflow-hidden rounded-full border-2">
              <OptimizedImage
                src={testimonial.avatarUrl}
                alt={testimonial.name}
                width={40}
                height={40}
                variant="thumbnail"
                placeholder="empty"
                imgClassName="h-10 w-10 rounded-full"
              />
            </div>
          ) : (
            <div className="public-testimonial-avatar flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
              {testimonial.name.charAt(0)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1">
              <p className="public-testimonial-text text-sm font-semibold">{testimonial.name}</p>
              {testimonial.verified && (
                <span
                  className="public-testimonial-verified"
                  title="Cliente verificado"
                  aria-label="Cliente verificado"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </span>
              )}
            </div>

            {(testimonial.position || testimonial.company) && (
              <p className="public-testimonial-meta text-xs">
                {[testimonial.position, testimonial.company].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className={compact ? 'mt-3' : 'mt-auto'}>
          <p
            className={
              compact
                ? 'public-testimonial-text text-xs font-semibold'
                : 'public-testimonial-text font-semibold'
            }
          >
            — {testimonial.name}
          </p>
          {testimonial.position && (
            <p className="public-testimonial-meta text-xs">{testimonial.position}</p>
          )}
        </div>
      )}
    </div>
  )
}
