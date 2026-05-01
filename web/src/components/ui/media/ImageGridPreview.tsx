'use client'

import { IMAGE_SIZES } from '@/config/image-sizes'
import { OptimizedImage } from './OptimizedImage'
import { X, Loader2 } from 'lucide-react'
import type { ImageGridProps } from './ImageUploadTypes'

export function ImageGridPreview({ images, maxFiles, onRemove }: ImageGridProps) {
  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((img, index) => (
          <div
            key={`${img.publicId || index}-${img.url}`}
            className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
              img.error
                ? 'border-destructive'
                : img.isUploading
                  ? 'border-primary'
                  : 'border-border'
            }`}
          >
            <OptimizedImage
              src={img.url}
              alt={`Imagen ${index + 1}`}
              fill
              sizes={IMAGE_SIZES.adminUploadGrid}
              variant="thumbnail"
              placeholder="empty"
              imgClassName={img.isUploading ? 'opacity-50' : ''}
            />
            {img.isUploading && (
              <div className="bg-foreground/30 absolute inset-0 flex items-center justify-center">
                <Loader2 className="text-background h-8 w-8 animate-spin" />
              </div>
            )}
            {img.error && (
              <div className="border-destructive bg-destructive/50 absolute inset-0 flex items-center justify-center">
                <X className="text-destructive-foreground h-8 w-8" />
              </div>
            )}
            {!img.isUploading && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex h-8 w-8 items-center justify-center rounded-full"
                  title="Eliminar"
                >
                  <X className="h-4 w-4" />
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
