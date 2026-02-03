'use client'

import { ReactNode } from 'react'
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
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => getItemId(item) === active.id)
      const newIndex = items.findIndex((item) => getItemId(item) === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex)
      await onReorder(newItems)
    }
  }

  const gridClass =
    strategy === 'grid'
      ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} ${gap}`
      : `flex flex-col ${gap}`

  return (
    <DndContext
      sensors={disabled ? [] : sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(getItemId)}
        strategy={strategy === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
      >
        <div className={gridClass}>
          {items.map((item) => (
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
        {/* Drag Handle */}
        <button
          {...listeners}
          className="bg-muted text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground absolute top-2 -left-2 z-10 flex h-8 w-8 cursor-grab items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
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
