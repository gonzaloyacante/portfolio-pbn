'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, OptimizedImage } from '@/components/ui'
import { GripVertical, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GalleryImage } from './types'

export type { GalleryImage }

// ── Sortable image card ───────────────────────────────────────────────────────

interface SortableImageCardProps {
  image: GalleryImage
  index: number
  onToggleFeatured: (id: string, val: boolean) => void
}

export function SortableImageCard({ image, index, onToggleFeatured }: SortableImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
  }

  const aspectRatio = image.height && image.width ? image.height / image.width : 1.5

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.4) }}
      className={cn(
        'group bg-muted relative overflow-hidden rounded-2xl shadow-sm transition-shadow',
        isDragging ? 'shadow-none' : 'hover:shadow-lg'
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-grab rounded-lg bg-foreground/50 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label={`Mover ${image.title}`}
      >
        <GripVertical size={14} className="text-background" />
      </div>

      {/* Featured toggle + position badge */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFeatured(image.id, !image.isFeatured)
          }}
          title={image.isFeatured ? 'Quitar de destacados' : 'Marcar como destacada'}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full backdrop-blur-sm transition-colors',
            image.isFeatured
              ? 'bg-warning text-warning-foreground'
              : 'bg-foreground/50 text-background/70 hover:text-warning'
          )}
        >
          <Star size={12} className={image.isFeatured ? 'fill-current' : ''} />
        </button>
        <div className="rounded-full bg-foreground/50 px-2 py-0.5 text-xs font-medium text-background backdrop-blur-sm">
          #{index + 1}
        </div>
      </div>

      {/* Featured indicator — always visible */}
      {image.isFeatured && (
        <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-warning opacity-100 group-hover:opacity-0">
          <Star size={12} className="fill-current text-warning-foreground" />
        </div>
      )}

      {/* Image */}
      <div className="relative w-full" style={{ paddingBottom: `${aspectRatio * 100}%` }}>
        <OptimizedImage
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Title hover overlay */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-foreground/70 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
        <p className="truncate text-xs font-medium text-background">{image.title}</p>
      </div>
    </motion.div>
  )
}

// ── Drag overlay card ─────────────────────────────────────────────────────────

export function DragOverlayCard({ image }: { image: GalleryImage }) {
  const aspectRatio = image.height && image.width ? image.height / image.width : 1.5
  return (
    <div className="ring-primary w-48 overflow-hidden rounded-2xl shadow-2xl ring-2">
      <div className="bg-muted relative w-full" style={{ paddingBottom: `${aspectRatio * 100}%` }}>
        <OptimizedImage
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="192px"
        />
      </div>
    </div>
  )
}

// ── Save-bar animation wrapper ────────────────────────────────────────────────

export function AnimatePresenceWrapper({
  show,
  children,
}: {
  show: boolean
  children: React.ReactNode
}) {
  if (!show) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}
