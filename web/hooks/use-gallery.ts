import useSWR from 'swr'
import { galleryService } from '@/lib/services/gallery'
import type { GalleryImage } from '@/models/GalleryImage'

export function useGallery() {
  const { data, error, isLoading, mutate } = useSWR<GalleryImage[]>(
    ['gallery:list'],
    () => galleryService.list()
  )
  return { gallery: data ?? [], isLoading, error, mutate }
}
