'use client'

import { OptimizedImage } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { Check } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GalleryCoverImage } from './types'

interface GalleryImagePickerProps {
  images: GalleryCoverImage[]
  selectedUrl: string | null
  loading: boolean
  onSelect: (url: string) => void
}

export function GalleryImagePicker({
  images,
  selectedUrl,
  loading,
  onSelect,
}: GalleryImagePickerProps) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="text-primary animate-spin" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <p>No hay imágenes en esta categoría.</p>
        <p className="text-sm">Sube una imagen nueva.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {images.map((img) => (
        <button
          key={img.id}
          type="button"
          onClick={() => onSelect(img.url)}
          className={cn(
            'group relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 transition-all hover:scale-105',
            selectedUrl === img.url
              ? 'border-primary ring-primary ring-2 ring-offset-2'
              : 'hover:border-primary/50 border-transparent'
          )}
        >
          <OptimizedImage
            src={img.url}
            alt="Imagen de galería"
            fill
            sizes={IMAGE_SIZES.adminPickerGrid}
            variant="thumbnail"
            placeholder="empty"
          />
          {selectedUrl === img.url && (
            <div className="bg-primary/20 absolute inset-0 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                <Check size={16} />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
