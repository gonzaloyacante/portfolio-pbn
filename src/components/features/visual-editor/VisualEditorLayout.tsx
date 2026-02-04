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
        <div className="bg-background relative h-[500px] w-full overflow-hidden rounded-lg border">
          {/* Contenedor Escalado: Simula pantalla completa (aprox 1280px width) en espacio reducido */}
          <div className="pointer-events-auto absolute top-0 left-0 h-[200%] w-[200%] origin-top-left scale-[0.5]">
            {preview}
          </div>
        </div>
      </div>

      {/* Panel de Propiedades */}
      <div>{propertyPanel}</div>
    </div>
  )
}
