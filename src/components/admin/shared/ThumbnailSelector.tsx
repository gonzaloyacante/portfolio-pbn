'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, Check } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { clsx } from 'clsx'

interface ImageOption {
  id: string
  url: string
  alt?: string
}

interface ThumbnailSelectorProps {
  images: ImageOption[]
  selectedImageUrl?: string | null
  onSelect: (imageUrl: string) => void
  onUploadNew?: () => void
  allowUpload?: boolean
}

/**
 * ThumbnailSelector - Grid selector for choosing a thumbnail from available images
 * Used in Category/Project create/edit forms
 */
export default function ThumbnailSelector({
  images,
  selectedImageUrl,
  onSelect,
  onUploadNew,
  allowUpload = true,
}: ThumbnailSelectorProps) {
  const [localSelected, setLocalSelected] = useState(selectedImageUrl)

  const handleSelect = (url: string) => {
    setLocalSelected(url)
    onSelect(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-foreground text-sm font-medium">Imagen Principal</label>
        {allowUpload && onUploadNew && (
          <Button type="button" variant="outline" size="sm" onClick={onUploadNew} className="gap-2">
            <Upload size={14} />
            Subir Nueva
          </Button>
        )}
      </div>

      {images.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <span className="mb-4 text-4xl opacity-20">📷</span>
          <p className="text-muted-foreground text-sm">
            No hay imágenes disponibles.
            {allowUpload && ' Sube una nueva imagen.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((image) => {
            const isSelected = localSelected === image.url
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => handleSelect(image.url)}
                className={clsx(
                  'group relative aspect-video overflow-hidden rounded-lg border-2 transition-all',
                  isSelected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || 'Thumbnail option'}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {isSelected && (
                  <div className="bg-primary/20 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg">
                      <Check size={16} />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {localSelected && (
        <p className="text-muted-foreground text-xs">Imagen seleccionada como thumbnail</p>
      )}
    </div>
  )
}
