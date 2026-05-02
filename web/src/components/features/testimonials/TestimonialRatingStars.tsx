import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialRatingStarsProps {
  rating: number
  className?: string
  /** `sm` ≈ 16px, `md` ≈ 20px */
  size?: 'sm' | 'md'
}

/** Estrellas con token `warning`; usable en server y client components. */
export function TestimonialRatingStars({
  rating,
  className,
  size = 'sm',
}: TestimonialRatingStarsProps) {
  const n = Math.min(5, Math.max(0, Math.round(rating)))
  const sizeCls = size === 'md' ? 'size-5' : 'size-4'

  return (
    <div
      className={cn('flex flex-wrap gap-0.5', className)}
      role="img"
      aria-label={`Valoración: ${n} de 5 estrellas`}
    >
      {Array.from({ length: n }, (_, i) => (
        <Star key={i} className={cn(sizeCls, 'text-warning fill-warning shrink-0')} aria-hidden />
      ))}
    </div>
  )
}
