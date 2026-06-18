'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from '@/components/ui'
import { TestimonialCard } from '@/components/features/testimonials/TestimonialCard'
import type { Testimonial } from '@/generated/prisma/client'

const DEFAULT_AUTO_ADVANCE_MS = 10_000

function getCardsVisible() {
  if (typeof window === 'undefined') return 1
  if (window.matchMedia('(min-width: 1024px)').matches) return 3
  if (window.matchMedia('(min-width: 640px)').matches) return 2
  return 1
}

interface TestimonialSliderProps {
  testimonials: Testimonial[]
  autoAdvanceMs?: number | null
}

export default function TestimonialSlider({ testimonials, autoAdvanceMs }: TestimonialSliderProps) {
  const total = testimonials.length
  const [cardsVisible, setCardsVisible] = useState(1)
  const maxStart = Math.max(0, total - cardsVisible)
  const [start, setStart] = useState(0)
  const [manualNavigationVersion, setManualNavigationVersion] = useState(0)
  const intervalMs =
    typeof autoAdvanceMs === 'number' && Number.isFinite(autoAdvanceMs) && autoAdvanceMs > 0
      ? autoAdvanceMs
      : DEFAULT_AUTO_ADVANCE_MS

  const resetAutoAdvance = useCallback(() => {
    setManualNavigationVersion((version) => version + 1)
  }, [])

  const prev = useCallback(() => {
    setStart((s) => Math.max(0, s - 1))
    resetAutoAdvance()
  }, [resetAutoAdvance])

  const next = useCallback(() => {
    setStart((s) => Math.min(maxStart, s + 1))
    resetAutoAdvance()
  }, [maxStart, resetAutoAdvance])

  const goTo = useCallback(
    (index: number) => {
      setStart(index)
      resetAutoAdvance()
    },
    [resetAutoAdvance]
  )

  useEffect(() => {
    const update = () => {
      const nextVisible = getCardsVisible()
      setCardsVisible(nextVisible)
      setStart((current) => Math.min(current, Math.max(0, total - nextVisible)))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [total])

  useEffect(() => {
    if (total <= cardsVisible) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    const interval = setInterval(() => setStart((s) => (s >= maxStart ? 0 : s + 1)), intervalMs)
    return () => clearInterval(interval)
  }, [total, cardsVisible, maxStart, intervalMs, manualNavigationVersion])

  const visible = testimonials.slice(start, start + cardsVisible)

  return (
    <div className="relative">
      {/* Cards row */}
      <div className="relative min-h-[22rem] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${start}-${cardsVisible}`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="grid min-h-[22rem] grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} showAvatar />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation — only when there are more testimonials than the current viewport shows */}
      {total > cardsVisible && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={start === 0}
            aria-label="Anterior"
            className="public-testimonial-nav-button flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: maxStart + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir al grupo ${i + 1}`}
                className="flex items-center justify-center p-3"
              >
                <span
                  className={`pointer-events-none block h-2 rounded-full transition-all ${
                    i === start
                      ? 'public-testimonial-dot-active w-6'
                      : 'public-testimonial-dot-inactive w-2'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={next}
            disabled={start >= maxStart}
            aria-label="Siguiente"
            className="public-testimonial-nav-button flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
