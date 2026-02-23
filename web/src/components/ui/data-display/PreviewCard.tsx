import { clsx } from 'clsx'
import { motion } from 'framer-motion'
// import { OptimizedImage } from '@/components/ui' // Unused

interface PreviewCardProps {
  variant: 'project' | 'category'
  title: string
  subtitle?: string // Category name or "X proyectos"
  showTitle?: boolean
  showSubtitle?: boolean
  image?: string // Mock image override
}

/**
 * Preview Card
 * Mimics the EXACT style of public cards (rounded-[2.5rem], etc.)
 */
export default function PreviewCard({
  variant,
  title,
  subtitle,
  showTitle = true,
  showSubtitle = true,
}: PreviewCardProps) {
  // Styles based on src/app/(public)/projects/page.tsx (Categories)
  // and src/components/public/CategoryGallery.tsx (Projects/Images)

  const isCategory = variant === 'category'

  // Category Card Style: rounded-[2.5rem], aspect-[4/5]
  // Project Image Style: rounded-xl, varies but mostly aspect-square or masonry
  const containerClasses = clsx(
    'relative overflow-hidden shadow-lg transition-transform group hover:scale-[1.02] bg-card',
    isCategory ? 'rounded-[2.5rem] aspect-[4/5]' : 'rounded-2xl aspect-square'
  )

  return (
    <div className={containerClasses}>
      {/* Background (Mock Image) */}
      <div className="bg-muted absolute inset-0 flex items-center justify-center">
        <span className="text-4xl opacity-10">📷</span>
        {/* Placeholder Gradient */}
        <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br" />
      </div>

      {/* Overlay Gradient (Same as public) */}
      {(showTitle || showSubtitle) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
      )}

      {/* Content */}
      <div
        className={clsx(
          'absolute p-6',
          isCategory ? 'inset-x-0 bottom-0' : 'inset-x-0 right-0 bottom-0 left-0'
        )}
      >
        {/* Subtitle (Category Name for Project, or Count for Category) */}
        {showSubtitle && subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'mb-1 font-medium',
              isCategory
                ? 'text-primary text-xs tracking-wider uppercase' // e.g. "EXPLORAR" or count (if we used count)
                : 'text-primary text-[10px] font-bold tracking-wider uppercase' // Category Name on Project
            )}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Title */}
        {showTitle && (
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'font-bold text-white',
              isCategory ? 'font-heading translate-y-2 text-2xl' : 'text-lg leading-tight'
            )}
          >
            {title}
          </motion.h3>
        )}

        {/* Decorator line for Category Card (as seen in code) */}
        {isCategory && <div className="mt-2 h-1 w-12 rounded-full bg-white/50" />}
      </div>
    </div>
  )
}
