'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProjectImage {
  id: string
  url: string
  order: number
}

interface SortableImageGridProps {
  projectId: string
  images: ProjectImage[]
  currentThumbnail: string | null
  onReorder: (imageIds: string[]) => Promise<void>
  onDelete: (imageId: string) => Promise<void>
  onSetThumbnail: (imageUrl: string) => Promise<void>
}

export default function SortableImageGrid({
  images,
  currentThumbnail,
  onReorder,
  onDelete,
  onSetThumbnail,
}: Omit<SortableImageGridProps, 'projectId'>) {
  const [localImages, setLocalImages] = useState(images)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localImages.findIndex((img) => img.id === active.id)
      const newIndex = localImages.findIndex((img) => img.id === over.id)

      const newImages = arrayMove(localImages, oldIndex, newIndex)
      setLocalImages(newImages)

      // Update order in DB
      await onReorder(newImages.map((img) => img.id))
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-foreground text-lg font-medium">Imágenes del Proyecto</h3>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localImages.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {localImages.map((img) => (
              <SortableImage
                key={img.id}
                image={img}
                isThumbnail={img.url === currentThumbnail}
                onDelete={() => {
                  if (confirm('¿Eliminar esta imagen?')) {
                    setLocalImages((prev) => prev.filter((i) => i.id !== img.id))
                    onDelete(img.id)
                  }
                }}
                onSetThumbnail={() => onSetThumbnail(img.url)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {localImages.length === 0 && (
        <div className="border-border flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground text-sm">No hay imágenes aún</p>
        </div>
      )}
    </div>
  )
}

interface SortableImageProps {
  image: ProjectImage
  isThumbnail: boolean
  onDelete: () => void
  onSetThumbnail: () => void
}

function SortableImage({ image, isThumbnail, onDelete, onSetThumbnail }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
        isThumbnail ? 'border-primary ring-primary/20 ring-2' : 'border-border'
      } ${isDragging ? 'scale-105 opacity-50' : 'opacity-100'}`}
    >
      {/* Image */}
      <Image
        src={image.url}
        alt="Imagen del proyecto"
        fill
        className="object-cover"
        sizes="200px"
      />

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-foreground absolute top-2 left-2 flex h-8 w-8 cursor-grab items-center justify-center rounded-md bg-white/90 hover:bg-white active:cursor-grabbing"
          title="Arrastrar para reordenar"
        >
          <GripVertical size={16} />
        </button>

        {/* Set as Thumbnail */}
        <button
          onClick={onSetThumbnail}
          className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
            isThumbnail
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground bg-white/90 hover:bg-white'
          }`}
          title={isThumbnail ? 'Portada actual' : 'Usar como portada'}
        >
          <Star size={16} fill={isThumbnail ? 'currentColor' : 'none'} />
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-md"
          title="Eliminar imagen"
        >
          <Trash2 size={16} />
        </button>

        {/* Thumbnail Badge */}
        {isThumbnail && (
          <div className="bg-primary text-primary-foreground absolute bottom-2 left-2 rounded px-2 py-1 text-xs font-semibold">
            Portada
          </div>
        )}
      </div>
    </motion.div>
  )
}
