import { HomeSettingsData } from '@/actions/settings/home'
import type { EditableElement, ViewportMode } from '../visual-editor/types'

export interface HeroContentProps {
  settings: HomeSettingsData | null
  isEditor?: boolean
  selectedElement?: EditableElement
  onSelectElement?: (element: EditableElement) => void
  forceViewportMode?: ViewportMode
  onUpdate?: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  viewportMode?: ViewportMode
}

export interface WrapperProps {
  children: React.ReactNode
  id: EditableElement
  isEditor: boolean
  selectedElement?: EditableElement
  onSelectElement?: (id: EditableElement) => void
  className?: string
  style?: React.CSSProperties
  enableDrag?: boolean
  onElementDrag?: (deltaX: number, deltaY: number) => void
  onDragEnd?: (deltaX: number, deltaY: number) => void
}

export interface HeroSectionProps {
  s: Partial<HomeSettingsData>
  isEditor: boolean
  selectedElement?: EditableElement
  onSelectElement?: (id: EditableElement) => void
  viewportMode: ViewportMode
  enableDrag?: boolean
  onDragEnd?: (deltaX: number, deltaY: number) => void
  elementId?:
    | 'heroTitle1'
    | 'heroTitle2'
    | 'ownerName'
    | 'heroMainImage'
    | 'illustration'
    | 'ctaButton'
}
