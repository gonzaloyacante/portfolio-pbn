'use client'

import { useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { OptimizedImage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'

interface GalleryImage {
  id: string
  url: string
  width?: number | null
  height?: number | null
  title?: string
  projectSlug?: string
}

interface DraggableMasonryGalleryProps {
  images: GalleryImage[]
  onReorder: (newImages: GalleryImage[]) => void
}

export default function DraggableMasonryGallery({
  images,
  onReorder,
}: DraggableMasonryGalleryProps) {
  const [localImages, setLocalImages] = useState(images)
  const [activeId, setActiveId] = useState<string | null>(null)

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Responsive columns (same as MasonryGallery)
  const [columns, setColumns] = useState(3)

  // Calculate columns based on window width
  useMemo(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) setColumns(3)
        else if (window.innerWidth >= 640) setColumns(2)
        else setColumns(1)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Shortest Column Distribution
  const columnsData = useMemo(() => {
    const cols = Array.from({ length: columns }, () => ({
      images: [] as (GalleryImage & { originalIndex: number })[],
      height: 0,
    }))

    localImages.forEach((img, idx) => {
      const aspectRatio = img.height && img.width ? img.height / img.width : 1.2

      let minColIndex = 0
      let minHeight = cols[0].height

      cols.forEach((col, colIdx) => {
        if (col.height < minHeight) {
          minHeight = col.height
          minColIndex = colIdx
        }
      })

      cols[minColIndex].images.push({ ...img, originalIndex: idx })
      cols[minColIndex].height += aspectRatio
    })

    return cols
  }, [localImages, columns])

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = localImages.findIndex((img) => img.id === active.id)
      const newIndex = localImages.findIndex((img) => img.id === over.id)

      const newImages = arrayMove(localImages, oldIndex, newIndex)
      setLocalImages(newImages)
      onReorder(newImages)
    }
  }

  const activeImage = localImages.find((img) => img.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localImages.map((img) => img.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={cn(
            'grid gap-4',
            columns === 1 && 'grid-cols-1',
            columns === 2 && 'grid-cols-2',
            columns === 3 && 'grid-cols-3'
          )}
        >
          {columnsData.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {col.images.map((image) => (
                <SortableImageCard key={image.id} image={image} index={image.originalIndex} />
              ))}
            </div>
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay - Shows dragged item */}
      <DragOverlay>
        {activeImage && (
          <div className="rotate-3 opacity-80">
            <ImageCard
              image={activeImage}
              index={localImages.findIndex((img) => img.id === activeId)}
              isDragging
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

interface SortableImageCardProps {
  image: GalleryImage & { originalIndex: number }
  index: number
}

function SortableImageCard({ image, index }: SortableImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ImageCard
        image={image}
        index={index}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

interface ImageCardProps {
  image: GalleryImage
  index: number
  isDragging?: boolean
  dragHandleProps?: Record<string, unknown>
}

function ImageCard({ image, index, isDragging = false, dragHandleProps }: ImageCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-(--card-bg) shadow-md transition-all',
        isDragging ? 'scale-105 opacity-50 shadow-2xl' : 'hover:shadow-xl'
      )}
    >
      <OptimizedImage
        src={image.url}
        alt={image.title || `Image ${index + 1}`}
        width={image.width || 800}
        height={image.height || 1000}
        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
        variant="card"
      />

      {/* Drag Handle - Premium Style */}
      {dragHandleProps && (
        <button
          {...dragHandleProps}
          className="absolute top-3 left-3 flex h-10 w-10 cursor-grab items-center justify-center rounded-lg bg-white/95 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white active:scale-95 active:cursor-grabbing"
          title="Arrastrar para reordenar"
        >
          <GripVertical className="h-5 w-5 text-(--primary)" />
        </button>
      )}

      {/* Order Badge - Prominent & Beautiful */}
      <div className="absolute top-3 right-3 flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg bg-(--primary) px-3 font-bold text-white shadow-lg">
        #{index + 1}
      </div>

      {/* Project Title Tag (if applicable) */}
      {image.projectSlug && (
        <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          {image.title}
        </div>
      )}
    </div>
  )
}
