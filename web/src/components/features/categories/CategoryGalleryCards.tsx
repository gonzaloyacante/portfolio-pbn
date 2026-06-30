'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, OptimizedImage } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { GripVertical, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GalleryImage } from './types'

export type { GalleryImage }

// ── Sortable image card ───────────────────────────────────────────────────────

interface SortableImageCardProps {
  image: GalleryImage
  index: number
  onToggleFeatured: (id: string, val: boolean) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function SortableImageCard({
  image,
  index,
  onToggleFeatured,
  onDelete,
  isDeleting = false,
}: SortableImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
    disabled: isDeleting,
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
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.4) }}
      className={cn(
        'group bg-muted relative overflow-hidden rounded-2xl shadow-sm transition-shadow',
        isDragging ? 'shadow-none' : 'hover:shadow-lg',
        isDeleting && 'pointer-events-none'
      )}
    >
      {/* Drag handle — siempre visible (tenue sin hover, pleno en hover) */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Mover ${image.title} a otra posición`}
        title="Arrastrar para reordenar"
        className="bg-foreground/60 hover:bg-foreground/80 absolute top-2 left-2 z-10 flex h-7 w-7 cursor-grab items-center justify-center rounded-lg p-1.5 opacity-70 backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:cursor-grabbing"
      >
        <GripVertical size={14} className="text-background" />
      </button>

      {/* Acciones: destacada, posición, eliminar — siempre visibles */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
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
              : 'bg-foreground/60 text-background/80 hover:text-warning'
          )}
        >
          <Star size={12} className={image.isFeatured ? 'fill-current' : ''} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(image.id)
          }}
          disabled={isDeleting}
          title="Eliminar imagen"
          aria-label={`Eliminar ${image.title}`}
          className="bg-foreground/60 text-background/80 hover:bg-destructive hover:text-destructive-foreground flex h-6 w-6 items-center justify-center rounded-full backdrop-blur-sm transition-colors disabled:opacity-50"
        >
          <Trash2 size={12} />
        </button>
        <div className="bg-foreground/60 text-background rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
          #{index + 1}
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full" style={{ paddingBottom: `${aspectRatio * 100}%` }}>
        <OptimizedImage
          src={image.url}
          alt={image.alt}
          fill
          sizes={IMAGE_SIZES.publicThreeColGrid}
        />
      </div>

      {/* Title hover overlay */}
      <div className="from-foreground/70 absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
        <p className="text-background truncate text-xs font-medium">{image.title}</p>
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
        <OptimizedImage src={image.url} alt={image.alt} fill sizes={IMAGE_SIZES.adminThumbLg} />
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
