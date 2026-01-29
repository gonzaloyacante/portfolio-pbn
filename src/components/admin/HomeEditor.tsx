'use client'

import { HomeSettingsData, updateHomeSettings } from '@/actions/theme.actions'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { homeSettingsSchema, type HomeSettingsFormData } from '@/lib/validations'
import { useToast } from '@/components/ui'
import { ImageUpload } from '@/components/admin'

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
      className="space-y-8 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800"
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
              onChange={(urls) => setValue('illustrationUrl', urls[0])}
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
              onChange={(urls) => setValue('heroMainImageUrl', urls[0])}
            />
          </div>
          <Input label="Caption Imagen (Texto flotante)" {...register('heroMainImageCaption')} />
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
