export type EditableElement =
  | 'heroTitle1'
  | 'heroTitle2'
  | 'ownerName'
  | 'heroMainImage'
  | 'illustration'
  | 'ctaButton'
  | 'featuredTitle'
  | null

export interface VisualEditorProps {
  selectedElement: EditableElement
  onSelectElement: (element: EditableElement) => void
}
