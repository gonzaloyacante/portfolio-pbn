'use client'

import { useState, useEffect } from 'react'
import { Testimonial } from '@/generated/prisma/client'
import Image from 'next/image'

interface TestimonialSliderProps {
  testimonials: Testimonial[]
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="bg-card border-border/50 mx-auto max-w-3xl rounded-xl border p-8 shadow-lg">
      <div className="mb-4 flex justify-center">
        {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
          <span key={i} className="text-warning text-xl drop-shadow-sm">
            ⭐
          </span>
        ))}
      </div>

      <blockquote className="text-muted-foreground relative mb-6 text-center text-lg italic">
        &ldquo;{currentTestimonial.text}&rdquo;
      </blockquote>

      <div className="flex flex-col items-center gap-3">
        {currentTestimonial.avatarUrl ? (
          <Image
            src={currentTestimonial.avatarUrl}
            alt={currentTestimonial.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border-2 border-(--primary) object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--primary)/10 text-lg font-bold text-(--primary)">
            {currentTestimonial.name.charAt(0)}
          </div>
        )}

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-foreground text-lg font-semibold">{currentTestimonial.name}</p>
            {currentTestimonial.verified && (
              <span title="Cliente Verificado" className="text-info">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </span>
            )}
          </div>

          <div className="text-muted-foreground flex flex-col gap-0.5 text-sm">
            {currentTestimonial.position && <span>{currentTestimonial.position}</span>}
            {currentTestimonial.company && (
              <span className="text-primary font-medium">
                {currentTestimonial.website ? (
                  <a
                    href={currentTestimonial.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @{currentTestimonial.company}
                  </a>
                ) : (
                  `@${currentTestimonial.company}`
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
