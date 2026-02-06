'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button, Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import ImageUpload from '@/components/ui/media/ImageUpload'
import { getCategoryImages } from '@/actions/cms/category'
import { Loader2, Check, Image as ImageIcon, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryCoverSelectorProps {
  categoryId: string
  currentCoverUrl?: string | null
  onSelect: (url: string) => void
}

interface GalleryImage {
  id: string
  url: string
  publicId: string
  projectTitle: string
}

export default function CategoryCoverSelector({
  categoryId,
  currentCoverUrl,
  onSelect,
}: CategoryCoverSelectorProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentCoverUrl || null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch gallery images on mount
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
    onSelect(url)
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="coverImageUrl" value={selectedUrl || ''} />

      {/* Preview Actual */}
      {selectedUrl && (
        <div className="border-primary/20 bg-muted/30 relative h-48 w-full overflow-hidden rounded-xl border-2">
          <Image src={selectedUrl} alt="Portada seleccionada" fill className="object-cover" />
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
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="text-primary animate-spin" />
              </div>
            ) : galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => handleSelect(img.url)}
                    className={cn(
                      'group relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 transition-all hover:scale-105',
                      selectedUrl === img.url
                        ? 'border-primary ring-primary ring-2 ring-offset-2'
                        : 'hover:border-primary/50 border-transparent'
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.projectTitle}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    {selectedUrl === img.url && (
                      <div className="bg-primary/20 absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary rounded-full p-1 text-white shadow-sm">
                          <Check size={16} />
                        </div>
                      </div>
                    )}
                    <div className="absolute right-0 bottom-0 left-0 truncate bg-black/60 p-1 text-center text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {img.projectTitle}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <p>No hay proyectos con imágenes en esta categoría.</p>
                <p className="text-sm">Sube una imagen nueva o agrega proyectos primero.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card className="p-6">
            <ImageUpload
              name="coverImageUpload" // Temporary name, we handle value via onSelect
              label="Subir Imagen de Portada"
              folder="categories"
              maxFiles={1}
              onChange={(urls) => {
                if (urls.length > 0) handleSelect(urls[0])
              }}
            />
            <p className="text-muted-foreground mt-2 text-center text-xs">
              Esta imagen se subirá independientemente y no estará vinculada a ningún proyecto.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
