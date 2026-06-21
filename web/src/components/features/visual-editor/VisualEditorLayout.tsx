'use client'

import { ReactNode, useRef, useState, useEffect } from 'react'
import { Monitor, Tablet, Smartphone, RectangleHorizontal, RectangleVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewportMode, Orientation } from './types'

const VIEWPORT_CONFIGS = {
  desktop: { label: 'Escritorio' },
  tablet: { label: 'Tablet' },
  mobile: { label: 'Móvil' },
} as const

const VIEWPORT_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} as const

// Todas las dimensiones usan 1920x1080 como base. El toggle de orientación
// intercambia ancho/alto para tablet y móvil (horizontal/vertical). El escritorio
// siempre permanece en horizontal 1920x1080 y el toggle se muestra deshabilitado.
function getViewportDimensions(
  mode: ViewportMode,
  orientation: Orientation
): { width: number; height: number } {
  if (mode === 'desktop') {
    return { width: 1920, height: 1080 }
  }
  return orientation === 'landscape' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 }
}

interface VisualEditorLayoutProps {
  preview: ReactNode
  propertyPanel: ReactNode
  viewportMode: ViewportMode
  onViewportChange: (mode: ViewportMode) => void
  orientation: Orientation
  onOrientationChange: (orientation: Orientation) => void
  onPreviewBackgroundClick?: () => void
  /** Botón opcional que se renderiza a la derecha del título "Vista Previa". */
  headerAction?: ReactNode
}

/**
 * Layout principal del Visual Editor: Preview arriba con toggle de viewport, Panel de propiedades abajo
 */
export function VisualEditorLayout({
  preview,
  propertyPanel,
  viewportMode,
  onViewportChange,
  orientation,
  onOrientationChange,
  onPreviewBackgroundClick,
  headerAction,
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

  const dimensions = getViewportDimensions(viewportMode, orientation)
  const vp = { ...VIEWPORT_CONFIGS[viewportMode], ...dimensions }
  // Alto fijo compartido a las 3 vistas. El container del preview siempre mide
  // lo mismo, y el contenido (escalado) llena lo más posible sin salirse.
  const PREVIEW_HEIGHT = 600
  // Escalar para que el contenido quepa en el container (ancho Y alto).
  const scaleToFit = Math.min(containerWidth / vp.width, PREVIEW_HEIGHT / vp.height)
  const effectiveScale = Math.min(scaleToFit, 1.0)
  const scaledHeight = vp.height * effectiveScale
  const scaledWidth = vp.width * effectiveScale
  const displayHeight = PREVIEW_HEIGHT
  const leftOffset = (containerWidth - scaledWidth) / 2
  const topOffset = (displayHeight - scaledHeight) / 2
  const isOrientationDisabled = viewportMode !== 'tablet'

  return (
    <div className="flex flex-col gap-6">
      {/* Vista Previa */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-muted-foreground text-sm font-semibold">Vista Previa</h2>
            {headerAction}
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            {/* Orientation Toggle */}
            <div className="flex items-center gap-1 rounded-lg border p-1">
              <button
                type="button"
                disabled={isOrientationDisabled}
                onClick={() => onOrientationChange('landscape')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  orientation === 'landscape'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isOrientationDisabled &&
                    'hover:text-muted-foreground cursor-not-allowed opacity-50 hover:bg-transparent'
                )}
                title="Horizontal"
              >
                <RectangleHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Horizontal</span>
              </button>
              <button
                type="button"
                disabled={isOrientationDisabled}
                onClick={() => onOrientationChange('portrait')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  orientation === 'portrait'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isOrientationDisabled &&
                    'hover:text-muted-foreground cursor-not-allowed opacity-50 hover:bg-transparent'
                )}
                title="Vertical"
              >
                <RectangleVertical className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Vertical</span>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="bg-background relative w-full overflow-auto rounded-lg border"
          style={{ height: `${displayHeight}px` }}
          onClick={(e) => {
            // Deselecciona solo si el click NO está sobre (o dentro de) un item hero.
            // ClickableElement usa data-element-id y stopPropagation en sus items.
            if (e.target instanceof Element && !e.target.closest('[data-element-id]')) {
              onPreviewBackgroundClick?.()
            }
          }}
        >
          <div
            className="pointer-events-auto absolute flex"
            style={{
              width: `${vp.width}px`,
              height: `${vp.height}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              left: `${leftOffset}px`,
              top: `${topOffset}px`,
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
