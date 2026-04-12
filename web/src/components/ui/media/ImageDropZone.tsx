'use client'

import { ImageIcon, Loader2 } from 'lucide-react'
import type { DropZoneProps } from './ImageUploadTypes'

export function ImageDropZone({
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
              <Loader2 className="text-primary mb-4 h-10 w-10 animate-spin" />
              <p className="text-muted-foreground text-sm">Subiendo imagen...</p>
            </>
          ) : (
            <>
              <ImageIcon className="text-muted-foreground mb-4 h-10 w-10" />
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
