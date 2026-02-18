'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, LoadingOverlay } from '@/components/ui'
import DraggableMasonryGallery from './DraggableMasonryGallery'
import { updateCategoryGalleryOrder, resetCategoryGalleryOrder } from '@/actions/gallery-ordering'
import { useConfirmDialog as useConfirm } from '@/components/ui'
import { Save, RotateCcw } from 'lucide-react'
import { showToast } from '@/lib/toast'
import { logger } from '@/lib/logger'

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

  const { confirm, Dialog } = useConfirm()

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
        showToast.success(
          `El orden de la galería de "${categoryName}" ha sido actualizado.`,
          '✅ Orden guardado'
        )
        setHasChanges(false)
        onClose()
      } else {
        showToast.error(result.error || 'No se pudo guardar el orden', '❌ Error')
      }
    } catch (error) {
      logger.error('[GalleryOrderModal] Save error', { error })
      showToast.error('Ocurrió un error al guardar', '❌ Error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    const isConfirmed = await confirm({
      title: '¿Restablecer orden?',
      message:
        '¿Estás seguro de que quieres restablecer el orden a la configuración predeterminada? Esto deshará cualquier orden manual y usará el orden del proyecto.',
      confirmText: 'Sí, restablecer',
      cancelText: 'Cancelar',
      variant: 'danger',
    })

    if (!isConfirmed) return

    setIsSaving(true)

    try {
      const result = await resetCategoryGalleryOrder(categoryId)

      if (result.success) {
        showToast.success('La galería ha vuelto al orden predeterminado', '🔄 Orden restablecido')
        // Reload images from server to get default order
        window.location.reload()
      } else {
        showToast.error(result.error || 'No se pudo restablecer', '❌ Error')
      }
    } catch (error) {
      logger.error('[GalleryOrderModal] Reset error', { error })
      showToast.error('Ocurrió un error al restablecer', '❌ Error')
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

        {/* Confirmation Dialog */}
        <Dialog />
      </div>
    </Modal>
  )
}
