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
      className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm"
    >
      <div {...attributes} {...listeners} className="absolute inset-0 z-10 cursor-move" />

      <Image src={url} alt="Project image" fill className="object-cover" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(id)
        }}
        className="absolute top-2 right-2 z-20 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-black/50 p-1 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        Arrastrar para ordenar
      </div>
    </div>
  )
}
