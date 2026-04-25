'use client'

import { motion } from '@/components/ui'
import { Button } from '@/components/ui'
import { ImageUpload } from '@/components/ui'
import { Save, RotateCcw, Check, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

interface CategoryGalleryToolbarProps {
  categoryName: string
  imageCount: number
  isDirty: boolean
  isSaving: boolean
  isResetting: boolean
  onSave: () => void
  onReset: () => void
  onUploadComplete: (
    urls: string[],
    publicIds: string[],
    widths?: Array<number | undefined>,
    heights?: Array<number | undefined>
  ) => void
}

export function CategoryGalleryToolbar({
  categoryName,
  imageCount,
  isDirty,
  isSaving,
  isResetting,
  onSave,
  onReset,
  onUploadComplete,
}: CategoryGalleryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href={ROUTES.admin.categories}>
            <ArrowLeft size={16} />
            Categorías
          </Link>
        </Button>
        <div>
          <h1 className="text-foreground text-2xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground text-sm">
            {imageCount} {imageCount === 1 ? 'imagen' : 'imágenes'} · Arrastra para reordenar como
            en la web pública
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2">
          <ImageUpload
            name="category-gallery-upload"
            folder={`portfolio/categories`}
            mode="gallery"
            multiple={true}
            maxFiles={100}
            onChange={onUploadComplete}
          />
        </div>

        {isDirty && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-medium text-amber-500"
          >
            Sin guardar
          </motion.span>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={isResetting || isSaving}
          className="gap-2"
        >
          <RotateCcw size={14} className={cn(isResetting && 'animate-spin')} />
          Restablecer
        </Button>

        <Button size="sm" onClick={onSave} disabled={!isDirty || isSaving} className="gap-2">
          {isSaving ? (
            <RotateCcw size={14} className="animate-spin" />
          ) : isDirty ? (
            <Save size={14} />
          ) : (
            <Check size={14} />
          )}
          {isSaving ? 'Guardando…' : 'Guardar Orden'}
        </Button>
      </div>
    </div>
  )
}
