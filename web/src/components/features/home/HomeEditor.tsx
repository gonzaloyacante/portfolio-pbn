'use client'

import { HomeSettingsData, updateHomeSettings } from '@/actions/settings/home'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { showToast } from '@/lib/toast'
import { VisualEditorLayout } from '../visual-editor/VisualEditorLayout'
import { HeroPreview } from './HeroPreview'
import { PropertyPanel } from '../visual-editor/PropertyPanel'
import type { EditableElement } from '../visual-editor/types'
import { Save } from 'lucide-react'

interface HomeEditorProps {
  settings: HomeSettingsData | null
}

export function HomeEditor({ settings: initialSettings }: HomeEditorProps) {
  const router = useRouter()
  const [selectedElement, setSelectedElement] = useState<EditableElement>(null)
  const [settings, setSettings] = useState<HomeSettingsData | null>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  // ✅ TYPE-SAFE UPDATE con generics
  const handleUpdate = <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => {
    setSettings((prev) => {
      if (!prev) return null
      return { ...prev, [field]: value }
    })
  }

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const result = await updateHomeSettings(settings)
      if (result.success) {
        showToast.success('Cambios guardados correctamente')
        router.refresh()
      } else {
        showToast.error(result.error || 'Error al guardar')
      }
    } catch {
      showToast.error('Error inesperado')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header con botón guardar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Visual Editor - Inicio</h2>
          <p className="text-muted-foreground text-sm">
            Haz clic en cualquier elemento para editarlo
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Visual Editor */}
      <VisualEditorLayout
        preview={
          <HeroPreview
            settings={settings}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
          />
        }
        propertyPanel={
          <PropertyPanel
            selectedElement={selectedElement}
            settings={settings}
            onUpdate={handleUpdate}
          />
        }
      />
    </div>
  )
}
