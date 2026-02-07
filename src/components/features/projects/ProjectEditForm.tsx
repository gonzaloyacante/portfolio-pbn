'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Category, Project, ProjectImage } from '@prisma/client'
import { updateProject, deleteProjectImage, reorderProjectImages } from '@/actions/cms/content'
import { setProjectThumbnail } from '@/actions/cms/project'
import { Button, SmartField, ImageUpload } from '@/components/ui'
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

  // 1. Setup React Hook Form
  type ProjectFormData = {
    title: string
    categoryId: string
    description: string
    date: string
    newImages: never[]
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
      date: project.date ? new Date(project.date).toISOString().split('T')[0] : '',
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

  console.log('[ProjectEditForm] RENDER:', {
    existingCount: existingImages.length,
    previewCount: previewImages.length,
    totalCount: allImages.length,
    previewImages: previewImages.map((img) => ({ id: img.id, url: img.url.substring(0, 50) })),
  })

  // Actions
  const onSubmit = async (data: ProjectFormData) => {
    const formData = new FormData()
    // Append basic fields
    formData.append('title', data.title)
    formData.append('categoryId', data.categoryId)
    formData.append('description', data.description)
    formData.append('date', data.date)

    // Append new images (URLs + PublicIDs from ImageUpload)
    // We do NOT send files because ImageUpload already handled it.
    previewImages.forEach((img) => {
      formData.append('images', img.url)
      formData.append('images_public_id', img.publicId)
    })

    try {
      const result = await updateProject(project.id, formData)
      if (result.success) {
        show({ type: 'success', message: 'Proyecto actualizado correctamente' })
        router.refresh()
        // Clear previews on success?
        setPreviewImages([])
      } else {
        show({ type: 'error', message: result.error || 'Error al actualizar' })
      }
    } catch {
      show({ type: 'error', message: 'Error inesperado' })
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
      show({ type: 'success', message: 'Orden de imágenes actualizado' })
    } catch {
      show({ type: 'error', message: 'Error al reordenar imágenes' })
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl space-y-8">
      {/* 1. Detalles Principales */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Manual integration of SmartField with React Hook Form */}
          <div>
            <SmartField label="Título" {...register('title')} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Categoría
            </label>
            <select
              {...register('categoryId')}
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
        <SmartField
          label="Descripción"
          {...register('description')}
          type="textarea"
          rows={4}
          placeholder="Descripción completa del proyecto..."
        />
        <SmartField label="Fecha" {...register('date')} type="date" />
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

        <div className="rounded-xl border border-dashed border-[var(--border)] p-6">
          <ImageUpload
            value={uploadValue}
            name="newImages"
            label="Agregar más fotos"
            multiple
            onChange={(urls, publicIds) => {
              console.log('[ProjectEditForm] ImageUpload onChange fired!')
              console.log('  URLs:', urls)
              console.log('  PublicIDs:', publicIds)
              console.log('  Current previewImages count:', previewImages.length)

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
                    title: null,
                    alt: null,
                    caption: null,
                    seoAlt: '',
                    width: 0,
                    height: 0,
                    format: 'jpg',
                    bytes: 0,
                    isCover: false,
                    isHero: false,
                    categoryGalleryOrder: 0,
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: project.id,
                  }))

                  return [...prev, ...newImages]
                })

                // Reset ImageUpload value
                setUploadValue([])
              } else {
                console.log('  All URLs already exist, skipping')
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
