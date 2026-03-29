'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Category, Project, ProjectImage } from '@/generated/prisma/client'
import { updateProject, deleteProjectImage, reorderProjectImages } from '@/actions/cms/content'
import { setProjectThumbnail } from '@/actions/cms/project'
import { Button, SmartField, ImageUpload } from '@/components/ui'
import { showToast } from '@/lib/toast'
import SortableImageGrid from '@/components/ui/media/SortableImageGrid'

type ProjectWithRelations = Project & {
  category: Category
  images: ProjectImage[]
}

interface ProjectEditFormProps {
  project: ProjectWithRelations
  categories: Pick<Category, 'id' | 'name'>[]
}

export default function ProjectEditForm({ project, categories }: ProjectEditFormProps) {
  const router = useRouter()

  // 1. Setup React Hook Form
  type ProjectFormData = {
    title: string
    categoryId: string
    description: string
    excerpt?: string
    client?: string
    duration?: string
    date: string
    newImages: never[]
    isActive?: boolean
    isFeatured?: boolean
    isPinned?: boolean
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: project.title,
      categoryId: project.categoryId,
      description: project.description || '',
      excerpt: project.excerpt || '',
      client: project.client || '',
      duration: project.duration || '',
      date: project.date ? new Date(project.date).toISOString().split('T')[0] : '',
      isActive: project.isActive,
      isFeatured: project.isFeatured,
      isPinned: project.isPinned,
      newImages: [],
    },
  })

  // 2. Track images for preview (Existing + New)
  const [currentThumbnail, setCurrentThumbnail] = useState(project.thumbnailUrl)
  const [existingImages, setExistingImages] = useState(project.images)

  // Track new uploads (URLs from Cloudinary via ImageUpload)
  const [previewImages, setPreviewImages] = useState<ProjectImage[]>([])
  const [uploadValue, setUploadValue] = useState<string[]>([])

  const allImages = [...existingImages, ...previewImages]

  // Actions
  const onSubmit = async (data: ProjectFormData) => {
    const formData = new FormData()
    // Append basic fields
    formData.append('title', data.title)
    formData.append('categoryId', data.categoryId)
    formData.append('description', data.description)
    formData.append('excerpt', data.excerpt || '')
    formData.append('client', data.client || '')
    formData.append('duration', data.duration || '')
    formData.append('date', data.date)

    // Append new images (URLs + PublicIDs from ImageUpload)
    // We do NOT send files because ImageUpload already handled it.
    previewImages.forEach((img) => {
      formData.append('images', img.url)
      formData.append('images_public_id', img.publicId)
    })

    // Append flags
    formData.append('isActive', data.isActive ? 'on' : 'off')
    formData.append('isFeatured', data.isFeatured ? 'on' : 'off')
    formData.append('isPinned', data.isPinned ? 'on' : 'off')

    try {
      const result = await updateProject(project.id, formData)
      if (result.success) {
        showToast.success('Proyecto actualizado correctamente')
        router.refresh()
        // Clear previews on success?
        setPreviewImages([])
      } else {
        showToast.error(result.error || 'Error al actualizar')
      }
    } catch {
      showToast.error('Error inesperado')
    }
  }

  const handleReorderImages = async (imageIds: string[]) => {
    // Only reorder existing images for now
    const reorderedIds = imageIds.filter((id) => !id.startsWith('new-'))
    const reorderedItems = reorderedIds.map((id, index) => ({ id, order: index }))

    // Optimistic update locally
    const newOrderMap = new Map(reorderedIds.map((id, index) => [id, index]))
    setExistingImages((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const indexA = newOrderMap.get(a.id) ?? 999
        const indexB = newOrderMap.get(b.id) ?? 999
        return indexA - indexB
      })
      return sorted
    })

    try {
      await reorderProjectImages(project.id, reorderedItems)
      showToast.success('Orden de imágenes actualizado')
    } catch {
      showToast.error('Error al reordenar imágenes')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (imageId.startsWith('new-')) {
      // Remove from previewImages
      setPreviewImages((prev) => prev.filter((img) => img.id !== imageId))
      // Ideally we should also delete from Cloudinary here to avoid orphans,
      // but per user instruction we touch nothing else.
      return
    }

    try {
      const result = await deleteProjectImage(imageId)
      if (result.success) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
        showToast.success('Imagen eliminada correctly')
        router.refresh()
      } else {
        showToast.error(result.error || 'Error al eliminar imagen')
      }
    } catch {
      showToast.error('Error al eliminar imagen')
    }
  }

  const handleSetThumbnail = async (imageUrl: string) => {
    const prevThumbnail = currentThumbnail
    setCurrentThumbnail(imageUrl)
    try {
      const result = await setProjectThumbnail(project.id, imageUrl)
      if (result.success) {
        showToast.success('Portada actualizada')
        router.refresh()
      } else {
        setCurrentThumbnail(prevThumbnail)
        showToast.error(result.error || 'Error al cambiar portada')
      }
    } catch {
      setCurrentThumbnail(prevThumbnail)
      showToast.error('Error al cambiar portada')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl space-y-8">
      {/* 1. Detalles Principales */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Manual integration of SmartField with React Hook Form */}
          <div>
            <SmartField label="Título" {...register('title')} required maxLength={200} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-(--foreground)">Categoría</label>
            <select
              {...register('categoryId')}
              className="w-full rounded-lg border bg-(--background) px-4 py-3 text-(--foreground) focus:ring-2 focus:ring-(--primary)"
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
        <SmartField
          label="Descripción"
          {...register('description')}
          type="textarea"
          rows={4}
          placeholder="Descripción completa del proyecto..."
        />
        <SmartField label="Fecha" {...register('date')} type="date" />
        <SmartField
          label="Extracto / Resumen"
          {...register('excerpt')}
          type="textarea"
          rows={2}
          maxLength={300}
          placeholder="Breve descripción para tarjetas y listados..."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SmartField
            label="Cliente"
            {...register('client')}
            placeholder="Nombre del cliente..."
            maxLength={100}
          />
          <SmartField
            label="Duración"
            {...register('duration')}
            placeholder="Ej: 2 horas, Todo el día..."
            maxLength={100}
          />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 rounded border text-(--primary) focus:ring-(--primary)"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-(--foreground)">
              Activo
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="isFeatured"
              type="checkbox"
              {...register('isFeatured')}
              className="h-4 w-4 rounded border text-(--primary) focus:ring-(--primary)"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-(--foreground)">
              Destacado
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="isPinned"
              type="checkbox"
              {...register('isPinned')}
              className="h-4 w-4 rounded border text-(--primary) focus:ring-(--primary)"
            />
            <label htmlFor="isPinned" className="text-sm font-medium text-(--foreground)">
              Fijado al inicio
            </label>
          </div>
        </div>
      </div>

      {/* 2. Galería */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Galería de Imágenes</h3>
        <SortableImageGrid
          images={allImages}
          currentThumbnail={currentThumbnail}
          onReorder={handleReorderImages}
          onDelete={handleDeleteImage}
          onSetThumbnail={handleSetThumbnail}
        />

        <div className="rounded-xl border border-dashed border-(--border) p-6">
          <ImageUpload
            value={uploadValue}
            name="newImages"
            label="Agregar más fotos"
            multiple
            mode="gallery"
            folder="portfolio/projects/gallery"
            onChange={(urls, publicIds) => {
              if (urls.length > 0) {
                // ImageUpload sends ALL images in its state, not just new ones
                setPreviewImages((prev) => {
                  const existingUrls = new Set(prev.map((img) => img.url))
                  const existingPublicIds = new Set(prev.map((img) => img.publicId))
                  const newUrls: string[] = []
                  const newPublicIds: string[] = []

                  urls.forEach((url, i) => {
                    const publicId = publicIds[i]
                    // Check against the FRESH 'prev' state
                    if (!existingUrls.has(url) && !existingPublicIds.has(publicId)) {
                      newUrls.push(url)
                      newPublicIds.push(publicId)
                    }
                  })

                  if (newUrls.length === 0) {
                    return prev
                  }

                  const newImages: ProjectImage[] = newUrls.map((url, i) => ({
                    id: newPublicIds[i] || `new-${Date.now()}-${i}`,
                    url,
                    publicId: newPublicIds[i],
                    order: allImages.length + prev.length + i,
                    alt: null,
                    caption: null,
                    title: null,
                    width: null,
                    height: null,
                    format: null,
                    bytes: null,
                    isCover: false,
                    isHero: false,
                    categoryGalleryOrder: null,
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: project.id,
                  }))

                  return [...prev, ...newImages]
                })

                // Reset ImageUpload value
                setUploadValue([])
              }
            }}
          />
        </div>
      </div>

      {/* Footer Actions */}
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
