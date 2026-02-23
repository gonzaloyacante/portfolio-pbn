'use client'

import { useState, useCallback, ChangeEvent, DragEvent } from 'react'
import Image from 'next/image'
import { showToast } from '@/lib/toast'
import { logger } from '@/lib/logger'

// ── Types ──────────────────────────────────────────────────────────────────

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

interface UseImageUploadOptions {
  folder: string
  multiple: boolean
  images: UploadedImage[]
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>
  maxFiles: number
  maxSizeMB: number
  onChange?: (urls: string[], publicIds: string[]) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

// ── File Validation Helper ─────────────────────────────────────────────────

function getValidFiles(
  fileArray: File[],
  maxSizeMB: number,
  multiple: boolean,
  imagesCount: number,
  maxFiles: number
): File[] | null {
  if (!multiple && fileArray.length > 1) {
    showToast.error('Solo puedes subir una imagen')
    return null
  }
  if (imagesCount + fileArray.length > maxFiles) {
    showToast.error(`Máximo ${maxFiles} imágenes permitidas`)
    return null
  }

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
  return validFiles
}

// ── Custom Hook ────────────────────────────────────────────────────────────

function useImageUpload(options: UseImageUploadOptions) {
  const {
    folder,
    multiple,
    images,
    setImages,
    maxFiles,
    maxSizeMB,
    onChange,
    onUploadStart,
    onUploadEnd,
  } = options
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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
      const validFiles = getValidFiles(fileArray, maxSizeMB, multiple, images.length, maxFiles)
      if (!validFiles || validFiles.length === 0) return

      setIsUploading(true)
      onUploadStart?.()

      const tempImages: UploadedImage[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        publicId: '',
        file,
        isUploading: true,
      }))

      setImages((prev) => (multiple ? [...prev, ...tempImages] : tempImages))

      const results = await Promise.all(validFiles.map((file) => uploadFile(file)))

      setImages((prev) => {
        const updated = prev.map((img) => {
          if (!img.isUploading) return img
          const result = results.find(
            (r) => !r.error && !prev.some((p) => p.publicId === r.publicId && p !== img)
          )
          if (result && !result.error) {
            if (img.url.startsWith('blob:')) URL.revokeObjectURL(img.url)
            return { url: result.url, publicId: result.publicId }
          }
          return { ...img, isUploading: false, error: 'Error al subir' }
        })

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
      if (successCount > 0)
        showToast.success(
          `${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''}`
        )
      if (errorCount > 0)
        showToast.error(
          `${errorCount} imagen${errorCount > 1 ? 'es' : ''} fallida${errorCount > 1 ? 's' : ''}`
        )

      setIsUploading(false)
      onUploadEnd?.()
    },
    [
      multiple,
      images.length,
      maxFiles,
      maxSizeMB,
      onChange,
      onUploadStart,
      onUploadEnd,
      uploadFile,
      setImages,
    ]
  )

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
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
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
  }

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index]
    if (imageToRemove.publicId) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: imageToRemove.publicId }),
        })
      } catch (error) {
        logger.error('Error deleting image', { error })
      }
    }
    if (imageToRemove.url.startsWith('blob:')) URL.revokeObjectURL(imageToRemove.url)

    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    setTimeout(() => {
      onChange?.(
        newImages.map((img) => img.url),
        newImages.map((img) => img.publicId)
      )
    }, 0)
  }

  const handleEditClick = (name: string) => {
    const input = document.getElementById(`file-upload-${name}`) as HTMLInputElement
    if (input) input.click()
  }

  return {
    isDragging,
    isUploading,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    handleEditClick,
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

interface DropZoneProps {
  name: string
  multiple: boolean
  isDragging: boolean
  isUploading: boolean
  maxSizeMB: number
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  onDragOver: (e: DragEvent) => void
  onDragLeave: (e: DragEvent) => void
  onDrop: (e: DragEvent) => void
}

function DropZone({
  name,
  multiple,
  isDragging,
  isUploading,
  maxSizeMB,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
}: DropZoneProps) {
  return (
    <div
      className={`flex w-full items-center justify-center transition-all ${isDragging ? 'scale-[1.02]' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
                <span className="text-primary font-bold hover:underline">Click para subir</span> o
                arrastra y suelta
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
          onChange={onFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  )
}

interface SingleImagePreviewProps {
  imageUrl: string
  name: string
  multiple: boolean
  isUploading: boolean
  onEdit: () => void
  onRemove: () => void
  onDragOver: (e: DragEvent) => void
  onDragLeave: (e: DragEvent) => void
  onDrop: (e: DragEvent) => void
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function SingleImagePreview({
  imageUrl,
  name,
  multiple,
  isUploading,
  onEdit,
  onRemove,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
}: SingleImagePreviewProps) {
  return (
    <div
      className="group border-input bg-muted/30 relative h-48 w-full overflow-hidden rounded-2xl border-2"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Image
        src={imageUrl}
        alt="Imagen subida"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
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
        <button
          type="button"
          onClick={onRemove}
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
      <input
        id={`file-upload-${name}`}
        name={name}
        type="file"
        className="hidden"
        multiple={multiple}
        accept="image/*"
        onChange={onFileChange}
        disabled={isUploading}
      />
    </div>
  )
}

interface ImageGridProps {
  images: UploadedImage[]
  maxFiles: number
  onRemove: (index: number) => void
}

function ImageGrid({ images, maxFiles, onRemove }: ImageGridProps) {
  return (
    <>
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
            {img.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                <span className="text-2xl">❌</span>
              </div>
            )}
            {!img.isUploading && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
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
      <p className="text-muted-foreground mt-2 text-sm">
        {images.length} de {maxFiles} imágenes
      </p>
    </>
  )
}

// ── Main Component (thin orchestrator) ────────────────────────────────────

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
  const computeImagesFromProps = (v: string[], ci: string | null | undefined): UploadedImage[] =>
    v.length > 0 ? v.map((url) => ({ url, publicId: '' })) : ci ? [{ url: ci, publicId: '' }] : []

  const [images, setImages] = useState<UploadedImage[]>(() =>
    computeImagesFromProps(value, currentImage)
  )

  // Derived state: sync controlled props without useEffect to avoid cascade renders
  const [prevPropsKey, setPrevPropsKey] = useState(() => `${value.join(',')}|${currentImage ?? ''}`)
  const currentPropsKey = `${value.join(',')}|${currentImage ?? ''}`
  if (currentPropsKey !== prevPropsKey) {
    setPrevPropsKey(currentPropsKey)
    const newImages = computeImagesFromProps(value, currentImage)
    const prevUrls = images.map((img) => img.url).join(',')
    const newUrls = newImages.map((img) => img.url).join(',')
    if (prevUrls !== newUrls) setImages(newImages)
  }

  const {
    isDragging,
    isUploading,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    handleEditClick,
  } = useImageUpload({
    folder,
    multiple,
    images,
    setImages,
    maxFiles,
    maxSizeMB,
    onChange,
    onUploadStart,
    onUploadEnd,
  })

  const hasSingleImage = !multiple && images.length > 0 && !images[0].isUploading

  return (
    <div className="w-full">
      <label className="text-foreground mb-2 block text-sm font-medium">{label}</label>

      {hasSingleImage ? (
        <SingleImagePreview
          imageUrl={images[0].url}
          name={name}
          multiple={multiple}
          isUploading={isUploading}
          onEdit={() => handleEditClick(name)}
          onRemove={() => handleRemove(0)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
        />
      ) : (
        <DropZone
          name={name}
          multiple={multiple}
          isDragging={isDragging}
          isUploading={isUploading}
          maxSizeMB={maxSizeMB}
          onFileChange={handleFileChange}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}

      {multiple && images.length > 0 && (
        <ImageGrid images={images} maxFiles={maxFiles} onRemove={handleRemove} />
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
