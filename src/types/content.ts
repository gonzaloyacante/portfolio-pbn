/**
 * Tipos para el contenido dinámico de páginas (JSON en DB)
 */

export interface AboutPageContent {
  title?: string
  bio?: string
  ownerName?: string
  showImage?: boolean
  imagePosition?: 'left' | 'right'
  imageUrl?: string
}

export type PageContentJson = AboutPageContent | Record<string, unknown>

export interface ExtendedPageContent {
  id: string
  pageKey: string
  sectionKey: string
  content: string // JSON string
  parsedContent?: PageContentJson
}
