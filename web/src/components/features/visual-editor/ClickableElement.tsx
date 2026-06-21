'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ReactNode, HTMLAttributes } from 'react'
import type { EditableElement } from './types'
import type { ViewportMode } from './types'

// Omit 'id', 'onDrag', 'onDragEnd' from HTMLAttributes to avoid conflict
interface ClickableElementProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'id' | 'onDrag' | 'onDragEnd'
> {
  id: EditableElement
  isSelected: boolean
  onClick: () => void
  children: ReactNode
  /** Optional: enabled when in editor mode. Receives cumulative drag delta in pixels. */
  enableDrag?: boolean
  /** Called when user finishes dragging the element. */
  onDragEnd?: (deltaX: number, deltaY: number) => void
  /** Called continuously while dragging. */
  onElementDrag?: (deltaX: number, deltaY: number) => void
}

/**
 * Wrapper que hace clickeable un elemento y permite arrastrarlo (drag-and-drop)
 * cuando `enableDrag` es true. Solo activo en el editor (no en la web pública).
 *
 * Modelo: el elemento se arrastra con el mouse, se calcula el delta en píxeles
 * y se reporta al padre para que actualice la BD.
 *
 * El padre es responsable de:
 * - Aplicar el clamp (no salirse del Hero)
 * - Calcular el nuevo offset y llamar a la server action
 * - Hacer debounce si es necesario
 */
export function ClickableElement({
  id,
  isSelected,
  onClick,
  children,
  className,
  enableDrag = false,
  onDragEnd,
  onElementDrag,
  ...props
}: ClickableElementProps) {
  const dragStateRef = useRef<{
    startX: number
    startY: number
    lastX: number
    lastY: number
    accumulatedX: number
    accumulatedY: number
    isDragging: boolean
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableDrag) return
    // Only left mouse button
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      accumulatedX: 0,
      accumulatedY: 0,
      isDragging: true,
    }
    setIsDragging(true)

    const handleMouseMove = (ev: MouseEvent) => {
      const state = dragStateRef.current
      if (!state || !state.isDragging) return
      const deltaX = ev.clientX - state.lastX
      const deltaY = ev.clientY - state.lastY
      state.lastX = ev.clientX
      state.lastY = ev.clientY
      state.accumulatedX += deltaX
      state.accumulatedY += deltaY
      onElementDrag?.(state.accumulatedX, state.accumulatedY)
    }

    const handleMouseUp = () => {
      const state = dragStateRef.current
      if (state) {
        state.isDragging = false
        onDragEnd?.(state.accumulatedX, state.accumulatedY)
      }
      dragStateRef.current = null
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      data-element-id={id}
      onClick={(e) => {
        // Don't fire onClick if we just finished a drag
        if (isDragging) return
        e.stopPropagation()
        onClick()
      }}
      onMouseDown={handleMouseDown}
      className={cn(
        'relative transition-all',
        enableDrag && 'cursor-grab',
        enableDrag && isDragging && 'cursor-grabbing',
        isSelected && 'ring-primary ring-offset-background ring-2 ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
      {isSelected && !isDragging && (
        <div className="bg-primary text-primary-foreground absolute -top-8 left-0 rounded px-2 py-1 text-xs">
          Editando
        </div>
      )}
    </div>
  )
}
