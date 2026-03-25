export type EditableElement =
  | 'heroTitle1'
  | 'heroTitle2'
  | 'ownerName'
  | 'heroMainImage'
  | 'illustration'
  | 'ctaButton'
  | 'featuredTitle'
  | null

export type ViewportMode = 'desktop' | 'tablet' | 'mobile'

export interface VisualEditorProps {
  selectedElement: EditableElement
  onSelectElement: (element: EditableElement) => void
}
