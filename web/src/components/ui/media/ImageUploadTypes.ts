import type { ChangeEvent, DragEvent } from 'react'

export interface UploadedImage {
  url: string
  publicId: string
  width?: number
  height?: number
  file?: File
  isUploading?: boolean
  error?: string
}

export interface ImageUploadProps {
  name: string
  multiple?: boolean
  label?: string
  folder?: string
  value?: string[]
  currentImage?: string | null
  onChange?: (
    urls: string[],
    publicIds: string[],
    widths?: Array<number | undefined>,
    heights?: Array<number | undefined>
  ) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
  maxFiles?: number
  maxSizeMB?: number
  /** UI mode: 'single' forces single-image preview UI, 'gallery' forces multiple/grid UI */
  mode?: 'single' | 'gallery'
}

export interface UseImageUploadOptions {
  folder: string
  multiple: boolean
  images: UploadedImage[]
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>
  maxFiles: number
  maxSizeMB: number
  onChange?: (
    urls: string[],
    publicIds: string[],
    widths?: Array<number | undefined>,
    heights?: Array<number | undefined>
  ) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

export interface DropZoneProps {
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

export interface SingleImagePreviewProps {
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

export interface ImageGridProps {
  images: UploadedImage[]
  maxFiles: number
  onRemove: (index: number) => void
}
