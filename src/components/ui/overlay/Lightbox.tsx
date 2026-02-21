'use client'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight } from 'lucide-react'
import { OptimizedImage } from '@/components/ui'

// ---------- Types ----------

export interface LightboxImage {
  id: string
  url: string
  alt: string
  title?: string
  width?: number | null
  height?: number | null
}

interface LightboxProps {
  images: LightboxImage[]
  selectedIndex: number | null
  onClose: () => void
  onIndexChange?: (index: number) => void
}

// ---------- Constants ----------

const MIN_ZOOM = 1
const MAX_ZOOM = 5
const ZOOM_STEP = 0.5
const SWIPE_THRESHOLD = 50
const DRAG_THRESHOLD = 5

// ---------- Slide variants ----------

const EASE_CURVE = [0.25, 0.46, 0.45, 0.94] as const

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: EASE_CURVE },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: EASE_CURVE },
  }),
}

// ---------- Component ----------

export function Lightbox({ images, selectedIndex, onClose, onIndexChange }: LightboxProps) {
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [direction, setDirection] = useState(0)

  // Drag state
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panStart = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)

  // Swipe state
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  // Focus
  const closeRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isOpen = selectedIndex !== null
  const currentImage = isOpen ? images[selectedIndex] : null

  // ---------- Helpers ----------

  const resetTransform = useCallback(() => {
    setZoom(MIN_ZOOM)
    setPan({ x: 0, y: 0 })
  }, [])

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir)
      resetTransform()
      onIndexChange?.(index)
    },
    [onIndexChange, resetTransform]
  )

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return
    goTo(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1, -1)
  }, [selectedIndex, images.length, goTo])

  const goNext = useCallback(() => {
    if (selectedIndex === null) return
    goTo(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1, 1)
  }, [selectedIndex, images.length, goTo])

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(z - ZOOM_STEP, MIN_ZOOM)
      if (next <= MIN_ZOOM) setPan({ x: 0, y: 0 })
      return next
    })
  }, [])

  const fitToScreen = useCallback(() => {
    resetTransform()
  }, [resetTransform])

  // ---------- Scroll lock ----------

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      closeRef.current?.focus()
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [isOpen])

  // ---------- Keyboard ----------

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goPrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          goNext()
          break
        case '+':
        case '=':
          e.preventDefault()
          zoomIn()
          break
        case '-':
          e.preventDefault()
          zoomOut()
          break
        case '0':
          e.preventDefault()
          fitToScreen()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, goPrev, goNext, zoomIn, zoomOut, fitToScreen, onClose])

  // ---------- Wheel zoom ----------

  const handleWheel = useCallback(
    (e: ReactWheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.deltaY < 0) zoomIn()
      else zoomOut()
    },
    [zoomIn, zoomOut]
  )

  // ---------- Pointer drag (pan when zoomed) ----------

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (zoom <= MIN_ZOOM) return
      isDragging.current = true
      hasMoved.current = false
      dragStart.current = { x: e.clientX, y: e.clientY }
      panStart.current = { ...pan }
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    },
    [zoom, pan]
  )

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        hasMoved.current = true
      }
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy })
    },
    []
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // ---------- Touch swipe (navigate when not zoomed) ----------

  const handleTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      if (zoom > MIN_ZOOM) return
      const touch = e.touches[0]
      touchStart.current = { x: touch.clientX, y: touch.clientY }
    },
    [zoom]
  )

  const handleTouchEnd = useCallback(
    (e: ReactTouchEvent) => {
      if (!touchStart.current || zoom > MIN_ZOOM) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStart.current.x
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx > 0) goPrev()
        else goNext()
      }
      touchStart.current = null
    },
    [zoom, goPrev, goNext]
  )

  // ---------- Double-tap / double-click zoom ----------

  const lastTap = useRef(0)
  const handleDoubleAction = useCallback(() => {
    if (zoom > MIN_ZOOM) {
      resetTransform()
    } else {
      setZoom(2.5)
    }
  }, [zoom, resetTransform])

  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (hasMoved.current) return // was a drag, not a click

      const now = Date.now()
      if (now - lastTap.current < 300) {
        handleDoubleAction()
        lastTap.current = 0
      } else {
        lastTap.current = now
        // Single-click toggle zoom 1x ↔ 2x  
        if (zoom > MIN_ZOOM) resetTransform()
        else setZoom(2)
      }
    },
    [zoom, handleDoubleAction, resetTransform]
  )

  // ---------- Render ----------

  if (!isOpen || !currentImage) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Imagen: ${currentImage.title ?? currentImage.alt}`}
        className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
        onClick={onClose}
        ref={containerRef}
      >
        {/* ───── Top Bar ───── */}
        <div className="relative z-50 flex items-center justify-between px-4 py-3">
          {/* Info */}
          <div className="min-w-0 flex-1">
            {currentImage.title && (
              <h3 className="truncate text-lg font-bold text-white">{currentImage.title}</h3>
            )}
            <p className="text-sm text-white/60">
              {selectedIndex + 1} / {images.length}
            </p>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                zoomOut()
              }}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Alejar"
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              <ZoomOut size={20} />
            </button>
            <span className="min-w-[3ch] text-center text-xs text-white/60">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                zoomIn()
              }}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Acercar"
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                fitToScreen()
              }}
              aria-label="Ajustar a pantalla"
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10"
            >
              <Maximize size={20} />
            </button>
            <button
              ref={closeRef}
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              aria-label="Cerrar"
              className="ml-2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ───── Navigation arrows ───── */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              aria-label="Imagen anterior"
              className="absolute top-1/2 left-2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:left-4 sm:p-4"
            >
              <ChevronLeft size={24} className="sm:h-8 sm:w-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              aria-label="Imagen siguiente"
              className="absolute top-1/2 right-2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:right-4 sm:p-4"
            >
              <ChevronRight size={24} className="sm:h-8 sm:w-8" />
            </button>
          </>
        )}

        {/* ───── Image area ───── */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleImageClick}
          style={{ cursor: zoom > MIN_ZOOM ? 'grab' : 'zoom-in', touchAction: 'none' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={selectedIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: isDragging.current ? 'none' : 'transform 0.2s ease-out',
              }}
            >
              <OptimizedImage
                src={currentImage.url}
                alt={currentImage.alt}
                width={currentImage.width ?? 1600}
                height={currentImage.height ?? 1200}
                className="max-h-[calc(100dvh-100px)] w-auto select-none rounded-lg object-contain shadow-2xl"
                priority
                variant="full"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ───── Bottom hints ───── */}
        <div className="z-50 flex items-center justify-center gap-4 py-3 text-xs text-white/50">
          <span>Scroll/Pinch = Zoom</span>
          <span>·</span>
          <span>Click = Ampliar</span>
          {zoom > MIN_ZOOM && (
            <>
              <span>·</span>
              <span>Arrastra para mover</span>
            </>
          )}
          {images.length > 1 && (
            <>
              <span>·</span>
              <span className="hidden sm:inline">← → = Navegar</span>
              <span className="sm:hidden">Desliza = Navegar</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
