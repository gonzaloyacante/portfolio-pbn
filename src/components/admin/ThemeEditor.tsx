'use client'

import {
  ThemeSettingsData,
  updateThemeSettings,
  resetThemeToDefaults,
} from '@/actions/theme.actions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useForm, UseFormRegister, FieldError, FieldErrors } from 'react-hook-form'
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
      // Fonts Base
      headingFont: initialSettings?.headingFont || 'Poppins',
      headingFontUrl: initialSettings?.headingFontUrl,
      scriptFont: initialSettings?.scriptFont || 'Great Vibes',
      scriptFontUrl: initialSettings?.scriptFontUrl,
      bodyFont: initialSettings?.bodyFont || 'Open Sans',
      bodyFontUrl: initialSettings?.bodyFontUrl,
      // Fonts Brand
      brandFont: initialSettings?.brandFont || 'Saira Extra Condensed',
      brandFontUrl: initialSettings?.brandFontUrl,
      portfolioFont: initialSettings?.portfolioFont || 'Saira Extra Condensed',
      portfolioFontUrl: initialSettings?.portfolioFontUrl,
      signatureFont: initialSettings?.signatureFont || 'Dawning of a New Day',
      signatureFontUrl: initialSettings?.signatureFontUrl,
      // Layout
      borderRadius: initialSettings?.borderRadius || 40,
    },
  })

  // Live preview: Apply colors in real-time
  const watchedColors = watch([
    'primaryColor',
    'secondaryColor',
    'accentColor',
    'backgroundColor',
    'textColor',
    'cardBgColor',
    'darkPrimaryColor',
    'darkSecondaryColor',
    'darkAccentColor',
    'darkBackgroundColor',
    'darkTextColor',
    'darkCardBgColor',
  ])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    // We cannot easily know 'resolvedTheme' inside this effect without reading from hook or DOM
    // But since this is a preview, we can apply variables based on specific class .dark if present
    // OR, better yet, we just apply them all but we need to respect how usage works.

    // Actually, ThemeEditor preview needs to start assuming we are editing what we see.
    // If the user is in Dark Mode, they see Dark Colors changes.
    // The Preview Section has hardcoded styles so that's fine.

    // BUT the global page Preview (what surrounds the form) reflects the current theme.
    // So we should try to detect current theme or just update the variable that matches the current class.

    const isDark = root.classList.contains('dark')

    if (isDark) {
      root.style.setProperty('--primary', watchedColors[6] || '#fb7185') // darkPrimary
      root.style.setProperty('--secondary', watchedColors[7] || '#881337')
      root.style.setProperty('--accent', watchedColors[8] || '#2a1015')
      root.style.setProperty('--background', watchedColors[9] || '#0f0505')
      root.style.setProperty('--foreground', watchedColors[10] || '#fafafa')
      root.style.setProperty('--card', watchedColors[11] || '#1c0a0f')
    } else {
      root.style.setProperty('--primary', watchedColors[0] || '#6c0a0a')
      root.style.setProperty('--secondary', watchedColors[1] || '#ffaadd')
      root.style.setProperty('--accent', watchedColors[2] || '#fff1f9')
      root.style.setProperty('--background', watchedColors[3] || '#fff1f9')
      root.style.setProperty('--foreground', watchedColors[4] || '#000000')
      root.style.setProperty('--card', watchedColors[5] || '#ffaadd')
    }
  }, [watchedColors])

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
      <div className="bg-background/80 sticky top-0 z-10 -mx-6 -mt-6 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Editor de Tema</h1>
            <p className="text-muted-foreground text-sm">Personaliza la apariencia global</p>
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

      {/* Live Preview Info */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <div className="flex items-start gap-3">
          <span className="text-2xl">👁️</span>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Vista Previa en Tiempo Real
            </p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
              Los cambios se aplican instantáneamente mientras editas. Recuerda hacer click en
              &quot;Guardar Cambios&quot; para persistir los colores en toda la aplicación.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="typography" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="light">☀️ Claro</TabsTrigger>
          <TabsTrigger value="dark">🌙 Oscuro</TabsTrigger>
          <TabsTrigger value="typography">Aa Tipografía</TabsTrigger>
        </TabsList>

        {/* LIGHT MODE TAB */}
        <TabsContent value="light" className="space-y-6">
          {/* Preview Section */}
          <div className="bg-muted/50 border-border mb-8 rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-semibold">Vista Previa</h3>
            <div className="flex flex-wrap gap-4">
              <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 shadow-sm">
                Botón Primario
              </div>
              <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 shadow-sm">
                Secundario
              </div>
              <div className="bg-accent text-accent-foreground rounded-lg px-4 py-2 shadow-sm">
                Acento
              </div>
              <div className="bg-card text-card-foreground border-border rounded-lg border px-4 py-2 shadow-sm">
                Tarjeta
              </div>
            </div>
          </div>

          {/* Color Grid */}
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
          {/* Preview Section */}
          <div className="bg-muted/50 border-border mb-8 rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-semibold">Vista Previa (Modo Oscuro)</h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Activa el modo oscuro en tu tema para ver estos colores en acción
            </p>
            <div className="flex flex-wrap gap-4">
              <div
                className="rounded-lg px-4 py-2 shadow-sm"
                style={{ backgroundColor: watchedColors[6], color: watchedColors[10] }}
              >
                Primario Oscuro
              </div>
              <div
                className="rounded-lg px-4 py-2 shadow-sm"
                style={{ backgroundColor: watchedColors[7], color: watchedColors[10] }}
              >
                Secundario
              </div>
              <div
                className="rounded-lg px-4 py-2 shadow-sm"
                style={{ backgroundColor: watchedColors[8], color: watchedColors[10] }}
              >
                Acento
              </div>
            </div>
          </div>

          {/* Color Grid */}
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
        <TabsContent value="typography" className="space-y-8">
          {/* Base Typography */}
          <section className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">Fuentes Base</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <FontField
                label="Títulos (Heading)"
                description="Fuente para H1, H2, H3. Ej: Poppins"
                fontKey="headingFont"
                urlKey="headingFontUrl"
                register={register}
                errors={errors}
              />
              <FontField
                label="Cuerpo (Body)"
                description="Fuente para texto general. Ej: Open Sans"
                fontKey="bodyFont"
                urlKey="bodyFontUrl"
                register={register}
                errors={errors}
              />
              <FontField
                label="Script / Detalles"
                description="Fuente cursiva para adornos. Ej: Great Vibes"
                fontKey="scriptFont"
                urlKey="scriptFontUrl"
                register={register}
                errors={errors}
              />
            </div>
          </section>

          {/* Brand Typography */}
          <section className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">Fuentes de Marca</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <FontField
                label="Marca 'Make-up'"
                description="Texto grande en Hero. Ej: Saira Extra Condensed"
                fontKey="brandFont"
                urlKey="brandFontUrl"
                register={register}
                errors={errors}
              />
              <FontField
                label="Palabra 'PORTFOLIO'"
                description="Subtítulo principal. Ej: Saira Extra Condensed"
                fontKey="portfolioFont"
                urlKey="portfolioFontUrl"
                register={register}
                errors={errors}
              />
              <FontField
                label="Firma 'Paola Bolívar'"
                description="Firma personal en About/Hero. Ej: Dawning of a New Day"
                fontKey="signatureFont"
                urlKey="signatureFontUrl"
                register={register}
                errors={errors}
              />
            </div>
          </section>

          {/* Border Radius */}
          <div className="max-w-xs space-y-2">
            <label className="text-sm font-medium">Radio de Borde (px)</label>
            <Input type="number" {...register('borderRadius', { valueAsNumber: true })} />
            <p className="text-xs text-gray-500">Redondez de las tarjetas (ej. 40)</p>
            {errors.borderRadius && (
              <span className="text-xs text-red-500">{errors.borderRadius.message}</span>
            )}
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
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent, value: string) => {
    e.preventDefault()
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-border bg-card group relative rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <label className="text-foreground mb-1 block text-sm font-medium">{label}</label>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        <input
          type="color"
          {...register(name)}
          className="border-border h-12 w-12 cursor-pointer rounded-lg border-2 bg-transparent transition-transform hover:scale-110"
        />
      </div>

      <div className="relative">
        <Input {...register(name)} className="pr-20 font-mono text-sm" />
        <button
          type="button"
          onClick={(e) =>
            handleCopy(
              e,
              (document.querySelector(`input[name="${name}"]`) as HTMLInputElement)?.value || ''
            )
          }
          className="bg-muted hover:bg-muted-foreground/10 absolute top-1/2 right-2 -translate-y-1/2 rounded px-2 py-1 text-xs transition-colors"
        >
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>

      {error && <p className="text-destructive mt-2 text-xs">{error.message}</p>}

      {/* Live preview swatch */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className="border-border h-8 w-16 rounded border-2"
          style={{
            backgroundColor: `var(--${name
              .replace('Color', '')
              .replace(/([A-Z])/g, '-$1')
              .toLowerCase()})`,
          }}
        />
        <span className="text-muted-foreground text-xs">Vista previa</span>
      </div>
    </div>
  )
}

interface FontFieldProps {
  label: string
  description: string
  fontKey: keyof ThemeEditorData
  urlKey: keyof ThemeEditorData
  register: UseFormRegister<ThemeEditorData>
  errors: FieldErrors<ThemeEditorData>
}

function FontField({ label, description, fontKey, urlKey, register, errors }: FontFieldProps) {
  return (
    <div className="border-border bg-muted/50 space-y-3 rounded-lg border p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">{label} (Familia)</label>
        <Input placeholder="Ej: Poppins" {...register(fontKey)} />
        {errors[fontKey] && (
          <span className="text-destructive text-xs">{errors[fontKey]?.message}</span>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Google Fonts URL</label>
        <Input
          placeholder="Pegar Link de Google Fonts"
          {...register(urlKey)}
          className="font-mono text-xs"
        />
        {errors[urlKey] && <span className="text-xs text-red-500">{errors[urlKey]?.message}</span>}
      </div>
      <p className="text-muted-foreground text-xs">{description}</p>
    </div>
  )
}
