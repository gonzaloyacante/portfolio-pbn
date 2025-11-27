'use client'

import { useState } from 'react'
import { Project, ProjectImage, Category } from '@prisma/client'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableImage } from './SortableImage'
import { updateProject, reorderProjectImages, deleteProjectImage } from '@/actions/content.actions'
import ImageUpload from './ImageUpload'
import { useRouter } from 'next/navigation'

type ProjectWithImages = Project & { images: ProjectImage[] }

interface ProjectEditFormProps {
  project: ProjectWithImages
  categories: Category[]
}

export default function ProjectEditForm({ project, categories }: ProjectEditFormProps) {
  const router = useRouter()
  const [images, setImages] = useState(project.images)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSaveOrder = async () => {
    setIsSaving(true)
    const orderUpdates = images.map((img, index) => ({
      id: img.id,
      order: index,
    }))

    const result = await reorderProjectImages(project.id, orderUpdates)
    if (result.success) {
      alert('Orden actualizado correctamente')
      router.refresh()
    } else {
      alert('Error al actualizar el orden')
    }
    setIsSaving(false)
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    const result = await deleteProjectImage(imageId)
    if (result.success) {
      setImages(images.filter((img) => img.id !== imageId))
      router.refresh()
    } else {
      alert('Error al eliminar la imagen')
    }
  }

  return (
    <div className="space-y-8">
      <form
        action={async (formData) => {
          const result = await updateProject(project.id, formData)
          if (result.success) {
            alert('Proyecto actualizado')
            router.refresh()
          } else {
            alert('Error al actualizar')
          }
        }}
        className="space-y-6 rounded-lg bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              name="title"
              defaultValue={project.title}
              required
              className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="categoryId"
              defaultValue={project.categoryId}
              required
              className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            defaultValue={project.description}
            rows={4}
            className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            name="date"
            defaultValue={new Date(project.date).toISOString().split('T')[0]}
            className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
          />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">Galería de Imágenes</h3>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">Arrastra las imágenes para reordenar</span>
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={isSaving}
                className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Guardar Orden'}
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {images.map((img) => (
                    <SortableImage
                      key={img.id}
                      id={img.id}
                      url={img.url}
                      onDelete={handleDeleteImage}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="mt-6 border-t pt-6">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Agregar nuevas imágenes</h4>
            <ImageUpload name="newImages" multiple label="Subir fotos adicionales" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 rounded-md px-6 py-2 text-white shadow-sm transition-colors"
          >
            Actualizar Proyecto
          </button>
        </div>
      </form>
    </div>
  )
}
