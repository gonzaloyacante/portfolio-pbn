'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, LoadingOverlay } from '@/components/ui'
import DraggableMasonryGallery from './DraggableMasonryGallery'
import { updateCategoryGalleryOrder, resetCategoryGalleryOrder } from '@/actions/gallery-ordering'
import { useToast } from '@/components/ui'
import { Save, RotateCcw } from 'lucide-react'

interface GalleryImage {
  id: string
  url: string
  width?: number | null
  height?: number | null
  title?: string
  projectSlug?: string
}

interface GalleryOrderModalProps {
  isOpen: boolean
  onClose: () => void
  categoryId: string
  categoryName: string
  images: GalleryImage[]
}

export default function GalleryOrderModal({
  isOpen,
  onClose,
  categoryId,
  categoryName,
  images: initialImages,
}: GalleryOrderModalProps) {
  const [images, setImages] = useState(initialImages)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { show } = useToast()

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setImages(initialImages)
      setHasChanges(false)
    }
  }, [isOpen, initialImages])

  const handleReorder = (newImages: GalleryImage[]) => {
    setImages(newImages)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const imageOrders = images.map((img, idx) => ({
        imageId: img.id,
        order: idx,
      }))

      const result = await updateCategoryGalleryOrder({
        categoryId,
        imageOrders,
      })

      if (result.success) {
        show({
          type: 'success',
          title: '✅ Orden guardado',
          message: `El orden de la galería de "${categoryName}" ha sido actualizado.`,
        })
        setHasChanges(false)
        onClose()
      } else {
        show({
          type: 'error',
          title: '❌ Error',
          message: result.error || 'No se pudo guardar el orden',
        })
      }
    } catch (error) {
      console.error('[GalleryOrderModal] Save error:', error)
      show({
        type: 'error',
        title: '❌ Error',
        message: 'Ocurrió un error al guardar',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (
      !confirm(
        '¿Estás seguro de que quieres restablecer el orden a la configuración predeterminada?'
      )
    ) {
      return
    }

    setIsSaving(true)

    try {
      const result = await resetCategoryGalleryOrder(categoryId)

      if (result.success) {
        show({
          type: 'success',
          title: '🔄 Orden restablecido',
          message: 'La galería ha vuelto al orden predeterminado',
        })
        // Reload images from server to get default order
        window.location.reload()
      } else {
        show({
          type: 'error',
          title: '❌ Error',
          message: result.error || 'No se pudo restablecer',
        })
      }
    } catch (error) {
      console.error('[GalleryOrderModal] Reset error:', error)
      show({
        type: 'error',
        title: '❌ Error',
        message: 'Ocurrió un error al restablecer',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ordenar Galería: ${categoryName}`}
      size="xl"
      showCloseButton={true}
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="rounded-lg bg-[var(--accent)]/10 p-4">
          <p className="text-sm text-[var(--foreground)]/80">
            <strong>Instrucciones:</strong> Arrastra y suelta las imágenes para cambiar su orden en
            la galería pública. Los números indican la posición actual. Los cambios se guardarán al
            hacer clic en Guardar Orden.
          </p>
        </div>

        {/* Gallery */}
        <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-[var(--foreground)]/10 p-4">
          <DraggableMasonryGallery images={images} onReorder={handleReorder} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 border-t border-[var(--foreground)]/10 pt-4">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restablecer
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar Orden'}
            </Button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isSaving && <LoadingOverlay show={isSaving} message="Guardando orden..." />}
      </div>
    </Modal>
  )
}
