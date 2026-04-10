'use client'

import { useState, useCallback } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { showToast } from '@/lib/toast'
import { logger } from '@/lib/logger'
import type { UploadedImage, UseImageUploadOptions } from './ImageUploadTypes'

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

export function useImageUpload(options: UseImageUploadOptions) {
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
