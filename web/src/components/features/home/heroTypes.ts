import { HomeSettingsData } from '@/actions/settings/home'
import { EditableElement } from '../visual-editor/types'

export interface HeroContentProps {
  settings: HomeSettingsData | null
  isEditor?: boolean
  selectedElement?: EditableElement
  onSelectElement?: (element: EditableElement) => void
  forceIsMobile?: boolean
}

export interface WrapperProps {
  children: React.ReactNode
  id: EditableElement
  isEditor: boolean
  selectedElement?: EditableElement
  onSelectElement?: (id: EditableElement) => void
  className?: string
  style?: React.CSSProperties
}

export interface HeroSectionProps {
  s: Partial<HomeSettingsData>
  isEditor: boolean
  selectedElement?: EditableElement
  onSelectElement?: (id: EditableElement) => void
  isMobile: boolean
}
