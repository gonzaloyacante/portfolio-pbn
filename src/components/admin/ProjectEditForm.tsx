'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category, Project, ProjectImage } from '@prisma/client'
import { updateProject, deleteProjectImage, reorderProjectImages } from '@/actions/content.actions'
import { setProjectThumbnail } from '@/actions/project.actions'
import { Button, Input, TextArea } from '@/components/ui'
import { useToast } from '@/components/ui'
import SortableImageGrid from './SortableImageGrid'

type ProjectWithRelations = Project & {
  category: Category
  images: ProjectImage[]
}

interface ProjectEditFormProps {
  project: ProjectWithRelations
  categories: Category[]
}

export default function ProjectEditForm({ project, categories }: ProjectEditFormProps) {
  const router = useRouter()
  const { show } = useToast()

  // State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentThumbnail, setCurrentThumbnail] = useState(project.thumbnailUrl)

  // Actions
  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await updateProject(project.id, formData)
      if (result.success) {
        show({ type: 'success', message: 'Proyecto actualizado correctamente' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al actualizar' })
      }
    } catch {
      show({ type: 'error', message: 'Error inesperado' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReorderImages = async (imageIds: string[]) => {
    const reorderedItems = imageIds.map((id, index) => ({ id, order: index }))
    try {
      await reorderProjectImages(project.id, reorderedItems)
      show({ type: 'success', message: 'Orden de imágenes actualizado' })
    } catch {
      show({ type: 'error', message: 'Error al reordenar imágenes' })
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const result = await deleteProjectImage(imageId)
      if (result.success) {
        show({ type: 'success', message: 'Imagen eliminada correctly' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al eliminar imagen' })
      }
    } catch {
      show({ type: 'error', message: 'Error al eliminar imagen' })
    }
  }

  const handleSetThumbnail = async (imageUrl: string) => {
    // Optimistic update
    const prevThumbnail = currentThumbnail
    setCurrentThumbnail(imageUrl)

    try {
      const result = await setProjectThumbnail(project.id, imageUrl)
      if (result.success) {
        show({ type: 'success', message: 'Portada actualizada' })
        router.refresh()
      } else {
        setCurrentThumbnail(prevThumbnail) // Revert
        show({ type: 'error', message: result.error || 'Error al cambiar portada' })
      }
    } catch {
      setCurrentThumbnail(prevThumbnail) // Revert
      show({ type: 'error', message: 'Error al cambiar portada' })
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Información Básica */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input label="Título" name="title" defaultValue={project.title} required />
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Categoría
          </label>
          <select
            name="categoryId"
            defaultValue={project.categoryId}
            className="w-full rounded-lg border bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TextArea
        label="Descripción"
        name="description"
        defaultValue={project.description || ''}
        rows={4}
      />

      <Input
        label="Fecha"
        name="date"
        type="date"
        defaultValue={project.date ? new Date(project.date).toISOString().split('T')[0] : ''}
      />

      {/* Gestión de Imágenes */}
      <div className="border-border bg-card space-y-6 rounded-xl border p-6">
        <SortableImageGrid
          images={project.images}
          currentThumbnail={currentThumbnail}
          onReorder={handleReorderImages}
          onDelete={handleDeleteImage}
          onSetThumbnail={handleSetThumbnail}
        />

        {/* Subir nuevas imágenes */}
        <div className="hover:bg-muted/50 rounded-xl border border-dashed border-[var(--primary)] p-6 transition-colors">
          <label className="text-foreground mb-2 block text-sm font-medium">
            📷 Agregar más fotos
          </label>
          <input
            type="file"
            name="newImages"
            multiple
            accept="image/*"
            className="w-full text-sm text-[var(--foreground)] file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--primary-foreground)] file:transition-opacity hover:file:opacity-90"
          />
          <p className="text-muted-foreground mt-2 text-xs">
            Selecciona múltiples archivos para agregar a la galería.
          </p>
        </div>
      </div>

      <div className="border-border flex justify-end gap-4 border-t pt-6">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting} size="lg">
          Guardar Cambios
        </Button>
      </div>
    </form>
  )
}
