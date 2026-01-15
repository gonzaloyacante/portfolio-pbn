'use client'

import { useState } from 'react'
import { Project, ProjectImage, Category } from '@prisma/client'
import { Button } from '@/components/ui'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectFormSchema, type ProjectFormData } from '@/lib/validations'
import { useToast } from '@/components/ui/Toast'

type ProjectWithImages = Project & { images: ProjectImage[] }

interface ProjectEditFormProps {
  project: ProjectWithImages
  categories: Category[]
}

export default function ProjectEditForm({ project, categories }: ProjectEditFormProps) {
  const router = useRouter()
  const { show } = useToast()
  const [images, setImages] = useState(project.images)
  const [isSavingOrder, setIsSavingOrder] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      categoryId: project.categoryId,
      date: new Date(project.date).toISOString().split('T')[0],
    },
  })

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
    setIsSavingOrder(true)
    const orderUpdates = images.map((img, index) => ({
      id: img.id,
      order: index,
    }))

    const result = await reorderProjectImages(project.id, orderUpdates)
    if (result.success) {
      show({ type: 'success', message: 'Orden actualizado correctamente' })
      router.refresh()
    } else {
      show({ type: 'error', message: 'Error al actualizar el orden' })
    }
    setIsSavingOrder(false)
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    const result = await deleteProjectImage(imageId)
    if (result.success) {
      setImages(images.filter((img) => img.id !== imageId))
      show({ type: 'success', message: 'Imagen eliminada' })
      router.refresh()
    } else {
      show({ type: 'error', message: 'Error al eliminar la imagen' })
    }
  }

  const onSubmit = async (data: ProjectFormData, event?: React.BaseSyntheticEvent) => {
    if (!event) return
    const formData = new FormData(event.target)

    const result = await updateProject(project.id, formData)

    if (result.success) {
      show({ type: 'success', message: 'Proyecto actualizado correctamente' })
      router.refresh()
    } else {
      show({ type: 'error', message: result.error || 'Error al actualizar proyecto' })
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-wine/10 dark:border-pink-light/10 dark:bg-purple-dark/20 space-y-6 rounded-2xl border bg-white/80 p-8 shadow-sm backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-wine dark:text-pink-light mb-2 block text-sm font-bold">
              Título
            </label>
            <input
              {...register('title')}
              className="border-wine/20 bg-pink-light/50 text-wine placeholder:text-wine/40 focus:border-wine focus:ring-wine/20 dark:border-pink-light/20 dark:bg-purple-dark/50 dark:text-pink-light dark:focus:border-pink-hot w-full rounded-xl border-2 px-4 py-2 transition-all focus:ring-2 focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label className="text-wine dark:text-pink-light mb-2 block text-sm font-bold">
              Categoría
            </label>
            <select
              {...register('categoryId')}
              className="border-wine/20 bg-pink-light/50 text-wine focus:border-wine focus:ring-wine/20 dark:border-pink-light/20 dark:bg-purple-dark/50 dark:text-pink-light dark:focus:border-pink-hot w-full rounded-xl border-2 px-4 py-2 transition-all focus:ring-2 focus:outline-none"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-wine dark:text-pink-light mb-2 block text-sm font-bold">
            Descripción
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="border-wine/20 bg-pink-light/50 text-wine placeholder:text-wine/40 focus:border-wine focus:ring-wine/20 dark:border-pink-light/20 dark:bg-purple-dark/50 dark:text-pink-light dark:focus:border-pink-hot w-full rounded-xl border-2 px-4 py-2 transition-all focus:ring-2 focus:outline-none"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="text-wine dark:text-pink-light mb-2 block text-sm font-bold">
            Fecha
          </label>
          <input
            {...register('date')}
            type="date"
            className="border-wine/20 bg-pink-light/50 text-wine focus:border-wine focus:ring-wine/20 dark:border-pink-light/20 dark:bg-purple-dark/50 dark:text-pink-light dark:focus:border-pink-hot w-full rounded-xl border-2 px-4 py-2 transition-all focus:ring-2 focus:outline-none"
          />
          {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
        </div>

        <div>
          <h3 className="text-wine dark:text-pink-hot mb-4 text-lg font-bold">
            Galería de Imágenes
          </h3>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-wine/60 dark:text-pink-light/60 text-sm">
                Arrastra las imágenes para reordenar
              </span>
              <Button
                type="button"
                onClick={handleSaveOrder}
                loading={isSavingOrder}
                variant="secondary"
                size="sm"
              >
                {isSavingOrder ? 'Guardando...' : 'Guardar Orden'}
              </Button>
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

          <div className="border-wine/10 dark:border-pink-light/10 mt-6 border-t pt-6">
            <h4 className="text-wine dark:text-pink-light mb-2 text-sm font-bold">
              Agregar nuevas imágenes
            </h4>
            <ImageUpload name="newImages" multiple label="Subir fotos adicionales" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" loading={isSubmitting}>
            Actualizar Proyecto
          </Button>
        </div>
      </form>
    </div>
  )
}
