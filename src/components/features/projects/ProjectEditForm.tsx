'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category, Project, ProjectImage } from '@prisma/client'
import { updateProject, deleteProjectImage, reorderProjectImages } from '@/actions/cms/content'
import { setProjectThumbnail } from '@/actions/cms/project'
import { Button, Input, TextArea } from '@/components/ui'
import { useToast } from '@/components/ui'
import SortableImageGrid from '@/components/ui/media/SortableImageGrid'

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
  const [activeTab, setActiveTab] = useState('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentThumbnail, setCurrentThumbnail] = useState(project.thumbnailUrl)

  // Actions
  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      // Append checkboxes manual handling if needed, but 'on' is standard
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
    const prevThumbnail = currentThumbnail
    setCurrentThumbnail(imageUrl)

    try {
      const result = await setProjectThumbnail(project.id, imageUrl)
      if (result.success) {
        show({ type: 'success', message: 'Portada actualizada' })
        router.refresh()
      } else {
        setCurrentThumbnail(prevThumbnail)
        show({ type: 'error', message: result.error || 'Error al cambiar portada' })
      }
    } catch {
      setCurrentThumbnail(prevThumbnail)
      show({ type: 'error', message: 'Error al cambiar portada' })
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'details', label: 'Detalles' },
    { id: 'seo', label: 'SEO' },
    { id: 'config', label: 'Config' },
    { id: 'media', label: 'Galería' },
  ]

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Tabs Navigation */}
      <div className="overflow-x-auto border-b border-[var(--border)]">
        <div className="flex min-w-max gap-4 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--primary)] text-[var(--foreground)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- TAB: GENERAL --- */}
      <div className={activeTab === 'general' ? 'block space-y-6' : 'hidden'}>
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
          placeholder="Descripción completa del proyecto..."
        />
        <Input
          label="Fecha"
          name="date"
          type="date"
          defaultValue={project.date ? new Date(project.date).toISOString().split('T')[0] : ''}
        />
      </div>

      {/* --- TAB: DETAILS (New Fields) --- */}
      <div className={activeTab === 'details' ? 'block space-y-6' : 'hidden'}>
        <TextArea
          label="Extracto (Resumen corto)"
          name="excerpt"
          defaultValue={project.excerpt || ''}
          rows={2}
          placeholder="Breve resumen para tarjetas..."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Cliente"
            name="client"
            defaultValue={project.client || ''}
            placeholder="Nombre del cliente"
          />
          <Input
            label="Ubicación"
            name="location"
            defaultValue={project.location || ''}
            placeholder="Ej: Buenos Aires"
          />
          <Input
            label="Duración"
            name="duration"
            defaultValue={project.duration || ''}
            placeholder="Ej: 2 semanas"
          />
          <Input
            label="Video URL (YouTube/Vimeo)"
            name="videoUrl"
            defaultValue={project.videoUrl || ''}
            placeholder="https://..."
          />
        </div>
        <Input
          label="Etiquetas (separadas por coma)"
          name="tags"
          defaultValue={project.tags?.join(', ') || ''}
          placeholder="boda, exterior, editorial..."
        />
      </div>

      {/* --- TAB: SEO (New Fields) --- */}
      <div className={activeTab === 'seo' ? 'block space-y-6' : 'hidden'}>
        <Input
          label="Meta Title (SEO)"
          name="metaTitle"
          defaultValue={project.metaTitle || ''}
          placeholder="Título optimizado para Google"
        />
        <TextArea
          label="Meta Description"
          name="metaDescription"
          defaultValue={project.description || ''}
          rows={3}
          placeholder="Descripción para resultados de búsqueda (160 caracteres recommended)"
        />
        <Input
          label="Meta Keywords"
          name="metaKeywords"
          defaultValue={project.metaKeywords?.join(', ') || ''}
          placeholder="maquillaje, novia, profesional..."
        />
        <Input
          label="Canonical URL"
          name="canonicalUrl"
          defaultValue={project.canonicalUrl || ''}
          placeholder="https://tudominio.com/proyectos/este-proyecto"
        />
      </div>

      {/* --- TAB: CONFIG (New Fields) --- */}
      <div className={activeTab === 'config' ? 'block space-y-6' : 'hidden'}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Layout de Galería
            </label>
            <select
              name="layout"
              defaultValue={project.layout || 'grid'}
              className="w-full rounded-lg border bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="grid">Grid (Cuadrícula)</option>
              <option value="masonry">Masonry (Mosaico)</option>
              <option value="carousel">Carrusel</option>
            </select>
          </div>
        </div>

        <div className="border-border space-y-4 border-t pt-4">
          <h4 className="text-foreground font-medium">Visibilidad</h4>
          <div className="flex gap-8">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={project.isFeatured}
                className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
              />
              <span className="text-sm">Destacado (Home)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isPinned"
                defaultChecked={project.isPinned}
                className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
              />
              <span className="text-sm">Fijado (Arriba)</span>
            </label>
          </div>
        </div>
      </div>

      {/* --- TAB: MEDIA --- */}
      <div className={activeTab === 'media' ? 'block space-y-6' : 'hidden'}>
        <SortableImageGrid
          images={project.images}
          currentThumbnail={currentThumbnail}
          onReorder={handleReorderImages}
          onDelete={handleDeleteImage}
          onSetThumbnail={handleSetThumbnail}
        />

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

      <div className="border-border bg-background/80 sticky bottom-0 z-10 flex justify-end gap-4 border-t p-4 pt-6 backdrop-blur-sm">
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
