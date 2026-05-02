'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { OptimizedImage } from '@/components/ui'
import { TestimonialRatingStars } from '@/components/features/testimonials/TestimonialRatingStars'
import type { Testimonial } from '@/generated/prisma/client'

const CARDS_VISIBLE = 3
const AUTO_ADVANCE_MS = 5000

interface TestimonialSliderProps {
  testimonials: Testimonial[]
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-card border-border/50 flex h-full flex-col rounded-2xl border p-6 shadow-md transition-all duration-200 hover:shadow-lg">
      <TestimonialRatingStars rating={testimonial.rating} className="mb-3" />
      <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed italic">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-3">
        {testimonial.avatarUrl ? (
          <OptimizedImage
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            width={40}
            height={40}
            variant="thumbnail"
            placeholder="empty"
            imgClassName="border-primary/30 h-10 w-10 rounded-full border-2"
          />
        ) : (
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1">
            <p className="text-card-foreground text-sm font-semibold">{testimonial.name}</p>
            {testimonial.verified && (
              <span
                className="text-primary"
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
            <p className="text-muted-foreground text-xs">
              {[testimonial.position, testimonial.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const total = testimonials.length
  const maxStart = Math.max(0, total - CARDS_VISIBLE)
  const [start, setStart] = useState(0)

  const prev = useCallback(() => setStart((s) => Math.max(0, s - 1)), [])
  const next = useCallback(() => setStart((s) => Math.min(maxStart, s + 1)), [maxStart])

  useEffect(() => {
    if (total <= CARDS_VISIBLE) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    const interval = setInterval(
      () => setStart((s) => (s >= maxStart ? 0 : s + 1)),
      AUTO_ADVANCE_MS
    )
    return () => clearInterval(interval)
  }, [total, maxStart])

  const visible = testimonials.slice(start, start + CARDS_VISIBLE)

  return (
    <div className="relative">
      {/* Cards row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>

      {/* Navigation — only when more than CARDS_VISIBLE */}
      {total > CARDS_VISIBLE && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={start === 0}
            aria-label="Anterior"
            className="border-border text-foreground hover:bg-primary hover:text-primary-foreground disabled:text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: maxStart + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStart(i)}
                aria-label={`Ir al grupo ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === start ? 'bg-primary w-6' : 'bg-muted-foreground/30 w-2'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={start >= maxStart}
            aria-label="Siguiente"
            className="border-border text-foreground hover:bg-primary hover:text-primary-foreground disabled:text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
