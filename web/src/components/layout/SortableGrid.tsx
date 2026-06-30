'use client'

import { ReactNode, useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragCancelEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from '@/components/ui'
import { GripVertical } from 'lucide-react'

interface SortableGridProps<T> {
  items: T[]
  onReorder: (items: T[]) => Promise<void>
  renderItem: (item: T, isDragging: boolean) => ReactNode
  getItemId: (item: T) => string
  columns?: number
  gap?: string
  strategy?: 'grid' | 'vertical'
  disabled?: boolean
}

export default function SortableGrid<T>({
  items,
  onReorder,
  renderItem,
  getItemId,
  columns = 3,
  gap = 'gap-6',
  strategy = 'grid',
  disabled = false,
}: SortableGridProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Local state para reorder en vivo mientras el usuario arrastra.
  // Se sincroniza con `items` solo cuando no hay un drag en curso.
  const [localItems, setLocalItems] = useState<T[]>(items)
  const [isDragging, setIsDragging] = useState(false)

  // Sync diferido: si la prop `items` cambia (ej. server action completa)
  // y no estamos arrastrando, adoptamos el nuevo orden. Durante un drag en
  // curso, NO reseteamos para no perder el reorder en vivo del usuario.
  useEffect(() => {
    if (!isDragging) {
      setLocalItems(items)
    }
  }, [items, isDragging])

  const handleDragStart = (_e: DragStartEvent) => {
    setIsDragging(true)
  }

  // Reorder en vivo: cada vez que la card arrastrada pasa por encima de otra,
  // movemos ambas en el state para que la transición sea visualmente completa
  // (no un "salto" al soltar).
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setLocalItems((prev) => {
      const from = prev.findIndex((item) => getItemId(item) === active.id)
      const to = prev.findIndex((item) => getItemId(item) === over.id)
      if (from === -1 || to === -1 || from === to) return prev
      return arrayMove(prev, from, to)
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false)
    const { active, over } = event
    if (over && active.id !== over.id) {
      // El reorder ya se hizo en vivo — confirmamos con la server action.
      await onReorder(localItems)
    } else {
      // No se movió: resincronizamos con la prop por si acaso.
      setLocalItems(items)
    }
  }

  const handleDragCancel = (_e: DragCancelEvent) => {
    setIsDragging(false)
    setLocalItems(items)
  }

  const gridClass =
    strategy === 'grid'
      ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} ${gap}`
      : `flex flex-col ${gap}`

  return (
    <DndContext
      sensors={disabled ? [] : sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={localItems.map(getItemId)}
        strategy={strategy === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
      >
        <div className={gridClass}>
          {localItems.map((item) => (
            <SortableItem key={getItemId(item)} id={getItemId(item)}>
              {(isDragging) => renderItem(item, isDragging)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

interface SortableItemProps {
  id: string
  children: (isDragging: boolean) => ReactNode
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative">
        {/* Drag Handle — siempre visible (tenue sin hover, pleno en hover) */}
        <button
          {...listeners}
          className="bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground absolute top-2 -left-2 z-10 flex h-8 w-8 cursor-grab items-center justify-center rounded-md opacity-70 shadow-sm transition-opacity hover:opacity-100 active:cursor-grabbing"
          title="Arrastrar para reordenar"
        >
          <GripVertical size={16} />
        </button>

        {/* Item Content */}
        <motion.div
          layout
          initial={{ scale: 1 }}
          whileTap={{ scale: isDragging ? 1.05 : 1 }}
          className="group"
        >
          {children(isDragging)}
        </motion.div>
      </div>
    </div>
  )
}
