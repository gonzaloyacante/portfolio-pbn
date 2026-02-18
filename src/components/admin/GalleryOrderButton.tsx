'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui'
import { GripVertical } from 'lucide-react'

const GalleryOrderModal = dynamic(() => import('@/components/admin/GalleryOrderModal'), {
  ssr: false,
  loading: () => null,
})

interface GalleryImage {
  id: string
  url: string
  width?: number | null
  height?: number | null
  title: string
  projectSlug: string
}

interface GalleryOrderButtonProps {
  categoryId: string
  categoryName: string
}

export default function GalleryOrderButton({ categoryId, categoryName }: GalleryOrderButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenModal = async () => {
    setIsLoading(true)

    try {
      // Fetch all images from this category
      const response = await fetch(`/api/categories/${categoryId}/images`)
      const data = await response.json()

      if (data.success) {
        setImages(data.images)
        setShowModal(true)
      }
    } catch (error) {
      console.error('[GalleryOrderButton] Error loading images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={handleOpenModal} disabled={isLoading} className="gap-2">
        <GripVertical className="h-4 w-4" />
        {isLoading ? 'Cargando...' : 'Ordenar Galería'}
      </Button>

      {showModal && (
        <GalleryOrderModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          categoryId={categoryId}
          categoryName={categoryName}
          images={images}
        />
      )}
    </>
  )
}
