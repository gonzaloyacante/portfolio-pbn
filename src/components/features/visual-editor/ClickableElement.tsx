'use client'

import { cn } from '@/lib/utils'
import { ReactNode, HTMLAttributes } from 'react'
import type { EditableElement } from './types'

// Omit 'id' from HTMLAttributes to avoid conflict with EditableElement
interface ClickableElementProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: EditableElement
  isSelected: boolean
  onClick: () => void
  children: ReactNode
}

/**
 * Wrapper que hace clickeable un elemento y lo marca visualmente cuando está seleccionado
 */
export function ClickableElement({
  id,
  isSelected,
  onClick,
  children,
  className,
  ...props
}: ClickableElementProps) {
  return (
    <div
      data-element-id={id}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-primary ring-offset-background ring-2 ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
      {isSelected && (
        <div className="bg-primary text-primary-foreground absolute -top-8 left-0 rounded px-2 py-1 text-xs">
          Editando
        </div>
      )}
    </div>
  )
}
