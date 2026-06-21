export type EditableElement =
  | 'heroBackdrop'
  | 'heroTitle1'
  | 'heroTitle2'
  | 'ownerName'
  | 'heroMainImage'
  | 'illustration'
  | 'ctaButton'
  | 'featuredTitle'
  | null

export type ViewportMode = 'desktop' | 'tablet' | 'mobile'

export type Orientation = 'landscape' | 'portrait'

export interface VisualEditorProps {
  selectedElement: EditableElement
  onSelectElement: (element: EditableElement) => void
}
