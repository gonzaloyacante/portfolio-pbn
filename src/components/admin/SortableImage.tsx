'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'

interface SortableImageProps {
  id: string
  url: string
  onDelete: (id: string) => void
}

export function SortableImage({ id, url, onDelete }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group border-wine/10 bg-pink-light/20 hover:border-pink-hot/50 dark:border-pink-light/10 dark:bg-purple-dark/30 dark:hover:border-pink-hot/50 relative aspect-square overflow-hidden rounded-2xl border-2 shadow-sm transition-all hover:shadow-md"
    >
      <div {...attributes} {...listeners} className="absolute inset-0 z-10 cursor-move" />

      <Image
        src={url}
        alt="Project image"
        fill
        className="object-cover transition-transform group-hover:scale-105"
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(id)
        }}
        className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:scale-110 hover:bg-red-600"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="from-wine/80 pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t to-transparent p-2 pt-8 text-center text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
        Arrastrar para ordenar
      </div>
    </div>
  )
}
