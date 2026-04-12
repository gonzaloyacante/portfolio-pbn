'use client'

import { useState } from 'react'
import type { ImageUploadProps, UploadedImage } from './ImageUploadTypes'
import { useImageUpload } from './useImageUpload'
import { ImageDropZone } from './ImageDropZone'
import { ImageSinglePreview } from './ImageSinglePreview'
import { ImageGridPreview } from './ImageGridPreview'

export default function ImageUpload({
  name,
  multiple = false,
  label = 'Subir Imágenes',
  folder = 'gallery',
  value = [],
  currentImage,
  onChange,
  onUploadStart,
  onUploadEnd,
  maxFiles = 20,
  maxSizeMB = 10,
  mode,
}: ImageUploadProps) {
  const computeImagesFromProps = (v: string[], ci: string | null | undefined): UploadedImage[] =>
    v.length > 0 ? v.map((url) => ({ url, publicId: '' })) : ci ? [{ url: ci, publicId: '' }] : []

  const effectiveMultiple = mode === 'gallery' ? true : mode === 'single' ? false : multiple
  const [images, setImages] = useState<UploadedImage[]>(() =>
    computeImagesFromProps(value, currentImage)
  )

  // Sync controlled props without useEffect to avoid cascade renders
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

  const hasSingleImage = !effectiveMultiple && images.length > 0 && !images[0].isUploading

  return (
    <div className="w-full">
      <label className="text-foreground mb-2 block text-sm font-medium">{label}</label>

      {hasSingleImage ? (
        <ImageSinglePreview
          imageUrl={images[0].url}
          name={name}
          multiple={effectiveMultiple}
          isUploading={isUploading}
          onEdit={() => handleEditClick(name)}
          onRemove={() => handleRemove(0)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
        />
      ) : (
        <ImageDropZone
          name={name}
          multiple={effectiveMultiple}
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
        <ImageGridPreview images={images} maxFiles={maxFiles} onRemove={handleRemove} />
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
