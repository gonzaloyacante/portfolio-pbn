// Shared types for the category gallery feature

export interface GalleryImage {
  id: string
  url: string
  alt: string
  title: string
  width?: number | null
  height?: number | null
  isFeatured?: boolean
  categoryGalleryOrder?: number | null
}

export interface GalleryCoverImage {
  id: string
  url: string
  publicId: string
}
