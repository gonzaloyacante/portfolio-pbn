'use client'

import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import type { SingleImagePreviewProps } from './ImageUploadTypes'

export function ImageSinglePreview({
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
      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="bg-background/90 text-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 hover:bg-background"
          title="Cambiar imagen"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="bg-destructive text-destructive-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 hover:bg-destructive/90"
          title="Eliminar imagen"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <input
        id={`file-upload-${name}`}
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
