'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { updateCategoryGalleryOrder, resetCategoryGalleryOrder } from '@/actions/gallery-ordering'
import { Button } from '@/components/ui'
import { OptimizedImage } from '@/components/ui'
import { Save, RotateCcw, GripVertical, Check, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'
import { showToast } from '@/lib/toast'

interface GalleryImage {
  id: string
  url: string
  alt: string
  title: string
  width?: number | null
  height?: number | null
  categoryGalleryOrder?: number | null
}

interface CategoryGalleryEditorProps {
  categoryId: string
  categoryName: string
  initialImages: GalleryImage[]
}

// ── Sortable image card ─────────────────────────────────────────────────────
function SortableImageCard({ image, index }: { image: GalleryImage; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
  }

  const aspectRatio = image.height && image.width ? image.height / image.width : 1.5

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.4) }}
      className={cn(
        'group bg-muted relative overflow-hidden rounded-2xl shadow-sm transition-shadow',
        isDragging ? 'shadow-none' : 'hover:shadow-lg'
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-grab rounded-lg bg-black/50 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label={`Mover ${image.title}`}
      >
        <GripVertical size={14} className="text-white" />
      </div>

      {/* Position badge */}
      <div className="absolute top-2 right-2 z-10 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        #{index + 1}
      </div>

      {/* Image */}
      <div className="relative w-full" style={{ paddingBottom: `${aspectRatio * 100}%` }}>
        <OptimizedImage
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Title hover overlay */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
        <p className="truncate text-xs font-medium text-white">{image.title}</p>
      </div>
    </motion.div>
  )
}

// ── Drag overlay card ───────────────────────────────────────────────────────
function DragOverlayCard({ image }: { image: GalleryImage }) {
  const aspectRatio = image.height && image.width ? image.height / image.width : 1.5
  return (
    <div className="ring-primary w-48 overflow-hidden rounded-2xl shadow-2xl ring-2">
      <div className="bg-muted relative w-full" style={{ paddingBottom: `${aspectRatio * 100}%` }}>
        <OptimizedImage
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="192px"
        />
      </div>
    </div>
  )
}

// ── Main editor ─────────────────────────────────────────────────────────────
export default function CategoryGalleryEditor({
  categoryId,
  categoryName,
  initialImages,
}: CategoryGalleryEditorProps) {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1280) setColumns(4)
      else if (window.innerWidth >= 1024) setColumns(3)
      else setColumns(2)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // ── Masonry distribution ──────────────────────────────────────────────────
  const columnsData = Array.from({ length: columns }, () => ({
    images: [] as (GalleryImage & { flatIndex: number })[],
    height: 0,
  }))

  images.forEach((img, idx) => {
    const ar = img.height && img.width ? img.height / img.width : 1.5
    let minCol = 0
    columnsData.forEach((col, i) => {
      if (col.height < columnsData[minCol].height) minCol = i
    })
    columnsData[minCol].images.push({ ...img, flatIndex: idx })
    columnsData[minCol].height += ar
  })

  // ── DnD handlers ─────────────────────────────────────────────────────────
  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string)

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveId(null)
    if (!over || active.id === over.id) return
    setImages((prev) => {
      const from = prev.findIndex((img) => img.id === active.id)
      const to = prev.findIndex((img) => img.id === over.id)
      return arrayMove(prev, from, to)
    })
    setIsDirty(true)
  }

  // ── Save / Reset ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const imageOrders = images.map((img, idx) => ({ imageId: img.id, order: idx }))
      const result = await updateCategoryGalleryOrder({ categoryId, imageOrders })
      if (result.success) {
        showToast.success('Orden de galería guardado')
        setIsDirty(false)
      } else {
        showToast.error(result.error ?? 'Error al guardar')
      }
    } catch {
      showToast.error('Error inesperado al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    try {
      const result = await resetCategoryGalleryOrder(categoryId)
      if (result.success) {
        showToast.success('Orden restablecido al original')
        setIsDirty(false)
        router.refresh()
      } else {
        showToast.error(result.error ?? 'Error al restablecer')
      }
    } catch {
      showToast.error('Error inesperado al restablecer')
    } finally {
      setIsResetting(false)
    }
  }

  const activeImage = activeId ? images.find((img) => img.id === activeId) : null

  // ── Empty state ───────────────────────────────────────────────────────────
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="mb-4 text-6xl">🖼️</span>
        <h3 className="text-foreground mb-2 text-2xl font-bold">Sin imágenes</h3>
        <p className="text-muted-foreground">Esta categoría no tiene imágenes en sus proyectos.</p>
        <Link href={ROUTES.admin.categories} className="mt-6">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} />
            Volver a Categorías
          </Button>
        </Link>
      </div>
    )
  }

  // ── Column class map ──────────────────────────────────────────────────────
  const colClass = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <div className="space-y-6">
      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.admin.categories}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={16} />
              Categorías
            </Button>
          </Link>
          <div>
            <h1 className="text-foreground text-2xl font-bold">{categoryName}</h1>
            <p className="text-muted-foreground text-sm">
              {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} · Arrastra para
              reordenar como en la web pública
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium text-amber-500"
            >
              Sin guardar
            </motion.span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isResetting || isSaving}
            className="gap-2"
          >
            <RotateCcw size={14} className={cn(isResetting && 'animate-spin')} />
            Restablecer
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!isDirty || isSaving} className="gap-2">
            {isSaving ? (
              <RotateCcw size={14} className="animate-spin" />
            ) : isDirty ? (
              <Save size={14} />
            ) : (
              <Check size={14} />
            )}
            {isSaving ? 'Guardando…' : 'Guardar Orden'}
          </Button>
        </div>
      </div>

      {/* ── Tip ── */}
      <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-3 text-sm">
        💡 Este orden es el que verán los visitantes en la galería pública. Arrastra las imágenes
        para cambiar su posición. El orden de columnas replica exactamente la web pública.
      </p>

      {/* ── Gallery DnD ── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images.map((img) => img.id)}>
          <div className={cn('grid gap-4', colClass)}>
            {columnsData.map((col, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-4">
                {col.images.map((img) => (
                  <SortableImageCard key={img.id} image={img} index={img.flatIndex} />
                ))}
              </div>
            ))}
          </div>
        </SortableContext>

        <DragOverlay
          dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}
        >
          {activeImage ? <DragOverlayCard image={activeImage} /> : null}
        </DragOverlay>
      </DndContext>

      {/* ── Sticky bottom save bar ── */}
      <AnimatePresenceWrapper show={isDirty}>
        <div className="sticky bottom-6 flex justify-center">
          <div className="bg-card border-border flex items-center gap-4 rounded-2xl border px-6 py-3 shadow-2xl">
            <p className="text-foreground text-sm font-medium">¿Guardar el nuevo orden?</p>
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? <RotateCcw size={14} className="animate-spin" /> : <Save size={14} />}
              {isSaving ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </div>
      </AnimatePresenceWrapper>
    </div>
  )
}

// Small helper to animate mount/unmount
function AnimatePresenceWrapper({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}
