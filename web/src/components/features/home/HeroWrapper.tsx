'use client'

import { ClickableElement } from '../visual-editor/ClickableElement'
import { WrapperProps } from './heroTypes'

export function HeroWrapper({
  children,
  id,
  isEditor,
  selectedElement,
  onSelectElement,
  className,
  style,
}: WrapperProps) {
  if (isEditor && id) {
    return (
      <ClickableElement
        id={id}
        isSelected={selectedElement === id}
        onClick={() => onSelectElement?.(id)}
        className={className}
        style={style}
      >
        {children}
      </ClickableElement>
    )
  }
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
