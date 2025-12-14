'use client'

import { type ThemeSettingsGrouped } from '@/actions/theme.actions'
import { updateMultipleThemeSettings, resetThemeToDefaults } from '@/actions/theme.actions'
import { ThemeSettingInput } from './ThemeSettingInput'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ThemeEditorProps {
  initialSettings: ThemeSettingsGrouped
}

export function ThemeEditor({ initialSettings }: ThemeEditorProps) {
  const router = useRouter()
  const [settings] = useState(initialSettings)
  const [changes, setChanges] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleChange = (key: string, value: string) => {
    setChanges((prev) => ({ ...prev, [key]: value }))
  }

  const hasChanges = Object.keys(changes).length > 0

  const handleSave = async () => {
    if (!hasChanges) return

    setIsSaving(true)
    setSaveMessage('')

    try {
      const settingsArray = Object.entries(changes).map(([key, value]) => ({ key, value }))
      const result = await updateMultipleThemeSettings(settingsArray)

      if (result.success) {
        setSaveMessage('✅ Cambios guardados correctamente')
        setChanges({})
        router.refresh()
      } else {
        setSaveMessage('❌ Error al guardar cambios')
      }
    } catch (error) {
      console.error('Error saving:', error)
      setSaveMessage('❌ Error al guardar cambios')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleReset = async () => {
    if (
      !confirm(
        '¿Estás segura de que quieres resetear TODOS los valores a los originales del diseño de Canva? Esta acción no se puede deshacer.'
      )
    ) {
      return
    }

    setIsResetting(true)
    setSaveMessage('')

    try {
      const result = await resetThemeToDefaults()

      if (result.success) {
        setSaveMessage('✅ Tema reseteado correctamente')
        setChanges({})
        router.refresh()
      } else {
        setSaveMessage('❌ Error al resetear tema')
      }
    } catch (error) {
      console.error('Error resetting:', error)
      setSaveMessage('❌ Error al resetear tema')
    } finally {
      setIsResetting(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const getCurrentValue = (key: string, originalValue: string) => {
    return changes[key] ?? originalValue
  }

  return (
    <div className="space-y-8">
      {/* Header con botones de acción */}
      <div className="sticky top-0 z-10 -mx-6 -mt-6 bg-white px-6 py-4 shadow-sm dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editor de Tema</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personaliza completamente el diseño de tu portfolio
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saveMessage && <span className="text-sm font-medium">{saveMessage}</span>}
            {hasChanges && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                {Object.keys(changes).length} cambio{Object.keys(changes).length !== 1 ? 's' : ''}{' '}
                sin guardar
              </span>
            )}
            <button
              onClick={handleReset}
              disabled={isResetting || isSaving}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {isResetting ? 'Reseteando...' : 'Resetear a Diseño Original'}
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>

      {/* Secciones de configuración */}
      <div className="space-y-8">
        {/* COLORES */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">🎨 Colores</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {settings.colors.map((setting) => (
              <ThemeSettingInput
                key={setting.key}
                setting={setting}
                value={getCurrentValue(setting.key, setting.value)}
                onChange={handleChange}
              />
            ))}
          </div>
        </section>

        {/* TIPOGRAFÍA */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            ✍️ Tipografía
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {settings.typography.map((setting) => (
              <ThemeSettingInput
                key={setting.key}
                setting={setting}
                value={getCurrentValue(setting.key, setting.value)}
                onChange={handleChange}
              />
            ))}
          </div>
        </section>

        {/* ESPACIADO */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">📏 Espaciado</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {settings.spacing.map((setting) => (
              <ThemeSettingInput
                key={setting.key}
                setting={setting}
                value={getCurrentValue(setting.key, setting.value)}
                onChange={handleChange}
              />
            ))}
          </div>
        </section>

        {/* LAYOUT */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">📐 Layout</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {settings.layout.map((setting) => (
              <ThemeSettingInput
                key={setting.key}
                setting={setting}
                value={getCurrentValue(setting.key, setting.value)}
                onChange={handleChange}
              />
            ))}
          </div>
        </section>

        {/* EFECTOS */}
        {settings.effects.length > 0 && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              ✨ Efectos y Animaciones
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {settings.effects.map((setting) => (
                <ThemeSettingInput
                  key={setting.key}
                  setting={setting}
                  value={getCurrentValue(setting.key, setting.value)}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
