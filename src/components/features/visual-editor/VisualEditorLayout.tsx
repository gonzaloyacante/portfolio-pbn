'use client'

import { ReactNode } from 'react'

interface VisualEditorLayoutProps {
  preview: ReactNode
  propertyPanel: ReactNode
}

/**
 * Layout principal del Visual Editor: Preview arriba, Panel de propiedades abajo
 */
export function VisualEditorLayout({ preview, propertyPanel }: VisualEditorLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Vista Previa */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-muted-foreground text-sm font-semibold">Vista Previa</h2>
          <span className="text-muted-foreground text-xs">
            Haz clic en cualquier elemento para editarlo
          </span>
        </div>
        <div className="bg-background overflow-hidden rounded-lg border">{preview}</div>
      </div>

      {/* Panel de Propiedades */}
      <div>{propertyPanel}</div>
    </div>
  )
}
