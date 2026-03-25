'use client'

import { ReactNode, useRef, useState, useEffect } from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewportMode } from './types'

const VIEWPORT_CONFIGS = {
  desktop: { width: 1280, height: 900, label: 'Escritorio' },
  tablet: { width: 768, height: 1024, label: 'Tablet' },
  mobile: { width: 375, height: 812, label: 'Móvil' },
} as const

const VIEWPORT_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} as const

interface VisualEditorLayoutProps {
  preview: ReactNode
  propertyPanel: ReactNode
  viewportMode: ViewportMode
  onViewportChange: (mode: ViewportMode) => void
}

/**
 * Layout principal del Visual Editor: Preview arriba con toggle de viewport, Panel de propiedades abajo
 */
export function VisualEditorLayout({
  preview,
  propertyPanel,
  viewportMode,
  onViewportChange,
}: VisualEditorLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(640)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setContainerWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const vp = VIEWPORT_CONFIGS[viewportMode]
  const scaleToFit = containerWidth / vp.width
  const effectiveScale = Math.min(scaleToFit, 1.0)
  const scaledHeight = vp.height * effectiveScale
  const displayHeight = Math.min(scaledHeight, 650)
  const leftOffset = (containerWidth - vp.width * effectiveScale) / 2

  return (
    <div className="flex flex-col gap-6">
      {/* Vista Previa */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-muted-foreground text-sm font-semibold">Vista Previa</h2>

          {/* Viewport Toggle */}
          <div className="flex items-center gap-1 rounded-lg border p-1">
            {(Object.keys(VIEWPORT_CONFIGS) as ViewportMode[]).map((mode) => {
              const Icon = VIEWPORT_ICONS[mode]
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onViewportChange(mode)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                    viewportMode === mode
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  title={VIEWPORT_CONFIGS[mode].label}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{VIEWPORT_CONFIGS[mode].label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          ref={containerRef}
          className="bg-background relative w-full overflow-hidden rounded-lg border"
          style={{ height: `${displayHeight}px` }}
        >
          <div
            className="pointer-events-auto absolute top-0"
            style={{
              width: `${vp.width}px`,
              height: `${vp.height}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              left: `${leftOffset}px`,
            }}
          >
            {preview}
          </div>
        </div>

        <p className="text-muted-foreground mt-2 text-center text-xs">
          {vp.label} — {vp.width}×{vp.height}px ({Math.round(effectiveScale * 100)}%)
        </p>
      </div>

      {/* Panel de Propiedades */}
      <div>{propertyPanel}</div>
    </div>
  )
}
