'use client'

import { HomeSettingsData } from '@/actions/settings/home'
import { HeroContent } from './HeroContent'
import type { EditableElement } from '../visual-editor/types'

interface HeroPreviewProps {
  settings: HomeSettingsData | null
  selectedElement: EditableElement
  onSelectElement: (element: EditableElement) => void
}

/**
 * Editor Hero Preview
 * Simply wraps the Shared HeroContent in "Editor Mode"
 */
export function HeroPreview({ settings, selectedElement, onSelectElement }: HeroPreviewProps) {
  return (
    <HeroContent
      settings={settings}
      isEditor={true}
      selectedElement={selectedElement}
      onSelectElement={onSelectElement}
    />
  )
}
