'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { OptimizedImage } from '@/components/ui'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProjectNavData {
  title: string
  slug: string
  thumbnailUrl: string | null
}

interface ProjectNavigationProps {
  previous: ProjectNavData | null
  next: ProjectNavData | null
  categorySlug: string
  currentSlug: string
}

export default function ProjectNavigation({
  previous,
  next,
  categorySlug,
  currentSlug,
}: ProjectNavigationProps) {
  // Edge case: If there is only 1 project (or 0), current is previous is next.
  // We hide navigation in this case.
  if (!previous || !next || (previous.slug === currentSlug && next.slug === currentSlug)) {
    return null
  }

  return (
    <nav
      aria-label="Navegación entre proyectos"
      className="grid grid-cols-1 border-t border-(--primary)/10 md:grid-cols-2"
    >
      {/* Previous */}
      <NavButton project={previous} direction="prev" categorySlug={categorySlug} />

      {/* Next */}
      <NavButton project={next} direction="next" categorySlug={categorySlug} />
    </nav>
  )
}

function NavButton({
  project,
  direction,
  categorySlug,
}: {
  project: ProjectNavData | null
  direction: 'prev' | 'next'
  categorySlug: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  const isPrev = direction === 'prev'

  if (!project) {
    return <div className="hidden md:block" />
  }

  return (
    <Link
      href={`/proyectos/${categorySlug}/${project.slug}`}
      className={cn(
        'group relative flex min-h-[150px] flex-col justify-center overflow-hidden bg-(--background) px-8 py-12 transition-colors hover:text-white md:min-h-[200px]',
        isPrev
          ? 'items-start border-b border-(--primary)/10 md:border-r md:border-b-0'
          : 'items-end'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image Reveal */}
      <AnimatePresence>
        {isHovered && project.thumbnailUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 z-10 bg-black/70" /> {/* Dark Overlay */}
            <OptimizedImage
              src={project.thumbnailUrl}
              alt=""
              fill
              className="scale-110 object-cover blur-sm" // Aesthetic blur
              variant="card"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2 transition-transform duration-300 group-hover:scale-105">
        <span
          className={cn(
            'flex items-center gap-2 text-xs font-bold tracking-widest text-(--primary) uppercase group-hover:text-white/90',
            !isPrev && 'flex-row-reverse'
          )}
        >
          {isPrev ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          {isPrev ? 'Proyecto Anterior' : 'Siguiente Proyecto'}
        </span>
        <h3
          className={cn(
            'font-heading max-w-[15ch] text-2xl leading-tight font-bold text-(--foreground) group-hover:text-white sm:text-3xl md:text-3xl',
            isPrev ? 'text-left' : 'text-right'
          )}
        >
          {project.title}
        </h3>
      </div>
    </Link>
  )
}
