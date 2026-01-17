'use client'

import {
  ThemeSettingsData,
  updateThemeSettings,
  resetThemeToDefaults,
} from '@/actions/theme.actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useForm, UseFormRegister, FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { themeEditorSchema, type ThemeEditorData } from '@/lib/validations'
import { useToast } from '@/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'

interface ThemeEditorProps {
  initialSettings: ThemeSettingsData | null
}

const lightColorFields = [
  { key: 'primaryColor', label: 'Primario', description: 'Color principal de marca' },
  {
    key: 'secondaryColor',
    label: 'Secundario',
    description: 'Color de fondo secundario/decorativo',
  },
  { key: 'accentColor', label: 'Acento', description: 'Color para destacar elementos' },
  { key: 'backgroundColor', label: 'Fondo', description: 'Fondo principal del sitio' },
  { key: 'textColor', label: 'Texto', description: 'Color del texto principal' },
  { key: 'cardBgColor', label: 'Cards', description: 'Fondo de tarjetas' },
] as const

const darkColorFields = [
  {
    key: 'darkPrimaryColor',
    label: 'Primario (Dark)',
    description: 'Color principal en modo oscuro',
  },
  {
    key: 'darkSecondaryColor',
    label: 'Secundario (Dark)',
    description: 'Secundario en modo oscuro',
  },
  { key: 'darkAccentColor', label: 'Acento (Dark)', description: 'Acento en modo oscuro' },
  { key: 'darkBackgroundColor', label: 'Fondo (Dark)', description: 'Fondo principal oscuro' },
  { key: 'darkTextColor', label: 'Texto (Dark)', description: 'Texto claro sobre fondo oscuro' },
  { key: 'darkCardBgColor', label: 'Cards (Dark)', description: 'Fondo de tarjetas en oscuro' },
] as const

const typographyFields = [
  { key: 'headingFont', label: 'Títulos', description: 'Fuente para encabezados (Google Fonts)' },
  { key: 'scriptFont', label: 'Script/Firma', description: 'Fuente cursiva para detalles' },
  { key: 'bodyFont', label: 'Cuerpo', description: 'Fuente para texto general' },
] as const

export function ThemeEditor({ initialSettings }: ThemeEditorProps) {
  const router = useRouter()
  const { show } = useToast()
  const [isResetting, setIsResetting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ThemeEditorData>({
    resolver: zodResolver(themeEditorSchema),
    defaultValues: {
      // Light
      primaryColor: initialSettings?.primaryColor || '#6c0a0a',
      secondaryColor: initialSettings?.secondaryColor || '#ffaadd',
      accentColor: initialSettings?.accentColor || '#fff1f9',
      backgroundColor: initialSettings?.backgroundColor || '#fff1f9',
      textColor: initialSettings?.textColor || '#000000',
      cardBgColor: initialSettings?.cardBgColor || '#ffaadd',
      // Dark
      darkPrimaryColor: initialSettings?.darkPrimaryColor || '#ffaadd',
      darkSecondaryColor: initialSettings?.darkSecondaryColor || '#6c0a0a',
      darkAccentColor: initialSettings?.darkAccentColor || '#000000',
      darkBackgroundColor: initialSettings?.darkBackgroundColor || '#6c0a0a',
      darkTextColor: initialSettings?.darkTextColor || '#fff1f9',
      darkCardBgColor: initialSettings?.darkCardBgColor || '#ffaadd',
      // Fonts
      headingFont: initialSettings?.headingFont || 'Poppins',
      scriptFont: initialSettings?.scriptFont || 'Great Vibes',
      bodyFont: initialSettings?.bodyFont || 'Open Sans',
      borderRadius: initialSettings?.borderRadius || 40,
    },
  })

  // Watch for live feedback if implemented later
  watch()

  const onSubmit = async (data: ThemeEditorData) => {
    try {
      const result = await updateThemeSettings(data)

      if (result.success) {
        show({ type: 'success', message: 'Tema actualizado correctamente' })
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
    if (!confirm('¿Resetear a los colores por defecto?')) return

    setIsResetting(true)
    try {
      const result = await resetThemeToDefaults()
      if (result.success) {
        show({ type: 'success', message: 'Tema reseteado' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al resetear' })
      }
    } catch (error) {
      console.error(error)
      show({ type: 'error', message: 'Error al resetear' })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header Sticky */}
      <div className="sticky top-0 z-10 -mx-6 -mt-6 bg-white/80 px-6 py-4 backdrop-blur-md dark:bg-gray-900/80">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editor de Tema</h1>
            <p className="text-sm text-gray-500">Personaliza la apariencia global</p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isResetting || isSubmitting}
            >
              Resetear
            </Button>
            <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="light" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="light">☀️ Claro</TabsTrigger>
          <TabsTrigger value="dark">🌙 Oscuro</TabsTrigger>
          <TabsTrigger value="typography">Aa Tipografía</TabsTrigger>
        </TabsList>

        {/* LIGHT MODE TAB */}
        <TabsContent value="light" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lightColorFields.map((field) => (
              <ColorInput
                key={field.key}
                label={field.label}
                description={field.description}
                name={field.key}
                register={register}
                error={errors[field.key as keyof ThemeEditorData]}
              />
            ))}
          </div>
        </TabsContent>

        {/* DARK MODE TAB */}
        <TabsContent value="dark" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {darkColorFields.map((field) => (
              <ColorInput
                key={field.key}
                label={field.label}
                description={field.description}
                name={field.key}
                register={register}
                error={errors[field.key as keyof ThemeEditorData]}
              />
            ))}
          </div>
        </TabsContent>

        {/* TYPOGRAPHY TAB */}
        <TabsContent value="typography" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {typographyFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                <Input {...register(field.key as keyof ThemeEditorData)} />
                <p className="text-xs text-gray-500">{field.description}</p>
                {errors[field.key as keyof ThemeEditorData] && (
                  <span className="text-xs text-red-500">
                    {errors[field.key as keyof ThemeEditorData]?.message}
                  </span>
                )}
              </div>
            ))}

            {/* Border Radius */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Radio de Borde (px)</label>
              <Input type="number" {...register('borderRadius', { valueAsNumber: true })} />
              <p className="text-xs text-gray-500">Redondez de las tarjetas (ej. 40)</p>
              {errors.borderRadius && (
                <span className="text-xs text-red-500">{errors.borderRadius.message}</span>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}

interface ColorInputProps {
  label: string
  description: string
  name: keyof ThemeEditorData
  register: UseFormRegister<ThemeEditorData>
  error?: FieldError
}

function ColorInput({ label, description, name, register, error }: ColorInputProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</label>
        <input
          type="color"
          {...register(name)}
          className="h-8 w-8 cursor-pointer rounded border-none bg-transparent p-0"
        />
      </div>
      <Input {...register(name)} className="font-mono text-sm" />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}
