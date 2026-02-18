'use client'

import { useState, useCallback, ChangeEvent, DragEvent, useEffect } from 'react'
import Image from 'next/image'
import { showToast } from '@/lib/toast'

interface UploadedImage {
  url: string
  publicId: string
  file?: File
  isUploading?: boolean
  error?: string
}

interface ImageUploadProps {
  name: string
  multiple?: boolean
  label?: string
  folder?: string
  value?: string[]
  currentImage?: string | null
  onChange?: (urls: string[], publicIds: string[]) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
  maxFiles?: number
  maxSizeMB?: number
}

export default function ImageUpload({
  name,
  multiple = false,
  label = 'Subir Imágenes',
  folder = 'projects',
  value = [],
  currentImage,
  onChange,
  onUploadStart,
  onUploadEnd,
  maxFiles = 20,
  maxSizeMB = 10,
}: ImageUploadProps) {
  // Initialize with currentImage if provided and no value
  const initialImages =
    value.length > 0
      ? value.map((url) => ({ url, publicId: '' }))
      : currentImage
        ? [{ url: currentImage, publicId: '' }]
        : []
  const [images, setImages] = useState<UploadedImage[]>(initialImages)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Sync state with props
  useEffect(() => {
    const newImages =
      value.length > 0
        ? value.map((url) => ({ url, publicId: '' }))
        : currentImage
          ? [{ url: currentImage, publicId: '' }]
          : []

    setImages((prev) => {
      // Prevent infinite loop by checking if URLs are actually different
      const prevUrls = prev.map((img) => img.url).join(',')
      const newUrls = newImages.map((img) => img.url).join(',')

      return prevUrls === newUrls ? prev : newImages
    })
  }, [value, currentImage])

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedImage> => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Error al subir')
        }

        const data = await res.json()
        return { url: data.url, publicId: data.publicId }
      } catch (error) {
        return { url: '', publicId: '', error: String(error) }
      }
    },
    [folder]
  )

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)

      // Validaciones
      if (!multiple && fileArray.length > 1) {
        showToast.error('Solo puedes subir una imagen')
        return
      }

      if (images.length + fileArray.length > maxFiles) {
        showToast.error(`Máximo ${maxFiles} imágenes permitidas`)
        return
      }

      // Validar cada archivo
      const validFiles: File[] = []
      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          showToast.error(`${file.name} no es una imagen válida`)
          continue
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          showToast.error(`${file.name} supera el límite de ${maxSizeMB}MB`)
          continue
        }
        validFiles.push(file)
      }

      if (validFiles.length === 0) return

      setIsUploading(true)
      onUploadStart?.()

      // Crear previews temporales
      const tempImages: UploadedImage[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        publicId: '',
        file,
        isUploading: true,
      }))

      setImages((prev) => (multiple ? [...prev, ...tempImages] : tempImages))

      // Subir archivos
      const uploadPromises = validFiles.map((file) => uploadFile(file))
      const results = await Promise.all(uploadPromises)

      // Actualizar con resultados
      setImages((prev) => {
        const updated = prev.map((img) => {
          if (!img.isUploading) return img
          const result = results.find(
            (r) => !r.error && !prev.some((p) => p.publicId === r.publicId && p !== img)
          )
          if (result && !result.error) {
            // Limpiar URL temporal
            if (img.url.startsWith('blob:')) {
              URL.revokeObjectURL(img.url)
            }
            return { url: result.url, publicId: result.publicId }
          }
          return { ...img, isUploading: false, error: 'Error al subir' }
        })

        // Notificar cambios
        const successfulUploads = updated.filter((img) => img.publicId && !img.error)
        setTimeout(() => {
          onChange?.(
            successfulUploads.map((img) => img.url),
            successfulUploads.map((img) => img.publicId)
          )
        }, 0)

        return updated
      })

      const successCount = results.filter((r) => !r.error).length
      const errorCount = results.filter((r) => r.error).length

      if (successCount > 0) {
        showToast.success(
          `${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''}`
        )
      }
      if (errorCount > 0) {
        showToast.error(
          `${errorCount} imagen${errorCount > 1 ? 'es' : ''} fallida${errorCount > 1 ? 's' : ''}`
        )
      }

      setIsUploading(false)
      onUploadEnd?.()
    },
    [multiple, images.length, maxFiles, maxSizeMB, onChange, onUploadStart, onUploadEnd, uploadFile]
  )

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
    // Reset input para permitir subir el mismo archivo de nuevo
    e.target.value = ''
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index]

    // Si tiene publicId, eliminar de Cloudinary
    if (imageToRemove.publicId) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: imageToRemove.publicId }),
        })
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }

    // Limpiar URL temporal si existe
    if (imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url)
    }

    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    setTimeout(() => {
      onChange?.(
        newImages.map((img) => img.url),
        newImages.map((img) => img.publicId)
      )
    }, 0)
  }

  // Single image mode: show image inside dropzone with overlay buttons
  const hasSingleImage = !multiple && images.length > 0 && !images[0].isUploading

  // Handle edit button click - triggers file input
  const handleEditClick = () => {
    const input = document.getElementById(`file-upload-${name}`) as HTMLInputElement
    if (input) input.click()
  }

  return (
    <div className="w-full">
      <label className="text-foreground mb-2 block text-sm font-medium">{label}</label>

      {/* Single Image Mode: Image inside dropzone */}
      {hasSingleImage ? (
        <div
          className="group border-input bg-muted/30 relative h-48 w-full overflow-hidden rounded-2xl border-2"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Image
            src={images[0].url}
            alt="Imagen subida"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Hover Overlay with Edit/Delete buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            {/* Edit Button */}
            <button
              type="button"
              onClick={handleEditClick}
              className="text-foreground flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110 hover:bg-white"
              title="Cambiar imagen"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => handleRemove(0)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-red-600"
              title="Eliminar imagen"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Hidden file input - still needed for edit functionality */}
          <input
            id={`file-upload-${name}`}
            name={name}
            type="file"
            className="hidden"
            multiple={multiple}
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      ) : (
        /* Empty/Multi Dropzone */
        <div
          className={`flex w-full items-center justify-center transition-all ${
            isDragging ? 'scale-[1.02]' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label
            htmlFor={`file-upload-${name}`}
            className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-input bg-muted/30 hover:bg-muted/50 hover:border-primary/50'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <svg className="text-primary mb-4 h-10 w-10 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <p className="text-muted-foreground text-sm">Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <svg
                    className="text-muted-foreground mb-4 h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-muted-foreground mb-2 text-sm">
                    <span className="text-primary font-bold hover:underline">Click para subir</span>{' '}
                    o arrastra y suelta
                  </p>
                  <p className="text-muted-foreground text-xs">
                    PNG, JPG, GIF, WebP (máx. {maxSizeMB}MB)
                  </p>
                </>
              )}
            </div>
            <input
              id={`file-upload-${name}`}
              name={name}
              type="file"
              className="hidden"
              multiple={multiple}
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}

      {/* Multi-image gallery (only for multiple mode) */}
      {multiple && images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((img, index) => (
            <div
              key={`${img.publicId || index}-${img.url}`}
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
                img.error ? 'border-red-500' : img.isUploading ? 'border-primary' : 'border-border'
              }`}
            >
              <Image
                src={img.url}
                alt={`Imagen ${index + 1}`}
                fill
                className={`object-cover ${img.isUploading ? 'opacity-50' : ''}`}
                sizes="(max-width: 768px) 50vw, 20vw"
              />

              {/* Overlay de carga */}
              {img.isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg className="h-8 w-8 animate-spin text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              )}

              {/* Error overlay */}
              {img.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                  <span className="text-2xl">❌</span>
                </div>
              )}

              {/* Edit and Delete buttons for multi-image */}
              {!img.isUploading && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    title="Eliminar"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contador */}
      {multiple && (
        <p className="text-muted-foreground mt-2 text-sm">
          {images.length} de {maxFiles} imágenes
        </p>
      )}
      {/* Hidden inputs for form submission */}
      {images.map(
        (img, index) =>
          img.url &&
          !img.isUploading &&
          !img.error && (
            <div key={`hidden-${index}`}>
              <input type="hidden" name={name} value={img.url} />
              <input type="hidden" name={`${name}_public_id`} value={img.publicId} />
            </div>
          )
      )}
    </div>
  )
}
