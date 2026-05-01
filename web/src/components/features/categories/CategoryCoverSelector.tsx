'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  ImageUpload,
  OptimizedImage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { getCategoryImages } from '@/actions/cms/category'
import { Image as ImageIcon, Upload } from 'lucide-react'
import { GalleryImagePicker } from './GalleryImagePicker'
import type { GalleryCoverImage } from './types'

interface CategoryCoverSelectorProps {
  categoryId: string
  currentCoverUrl?: string | null
  onSelect?: (url: string) => void
}

export default function CategoryCoverSelector({
  categoryId,
  currentCoverUrl,
  onSelect,
}: CategoryCoverSelectorProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentCoverUrl || null)
  const [galleryImages, setGalleryImages] = useState<GalleryCoverImage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      const res = await getCategoryImages(categoryId)
      if (res.success && res.data) {
        setGalleryImages(res.data)
      }
      setLoading(false)
    }
    fetchImages()
  }, [categoryId])

  const handleSelect = (url: string) => {
    setSelectedUrl(url)
    onSelect?.(url)
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="coverImageUrl" value={selectedUrl || ''} />

      {selectedUrl && (
        <div className="border-primary/20 bg-muted/30 relative h-48 w-full overflow-hidden rounded-xl border-2">
          <OptimizedImage
            src={selectedUrl}
            alt="Portada seleccionada"
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            variant="card"
            placeholder="empty"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleSelect('')}
              title="Quitar portada"
            >
              Quitar Portada
            </Button>
          </div>
          <div className="bg-primary absolute right-2 bottom-2 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md">
            Portada Actual
          </div>
        </div>
      )}

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery" className="gap-2">
            <ImageIcon size={16} /> De la Galería
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload size={16} /> Subir Nueva
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-4">
          <div className="bg-card rounded-lg border p-4">
            <GalleryImagePicker
              images={galleryImages}
              selectedUrl={selectedUrl}
              loading={loading}
              onSelect={handleSelect}
            />
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card className="p-6">
            <ImageUpload
              name="coverImageUpload"
              label="Subir Imagen de Portada"
              folder="portfolio/categories"
              maxFiles={1}
              mode="single"
              onChange={(urls) => {
                if (urls.length > 0) handleSelect(urls[0])
              }}
            />
            <p className="text-muted-foreground mt-2 text-center text-xs">
              Esta imagen se subirá independientemente y no estará vinculada a ninguna galería
              específica.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
