'use client'

import { Card } from '@/components/ui'
import type { HomeSettingsData } from '@/actions/settings/home'
import type { EditableElement } from './types'
import { Info } from 'lucide-react'
import { PropertyEditor } from './PropertyEditor'

interface PropertyPanelProps {
  selectedElement: EditableElement
  settings: HomeSettingsData | null
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
}

/**
 * Property Panel Component
 * Displays editable properties for selected visual elements
 */
export function PropertyPanel({ selectedElement, settings, onUpdate }: PropertyPanelProps) {
  if (!selectedElement || !settings) {
    return (
      <Card className="flex h-[200px] items-center justify-center p-6">
        <div className="text-muted-foreground flex flex-col items-center gap-2">
          <Info className="h-8 w-8" />
          <p className="text-sm">Selecciona un elemento para editar sus propiedades</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Propiedades</h3>
      <PropertyEditor element={selectedElement} settings={settings} onUpdate={onUpdate} />
    </Card>
  )
}
