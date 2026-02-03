'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { themeEditorSchema, type ThemeEditorData } from '@/lib/validations'
import { type ThemeSettingsData } from '@/actions/theme.actions'
import { useToast, useConfirmDialog } from '@/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { Button } from '@/components/ui'
import { updateThemeSettings, resetThemeToDefaults } from '@/actions/theme.actions'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Save, RotateCcw, Palette, Type, LayoutTemplate } from 'lucide-react'
import ThemeColorSection from './ThemeColorSection'
import ThemeTypographySection from './ThemeTypographySection'
import ThemeLayoutSection from './ThemeLayoutSection'

interface ThemeEditorProps {
  initialData: ThemeSettingsData | null
}

export function ThemeEditor({ initialData }: ThemeEditorProps) {
  const router = useRouter()
  const { show } = useToast()
  const [isResetting, setIsResetting] = useState(false)

  // Initialize form
  const form = useForm<ThemeEditorData>({
    resolver: zodResolver(themeEditorSchema),
    defaultValues: {
      // Light
      primaryColor: initialData?.primaryColor || '#6c0a0a',
      secondaryColor: initialData?.secondaryColor || '#ffaadd',
      accentColor: initialData?.accentColor || '#fff1f9',
      backgroundColor: initialData?.backgroundColor || '#fff8fc',
      textColor: initialData?.textColor || '#000000',
      cardBgColor: initialData?.cardBgColor || '#ffffff',
      // Dark
      darkPrimaryColor: initialData?.darkPrimaryColor || '#fb7185',
      darkSecondaryColor: initialData?.darkSecondaryColor || '#881337',
      darkAccentColor: initialData?.darkAccentColor || '#2a1015',
      darkBackgroundColor: initialData?.darkBackgroundColor || '#0f0505',
      darkTextColor: initialData?.darkTextColor || '#fafafa',
      darkCardBgColor: initialData?.darkCardBgColor || '#1c0a0f',
      // Typography
      headingFont: initialData?.headingFont || 'Poppins',
      headingFontUrl: initialData?.headingFontUrl || undefined,
      scriptFont: initialData?.scriptFont || 'Great Vibes',
      scriptFontUrl: initialData?.scriptFontUrl || undefined,
      bodyFont: initialData?.bodyFont || 'Open Sans',
      bodyFontUrl: initialData?.bodyFontUrl || undefined,
      brandFont: initialData?.brandFont || 'Saira Extra Condensed',
      brandFontUrl: initialData?.brandFontUrl || undefined,
      portfolioFont: initialData?.portfolioFont || 'Saira Extra Condensed',
      portfolioFontUrl: initialData?.portfolioFontUrl || undefined,
      signatureFont: initialData?.signatureFont || 'Dawning of a New Day',
      signatureFontUrl: initialData?.signatureFontUrl || undefined,
      // Layout
      borderRadius: initialData?.borderRadius || 40,
    },
  })

  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = form

  // Watch values for live preview
  const watchedValues = watch()

  // Live Live Preview: Inject variables into :root and .dark
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    // Helper to set variable
    const setVar = (name: string, value: string) => {
      if (value) root.style.setProperty(name, value)
    }

    // Determine if we should apply to root (light) or .dark based on current active class
    // Ideally we apply both or conditionally.
    // To support "Live Preview" of the mode the user is currently VIEWING in admin panel:
    const isDark = root.classList.contains('dark')

    if (isDark) {
      // Apply dark variables to CSS vars used by the site
      setVar('--primary', watchedValues.darkPrimaryColor)
      setVar('--secondary', watchedValues.darkSecondaryColor)
      setVar('--accent', watchedValues.darkAccentColor)
      setVar('--background', watchedValues.darkBackgroundColor)
      setVar('--foreground', watchedValues.darkTextColor)
      setVar('--card', watchedValues.darkCardBgColor)
    } else {
      // Apply light variables
      setVar('--primary', watchedValues.primaryColor)
      setVar('--secondary', watchedValues.secondaryColor)
      setVar('--accent', watchedValues.accentColor)
      setVar('--background', watchedValues.backgroundColor)
      setVar('--foreground', watchedValues.textColor)
      setVar('--card', watchedValues.cardBgColor)
    }

    setVar('--layout-border-radius', String(watchedValues.borderRadius || 40) + 'px')
  }, [watchedValues])

  const onSubmit = async (data: ThemeEditorData) => {
    try {
      const result = await updateThemeSettings(data)
      if (result.success) {
        show({ type: 'success', message: 'Tema actualizado correctamente' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al guardar' })
      }
    } catch {
      show({ type: 'error', message: 'Error inesperado' })
    }
  }

  // Confirmation Dialog
  const { confirm, Dialog } = useConfirmDialog()

  const handleReset = async () => {
    const isConfirmed = await confirm({
      title: '¿Resetear tema?',
      message:
        'Se perderán todos los colores y fuentes personalizados. Volverán los valores por defecto.',
      confirmText: 'Sí, resetear',
      variant: 'danger',
    })

    if (!isConfirmed) return

    setIsResetting(true)
    try {
      const result = await resetThemeToDefaults()
      if (result.success) {
        show({ type: 'success', message: 'Tema reseteado' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al resetear' })
      }
    } catch (err) {
      console.error(err)
      show({ type: 'error', message: 'Error al resetear' })
    } finally {
      setIsResetting(false)
    }
  }

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentTab = searchParams.get('tab') || 'colors'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header Actions */}
      <div className="bg-background/80 sticky top-0 z-10 flex items-center justify-between rounded-lg border p-4 shadow-sm backdrop-blur-sm transition-all">
        <div>
          <h2 className="text-lg font-semibold">Editar Tema Visual</h2>
          <p className="text-muted-foreground text-sm">Personaliza la apariencia de tu portfolio</p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={isResetting || isSubmitting}
            className="text-destructive hover:text-destructive/90"
          >
            <RotateCcw size={16} className="mr-2" />
            Resetear
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || !isDirty}>
            <Save size={16} className="mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Editor */}
        <div className="space-y-6 lg:col-span-8">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="bg-muted/50 mb-4 w-full justify-start p-1">
              <TabsTrigger value="colors" className="flex-1 gap-2 md:flex-none">
                <Palette size={16} /> Colores
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex-1 gap-2 md:flex-none">
                <Type size={16} /> Tipografía
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex-1 gap-2 md:flex-none">
                <LayoutTemplate size={16} /> Diseño
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="animate-in fade-in-50 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ThemeColorSection mode="light" control={control} />
                <ThemeColorSection mode="dark" control={control} />
              </div>
            </TabsContent>

            <TabsContent value="typography">
              <ThemeTypographySection
                register={register}
                errors={errors}
                setValue={form.setValue}
                watch={watch}
              />
            </TabsContent>

            <TabsContent value="layout">
              <ThemeLayoutSection register={register} errors={errors} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Sidebar */}
        <div className="hidden lg:col-span-4 lg:block">
          <div className="bg-card sticky top-24 space-y-4 rounded-xl border p-4 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-semibold">Vista Previa</h3>
              <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                Live
              </span>
            </div>

            {/* Mock Card */}
            <div
              className="rounded-lg border p-4 shadow-sm transition-colors"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--card-foreground)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  PB
                </div>
                <div>
                  <div className="bg-muted/50 mb-1 h-4 w-24 rounded"></div>
                  <div className="bg-muted/30 h-3 w-16 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-muted/20 h-16 rounded"></div>
                <div className="flex gap-2">
                  <Button size="sm" variant="primary" className="w-full">
                    Primario
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Secundario
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-muted-foreground bg-muted/30 rounded-lg p-3 text-xs">
              <p>
                Los colores que ves aquí reflejan tus cambios en tiempo real si coinciden con tu
                modo actual (Claro/Oscuro).
              </p>
            </div>
          </div>
        </div>
      </div>
      <Dialog />
    </form>
  )
}
