'use client'

import { HomeSettingsData, updateHomeSettings } from '@/actions/settings/home'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui'
import { showToast } from '@/lib/toast'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { VisualEditorLayout } from '../visual-editor/VisualEditorLayout'
import { HeroPreview } from './HeroPreview'
import { PropertyPanel } from '../visual-editor/PropertyPanel'
import type { EditableElement, ViewportMode, Orientation } from '../visual-editor/types'
import { Save } from 'lucide-react'

interface HomeEditorProps {
  settings: HomeSettingsData | null
}

export function HomeEditor({ settings: initialSettings }: HomeEditorProps) {
  const router = useRouter()
  const [selectedElement, setSelectedElement] = useState<EditableElement>(null)
  const [settings, setSettings] = useState<HomeSettingsData | null>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop')
  const [orientation, setOrientation] = useState<Orientation>('landscape')
  const savedBaselineRef = useRef<HomeSettingsData | null>(initialSettings)

  useUnsavedChanges(isDirty)

  // ✅ TYPE-SAFE UPDATE con generics
  const handleUpdate = <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => {
    setIsDirty(true)
    setSettings((prev) => {
      if (!prev) return null
      return { ...prev, [field]: value }
    })
  }

  const handleSave = async () => {
    if (!settings) return

    const baseline = savedBaselineRef.current ?? {}
    const diff = Object.fromEntries(
      Object.entries(settings).filter(
        ([key, val]) => key !== 'id' && val !== (baseline as Record<string, unknown>)[key]
      )
    ) as Partial<HomeSettingsData>

    // 🎯 FIX (paridad con AboutEditor): el diff contra el baseline puede
    // quedarse vacío si el `savedBaselineRef` se desincroniza (ej: el padre
    // re-renderiza con settings nuevos sin que se haya guardado el valor
    // previo). Si `isDirty === true` pero `diff` está vacío, significa que
    // SÍ hay cambios y debemos enviar el payload completo como fallback.
    const payload = Object.keys(diff).length === 0 && isDirty ? settings : diff

    if (Object.keys(payload).length === 0) {
      setIsDirty(false)
      showToast.info('No hay cambios para guardar')
      return
    }

    setIsSaving(true)
    try {
      const result = await updateHomeSettings(payload)
      if (result.success) {
        savedBaselineRef.current = settings
        setIsDirty(false)
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Visual Editor - Inicio</h2>
          <p className="text-muted-foreground text-sm">
            Haz clic en cualquier elemento para editarlo
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          size="lg"
          aria-disabled={isSaving || !isDirty}
        >
          <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Visual Editor */}
      <VisualEditorLayout
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
        orientation={orientation}
        onOrientationChange={setOrientation}
        onPreviewBackgroundClick={() => setSelectedElement(null)}
        headerAction={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSelectedElement('heroBackdrop')}
          >
            Editar fondo y sombras
          </Button>
        }
        preview={
          <HeroPreview
            settings={settings}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            forceViewportMode={viewportMode}
            onUpdate={handleUpdate}
            viewportMode={viewportMode}
          />
        }
        propertyPanel={
          <PropertyPanel
            selectedElement={selectedElement}
            settings={settings}
            onUpdate={handleUpdate}
            viewportMode={viewportMode}
          />
        }
      />
    </div>
  )
}
