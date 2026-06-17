'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { themeEditorSchema, type ThemeEditorData } from '@/lib/validations'
import { type ThemeSettingsData } from '@/actions/settings/theme'
import { useConfirmDialog } from '@/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { Button } from '@/components/ui'
import { updateThemeSettings, resetThemeToDefaults } from '@/actions/settings/theme'
import { RESET_THEME_DEFAULTS } from '@/lib/design-tokens'
import { buildThemeInlineStylesheet } from '@/lib/theme-ssr-css'
import { themeEditorDataToCssVars } from '@/lib/theme-css-vars-from-editor'
import { showToast } from '@/lib/toast'
import { logger } from '@/lib/logger'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Save, RotateCcw, Palette, Type, LayoutTemplate, Layers } from 'lucide-react'
import ThemeColorSection from './ThemeColorSection'
import ThemeTypographySection from './ThemeTypographySection'
import ThemeLayoutSection from './ThemeLayoutSection'
import { ThemeSemanticPreview } from './ThemeSemanticPreview'
import { PublicColorOverridesSection } from './PublicColorOverridesSection'
import type { PublicColorOverrides } from '@/actions/settings/public-colors'
interface ThemeEditorProps {
  initialData: ThemeSettingsData | null
  initialColorOverrides?: PublicColorOverrides
}

export function ThemeEditor({ initialData, initialColorOverrides = {} }: ThemeEditorProps) {
  const router = useRouter()
  const [isResetting, setIsResetting] = useState(false)

  // Initialize form
  const form = useForm<ThemeEditorData>({
    resolver: zodResolver(themeEditorSchema),
    defaultValues: {
      // Light
      primaryColor: initialData?.primaryColor || RESET_THEME_DEFAULTS.primaryColor,
      secondaryColor: initialData?.secondaryColor || RESET_THEME_DEFAULTS.secondaryColor,
      accentColor: initialData?.accentColor || RESET_THEME_DEFAULTS.accentColor,
      backgroundColor: initialData?.backgroundColor || RESET_THEME_DEFAULTS.backgroundColor,
      textColor: initialData?.textColor || RESET_THEME_DEFAULTS.textColor,
      cardBgColor: initialData?.cardBgColor || RESET_THEME_DEFAULTS.cardBgColor,
      // Dark
      darkPrimaryColor: initialData?.darkPrimaryColor || RESET_THEME_DEFAULTS.darkPrimaryColor,
      darkSecondaryColor:
        initialData?.darkSecondaryColor || RESET_THEME_DEFAULTS.darkSecondaryColor,
      darkAccentColor: initialData?.darkAccentColor || RESET_THEME_DEFAULTS.darkAccentColor,
      darkBackgroundColor:
        initialData?.darkBackgroundColor || RESET_THEME_DEFAULTS.darkBackgroundColor,
      darkTextColor: initialData?.darkTextColor || RESET_THEME_DEFAULTS.darkTextColor,
      darkCardBgColor: initialData?.darkCardBgColor || RESET_THEME_DEFAULTS.darkCardBgColor,
      // Typography
      headingFont: initialData?.headingFont || 'Poppins',
      headingFontUrl: initialData?.headingFontUrl || undefined,
      scriptFont: initialData?.scriptFont || 'Great Vibes',
      scriptFontUrl: initialData?.scriptFontUrl || undefined,
      bodyFont: initialData?.bodyFont || 'Open Sans',
      bodyFontUrl: initialData?.bodyFontUrl || undefined,
      headingFontSize: initialData?.headingFontSize ?? RESET_THEME_DEFAULTS.headingFontSize,
      scriptFontSize: initialData?.scriptFontSize ?? RESET_THEME_DEFAULTS.scriptFontSize,
      bodyFontSize: initialData?.bodyFontSize ?? RESET_THEME_DEFAULTS.bodyFontSize,
      brandFont: initialData?.brandFont || 'Saira Extra Condensed',
      brandFontUrl: initialData?.brandFontUrl || undefined,
      portfolioFont: initialData?.portfolioFont || 'Saira Extra Condensed',
      portfolioFontUrl: initialData?.portfolioFontUrl || undefined,
      signatureFont: initialData?.signatureFont || 'Dawning of a New Day',
      signatureFontUrl: initialData?.signatureFontUrl || undefined,
      brandFontSize: initialData?.brandFontSize ?? undefined,
      portfolioFontSize: initialData?.portfolioFontSize ?? undefined,
      signatureFontSize: initialData?.signatureFontSize ?? undefined,
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

  const LIVE_PREVIEW_STYLE_ID = 'theme-editor-live-ssr-preview'

  /** Misma hoja que SSR (`layout.tsx`): `--muted`, `--border`, `--radius`, `.dark`, etc. */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const css = buildThemeInlineStylesheet(themeEditorDataToCssVars(watchedValues))
    let el = document.getElementById(LIVE_PREVIEW_STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = LIVE_PREVIEW_STYLE_ID
      document.head.appendChild(el)
    }
    el.textContent = css
  }, [watchedValues])

  useEffect(() => {
    return () => {
      document.getElementById(LIVE_PREVIEW_STYLE_ID)?.remove()
    }
  }, [])

  const onSubmit = async (data: ThemeEditorData) => {
    try {
      const result = await updateThemeSettings(data)
      if (result.success) {
        showToast.success('Tema actualizado correctamente')
        router.refresh()
      } else {
        showToast.error(result.error || 'Error al guardar')
      }
    } catch {
      showToast.error('Error inesperado')
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
        showToast.success('Tema reseteado')
        router.refresh()
      } else {
        showToast.error(result.error || 'Error al resetear')
      }
    } catch (err) {
      logger.error('ThemeEditor reset error', { error: err })
      showToast.error('Error al resetear')
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
              <TabsTrigger value="elements" className="flex-1 gap-2 md:flex-none">
                <Layers size={16} /> Elementos
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

            <TabsContent value="elements" className="animate-in fade-in-50">
              <PublicColorOverridesSection initialOverrides={initialColorOverrides} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Sidebar */}
        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24">
            <ThemeSemanticPreview values={watchedValues} />
          </div>
        </div>
      </div>
      <Dialog />
    </form>
  )
}
