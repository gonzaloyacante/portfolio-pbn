'use client'

import { useState } from 'react'
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
import { SortableContext, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import {
  updateCategoryGalleryOrder,
  resetCategoryGalleryOrder,
  toggleCategoryImageFeatured,
} from '@/actions/gallery-ordering'
import { saveGalleryImages, deleteCategoryImage } from '@/actions/cms/content'
import { AnimatePresence, Button, ConfirmDialog } from '@/components/ui'
import { Save, RotateCcw, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'
import { showToast } from '@/lib/toast'
import { SortableImageCard, DragOverlayCard, AnimatePresenceWrapper } from './CategoryGalleryCards'
import { CategoryGalleryToolbar } from './CategoryGalleryToolbar'
import { useMasonryColumns } from './useMasonryColumns'
import type { GalleryImage } from './types'

interface CategoryGalleryEditorProps {
  categoryId: string
  categoryName: string
  initialImages: GalleryImage[]
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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const { columnsData, colClass } = useMasonryColumns(images, 3)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

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

  // ── Featured toggle ───────────────────────────────────────────────────────
  const handleToggleFeatured = async (imageId: string, val: boolean) => {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, isFeatured: val } : img)))
    const result = await toggleCategoryImageFeatured(imageId, val)
    if (!result.success) {
      setImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, isFeatured: !val } : img))
      )
      showToast.error('Error al actualizar la imagen destacada')
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteRequest = (imageId: string) => {
    setPendingDeleteId(imageId)
  }

  const handleDeleteConfirm = async () => {
    const imageId = pendingDeleteId
    if (!imageId) return
    setPendingDeleteId(null)
    setDeletingId(imageId)

    // Optimistic: removemos del state local para disparar la animación de exit
    const removed = images.find((img) => img.id === imageId) ?? null
    setImages((prev) => prev.filter((img) => img.id !== imageId))

    try {
      const result = await deleteCategoryImage(imageId)
      if (result.success) {
        showToast.success('Imagen eliminada de la galería')
      } else {
        // Revertimos el optimistic update
        if (removed) {
          setImages((prev) => {
            const exists = prev.some((img) => img.id === removed.id)
            return exists ? prev : [...prev, removed]
          })
        }
        showToast.error(result.error ?? 'Error al eliminar la imagen')
      }
    } catch {
      if (removed) {
        setImages((prev) => {
          const exists = prev.some((img) => img.id === removed.id)
          return exists ? prev : [...prev, removed]
        })
      }
      showToast.error('Error inesperado al eliminar la imagen')
    } finally {
      setDeletingId(null)
    }
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

  const handleUpload = async (
    urls: string[],
    publicIds: string[],
    widths: Array<number | undefined> = [],
    heights: Array<number | undefined> = []
  ) => {
    if (!urls || urls.length === 0) return
    try {
      const payload = urls.map((u, i) => ({
        url: u,
        publicId: publicIds[i],
        width: widths[i],
        height: heights[i],
      }))
      const result = await saveGalleryImages(categoryId, payload)
      if (result.success) {
        showToast.success('Imágenes agregadas a la galería')
        router.refresh()
      } else {
        showToast.error(result.error ?? 'Error al agregar imágenes')
      }
    } catch {
      showToast.error('Error al agregar imágenes a la galería')
    }
  }

  const pendingImage = pendingDeleteId ? images.find((img) => img.id === pendingDeleteId) : null

  return (
    <div className="space-y-6">
      <CategoryGalleryToolbar
        categoryName={categoryName}
        imageCount={images.length}
        isDirty={isDirty}
        isSaving={isSaving}
        isResetting={isResetting}
        onSave={handleSave}
        onReset={handleReset}
        onUploadComplete={handleUpload}
      />

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="mb-4 text-6xl">🖼️</span>
          <h3 className="text-foreground mb-2 text-2xl font-bold">Sin imágenes</h3>
          <p className="text-muted-foreground">Esta categoría no tiene imágenes en la galería.</p>
          <Button asChild variant="outline" className="mt-6 gap-2">
            <Link href={ROUTES.admin.categories}>
              <ArrowLeft size={16} />
              Volver a Categorías
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-3 text-sm">
            💡 Este orden es el que verán los visitantes en la galería pública. Arrastra las
            imágenes para cambiar su posición. Usa la estrella para destacar y la papelera para
            eliminar. El orden de columnas replica exactamente la web pública.
          </p>

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
                    <AnimatePresence mode="popLayout" initial={false}>
                      {col.items.map((img) => (
                        <SortableImageCard
                          key={img.id}
                          image={img}
                          index={img.flatIndex}
                          onToggleFeatured={handleToggleFeatured}
                          onDelete={handleDeleteRequest}
                          isDeleting={deletingId === img.id}
                        />
                      ))}
                    </AnimatePresence>
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
        </>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="¿Eliminar imagen de la galería?"
        message={
          pendingImage
            ? `Se eliminará "${pendingImage.title}" de la galería de la categoría. La imagen también se borrará de Cloudinary. Esta acción no se puede deshacer.`
            : 'Se eliminará la imagen de la galería. Esta acción no se puede deshacer.'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
