'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Category, Project, ProjectImage } from '@prisma/client'
import { updateProject, deleteProjectImage } from '@/actions/content.actions'
import { Button, Input, TextArea } from '@/components/ui'
import { useToast } from '@/components/ui'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState(project.images)

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

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    try {
      const result = await deleteProjectImage(imageId)
      if (result.success) {
        setImages((prev) => prev.filter((img) => img.id !== imageId))
        show({ type: 'success', message: 'Imagen eliminada correctly' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al eliminar imagen' })
      }
    } catch {
      show({ type: 'error', message: 'Error al eliminar imagen' })
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

      {/* Gestión de Impergenes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--foreground)]">Imágenes del Proyecto</h3>

        {/* Lista de imágenes existentes */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--primary)]/20"
            >
              <Image
                src={img.url}
                alt="Imagen del proyecto"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                title="Eliminar imagen"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Subir nuevas imágenes */}
        <div className="card-bg rounded-xl border border-dashed border-[var(--primary)] p-6">
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Agregar más fotos
          </label>
          <input
            type="file"
            name="newImages"
            multiple
            accept="image/*"
            className="w-full text-sm text-[var(--foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--primary-foreground)] hover:file:opacity-90"
          />
          <p className="mt-2 text-xs opacity-70">
            Selecciona múltiples archivos para agregar a la galería existente.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-[var(--primary)]/20 pt-6">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Guardar Cambios
        </Button>
      </div>
    </form>
  )
}
