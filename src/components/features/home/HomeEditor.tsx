'use client'

import { HomeSettingsData, updateHomeSettings } from '@/actions/theme.actions'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { homeSettingsSchema, type HomeSettingsFormData } from '@/lib/validations'
import { useToast } from '@/components/ui'
import { ImageUpload } from '@/components/ui'

interface HomeEditorProps {
  settings: HomeSettingsData | null
}

export function HomeEditor({ settings }: HomeEditorProps) {
  const router = useRouter()
  const { show } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<HomeSettingsFormData>({
    resolver: zodResolver(homeSettingsSchema),
    defaultValues: {
      heroTitle1: settings?.heroTitle1 || 'Make-up',
      heroTitle2: settings?.heroTitle2 || 'Portfolio',
      illustrationUrl: settings?.illustrationUrl || undefined,
      illustrationAlt: settings?.illustrationAlt || 'Ilustración',
      ownerName: settings?.ownerName || 'Paola Bolívar Nievas',
      heroMainImageUrl: settings?.heroMainImageUrl || undefined,
      heroMainImageAlt: settings?.heroMainImageAlt || 'Foto principal',
      heroMainImageCaption: settings?.heroMainImageCaption || '',
      heroImageStyle: settings?.heroImageStyle || 'original',
      ctaText: settings?.ctaText || 'Ver Portfolio',
      ctaLink: settings?.ctaLink || '/proyectos',
      showFeaturedProjects: settings?.showFeaturedProjects ?? true,
      featuredTitle: settings?.featuredTitle || 'Proyectos Destacados',
      featuredCount: settings?.featuredCount || 6,
    },
  })

  const onSubmit = async (data: HomeSettingsFormData) => {
    try {
      const result = await updateHomeSettings(data)
      if (result.success) {
        show({ type: 'success', message: 'Página de Inicio actualizada' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al guardar' })
      }
    } catch {
      show({ type: 'error', message: 'Error inesperado' })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Sección Hero (Cabecera)</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column Config */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
            Columna Izquierda (Títulos)
          </h3>
          <Input label="Título Línea 1 (Script)" {...register('heroTitle1')} />
          <Input label="Título Línea 2 (Heading)" {...register('heroTitle2')} />
          <Input label="Nombre Propietario" {...register('ownerName')} />

          <div className="pt-4">
            <label className="mb-2 block text-sm font-medium">Ilustración Media</label>
            <ImageUpload
              name="illustrationUrl"
              currentImage={settings?.illustrationUrl}
              onChange={(urls: string[]) =>
                setValue('illustrationUrl', urls[0], { shouldDirty: true })
              }
            />
          </div>
        </div>

        {/* Right Column Config */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
            Columna Derecha (Imagen Principal)
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Imagen Hero Grande</label>
            <ImageUpload
              name="heroMainImageUrl"
              currentImage={settings?.heroMainImageUrl}
              onChange={(urls) => setValue('heroMainImageUrl', urls[0], { shouldDirty: true })}
            />
          </div>
          <Input label="Caption Imagen (Texto flotante)" {...register('heroMainImageCaption')} />

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
              Forma de Imagen
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {[
                {
                  id: 'original',
                  label: 'Original',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  ),
                },
                {
                  id: 'square',
                  label: 'Cuadrada',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                    </svg>
                  ),
                },
                {
                  id: 'circle',
                  label: 'Circular',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  ),
                },
                {
                  id: 'landscape',
                  label: 'Paisaje',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="12" x="2" y="6" rx="2" />
                    </svg>
                  ),
                },
                {
                  id: 'portrait',
                  label: 'Retrato',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="12" height="20" x="6" y="2" rx="2" />
                    </svg>
                  ),
                },
                {
                  id: 'star',
                  label: 'Estrella',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ),
                },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() =>
                    setValue('heroImageStyle', style.id as string, { shouldDirty: true })
                  }
                  className={`flex flex-col items-center justify-center gap-2 rounded-md border p-2 text-xs transition-all ${
                    watch('heroImageStyle') === style.id
                      ? 'border-primary bg-primary/10 text-primary ring-primary ring-1'
                      : 'border-muted hover:border-primary/50 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {style.icon}
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-4 text-lg font-semibold">Call to Action (CTA)</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Texto Botón CTA" {...register('ctaText')} />
          <Input label="Enlace Botón CTA" {...register('ctaLink')} />
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-4 text-lg font-semibold">Proyectos Destacados</h2>
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            {...register('showFeaturedProjects')}
            id="showFeat"
            className="h-5 w-5 rounded"
          />
          <label htmlFor="showFeat" className="font-medium">
            Mostrar Sección Destacados
          </label>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <Input label="Título Sección" {...register('featuredTitle')} />
          <Input
            type="number"
            label="Cantidad de Proyectos"
            {...register('featuredCount', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          Guardar Home Settings
        </Button>
      </div>
    </form>
  )
}
