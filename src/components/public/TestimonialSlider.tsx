'use client'

import { useState, useEffect } from 'react'
import { Testimonial } from '@/lib/testimonials'

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
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-4 flex justify-center">
        {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
          <svg key={i} className="h-5 w-5 fill-current text-yellow-400" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>

      <blockquote className="mb-6 text-center text-lg text-gray-700 italic">
        &ldquo;{currentTestimonial.text}&rdquo;
      </blockquote>

      <div className="text-center">
        <p className="font-semibold text-gray-900">{currentTestimonial.name}</p>
        {currentTestimonial.position && (
          <p className="text-sm text-gray-500">{currentTestimonial.position}</p>
        )}
      </div>

      {testimonials.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
