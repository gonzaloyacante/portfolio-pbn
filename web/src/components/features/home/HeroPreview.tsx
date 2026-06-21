'use client'

import { HomeSettingsData } from '@/actions/settings/home'
import { HeroContent } from './HeroContent'
import { HeroEditorShell } from './HeroEditorShell'
import { HomePreviewNavbar } from './HomePreviewNavbar'
import type { EditableElement } from '../visual-editor/types'
import type { ViewportMode } from '../visual-editor/types'

interface HeroPreviewProps {
  settings: HomeSettingsData | null
  selectedElement: EditableElement
  onSelectElement: (element: EditableElement) => void
  forceViewportMode?: ViewportMode
  onUpdate?: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  viewportMode?: ViewportMode
}

/**
 * Editor Hero Preview. Envuelve el HeroContent con el HeroEditorShell
 * (que tiene el backdrop con la misma estructura que la pública).
 * El HomePreviewNavbar se renderiza como sibling (overlay absolute) sobre el hero.
 */
export function HeroPreview({
  settings,
  selectedElement,
  onSelectElement,
  forceViewportMode,
  onUpdate,
  viewportMode,
}: HeroPreviewProps) {
  return (
    // `public-fixed-theme` define las CSS variables públicas (--public-makeup,
    // --public-portfolio, --public-owner-name, etc.) localmente para que las clases
    // .public-hero-title-* y .public-navbar-* se vean IGUAL que en la home pública.
    // Sin este wrapper, las variables quedan undefined y los items caen a negro heredado.
    <div className="public-fixed-theme relative h-full w-full">
      <HeroEditorShell settings={settings}>
        <HeroContent
          settings={settings}
          isEditor={true}
          selectedElement={selectedElement}
          onSelectElement={onSelectElement}
          forceViewportMode={forceViewportMode}
          onUpdate={onUpdate}
          viewportMode={viewportMode}
        />
      </HeroEditorShell>
      <HomePreviewNavbar settings={settings} />
    </div>
  )
}
