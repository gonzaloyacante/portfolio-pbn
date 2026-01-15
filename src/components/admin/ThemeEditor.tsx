'use client'

import {
  ThemeSettingsData,
  updateThemeSettings,
  resetThemeToDefaults,
} from '@/actions/theme.actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { themeEditorSchema, type ThemeEditorData } from '@/lib/validations'
import { useToast } from '@/components/ui/Toast'

interface ThemeEditorProps {
  initialSettings: ThemeSettingsData | null
}

const colorFields = [
  { key: 'primaryColor', label: 'Color Primario', description: 'Color principal de marca' },
  { key: 'secondaryColor', label: 'Color Secundario', description: 'Color de fondo secundario' },
  { key: 'accentColor', label: 'Color Acento', description: 'Color de acentos y CTAs' },
  { key: 'backgroundColor', label: 'Color de Fondo', description: 'Fondo principal del sitio' },
  { key: 'textColor', label: 'Color de Texto', description: 'Color del texto principal' },
] as const

const typographyFields = [
  { key: 'headingFont', label: 'Fuente de Títulos', description: 'Tipografía para encabezados' },
  { key: 'bodyFont', label: 'Fuente del Cuerpo', description: 'Tipografía para el texto general' },
] as const

export function ThemeEditor({ initialSettings }: ThemeEditorProps) {
  const router = useRouter()
  const { show } = useToast()
  const [isResetting, setIsResetting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ThemeEditorData>({
    resolver: zodResolver(themeEditorSchema),
    defaultValues: {
      primaryColor: initialSettings?.primaryColor || '#c71585',
      secondaryColor: initialSettings?.secondaryColor || '#f0f0f0',
      accentColor: initialSettings?.accentColor || '#ff69b4',
      backgroundColor: initialSettings?.backgroundColor || '#ffffff',
      textColor: initialSettings?.textColor || '#1a1a1a',
      headingFont: initialSettings?.headingFont || 'Raleway',
      bodyFont: initialSettings?.bodyFont || 'Open Sans',
      borderRadius: initialSettings?.borderRadius || 8,
    },
  })

  // Watch values for live preview (color pickers need value binding)
  const formValues = watch()

  const onSubmit = async (data: ThemeEditorData) => {
    try {
      const result = await updateThemeSettings(data)

      if (result.success) {
        show({ type: 'success', message: 'Cambios guardados correctamente' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al guardar cambios' })
      }
    } catch (error) {
      console.error('Error saving:', error)
      show({ type: 'error', message: 'Error inesperado al guardar' })
    }
  }

  const handleReset = async () => {
    if (
      !confirm('¿Estás segura de que quieres resetear todos los valores a los predeterminados?')
    ) {
      return
    }

    setIsResetting(true)
    try {
      const result = await resetThemeToDefaults()

      if (result.success) {
        // Update local form state to defaults
        setValue('primaryColor', '#c71585')
        setValue('secondaryColor', '#f0f0f0')
        setValue('accentColor', '#ff69b4')
        setValue('backgroundColor', '#ffffff')
        setValue('textColor', '#1a1a1a')
        setValue('headingFont', 'Raleway')
        setValue('bodyFont', 'Open Sans')
        setValue('borderRadius', 8)

        show({ type: 'success', message: 'Tema reseteado correctamente' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al resetear tema' })
      }
    } catch (error) {
      console.error('Error resetting:', error)
      show({ type: 'error', message: 'Error inesperado al resetear' })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="sticky top-0 z-10 -mx-6 -mt-6 bg-white px-6 py-4 shadow-sm dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editor de Tema</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personaliza el diseño de tu portfolio
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={handleReset}
              disabled={isResetting || isSubmitting}
              variant="outline"
            >
              {isResetting ? 'Reseteando...' : 'Resetear'}
            </Button>
            <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>

      {/* Color Settings */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">🎨 Colores</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {colorFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  {...register(field.key)}
                  className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                />
                <div className="flex-1">
                  <Input {...register(field.key)} />
                  {errors[field.key] && (
                    <p className="mt-1 text-xs text-red-500">{errors[field.key]?.message}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">{field.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Settings */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">✍️ Tipografía</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {typographyFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
              <Input {...register(field.key)} />
              {errors[field.key] && (
                <p className="mt-1 text-xs text-red-500">{errors[field.key]?.message}</p>
              )}
              <p className="text-xs text-gray-500">{field.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layout Settings */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">📐 Layout</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Radio de Borde
            </label>
            <Input type="number" {...register('borderRadius', { valueAsNumber: true })} />
            {errors.borderRadius && (
              <p className="mt-1 text-xs text-red-500">{errors.borderRadius.message}</p>
            )}
            <p className="text-xs text-gray-500">Redondez de las esquinas en píxeles</p>
          </div>
        </div>
      </section>
    </form>
  )
}
