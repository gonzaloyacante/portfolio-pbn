'use client'

import { AboutSettingsData, updateAboutSettings } from '@/actions/settings/about'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { aboutSettingsSchema, type AboutSettingsFormData } from '@/lib/validations'
import { useToast } from '@/components/ui'
import { ImageUpload } from '@/components/ui'

interface AboutEditorProps {
  settings: AboutSettingsData | null
}

export function AboutEditor({ settings }: AboutEditorProps) {
  const router = useRouter()
  const { show } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AboutSettingsFormData>({
    resolver: zodResolver(aboutSettingsSchema),
    defaultValues: {
      bioTitle: settings?.bioTitle || 'Hola, soy Paola.',
      bioIntro: settings?.bioIntro || '',
      bioDescription: settings?.bioDescription || '',
      profileImageUrl: settings?.profileImageUrl || undefined,
      profileImageAlt: settings?.profileImageAlt || 'Paola Bolívar Nievas',
      illustrationUrl: settings?.illustrationUrl || undefined,
      illustrationAlt: settings?.illustrationAlt || 'Ilustración sobre mí',
      skills: settings?.skills || [],
      yearsExperience: settings?.yearsExperience || 0,
      certifications: settings?.certifications || [],
    },
  })

  // Helper for array fields (comma separated)
  const skillsString = watch('skills')?.join(', ') || ''
  const certificationsString = watch('certifications')?.join(', ') || ''

  const onSubmit = async (data: AboutSettingsFormData) => {
    try {
      const result = await updateAboutSettings(data)
      if (result.success) {
        show({ type: 'success', message: 'Página Sobre Mí actualizada' })
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
      {/* Intro Section */}
      <h2 className="text-lg font-semibold">Introducción y Bio</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Input
            label="Título de Presentación"
            {...register('bioTitle')}
            error={errors.bioTitle?.message}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Intro (Primer párrafo)</label>
            <textarea
              {...register('bioIntro')}
              rows={3}
              className="w-full rounded border p-2 text-sm dark:bg-gray-900"
              placeholder="Breve introducción..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Biografía Completa</label>
            <textarea
              {...register('bioDescription')}
              rows={8}
              className="w-full rounded border p-2 text-sm dark:bg-gray-900"
              placeholder="Historia completa..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto de Perfil (Oval)</label>
            <ImageUpload
              name="profileImageUrl"
              currentImage={settings?.profileImageUrl}
              onChange={(urls: string[]) => setValue('profileImageUrl', urls[0])}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ilustración Decorativa</label>
            <ImageUpload
              name="illustrationUrl"
              currentImage={settings?.illustrationUrl}
              onChange={(urls) => setValue('illustrationUrl', urls[0])}
            />
          </div>
        </div>
      </div>

      {/* Skills & Certs */}
      <div className="border-t pt-6">
        <h2 className="mb-4 text-lg font-semibold">Habilidades y Formación</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Habilidades (separadas por coma)</label>
            <textarea
              defaultValue={skillsString}
              onChange={(e) =>
                setValue(
                  'skills',
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              className="w-full rounded border p-2 text-sm dark:bg-gray-900"
              rows={4}
            />
            <p className="text-xs text-gray-500">Ej: Maquillaje social, FX, Caracterización</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Certificaciones (separadas por coma)</label>
            <textarea
              defaultValue={certificationsString}
              onChange={(e) =>
                setValue(
                  'certifications',
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              className="w-full rounded border p-2 text-sm dark:bg-gray-900"
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Ej: Master en Maquillaje 2023, Curso FX Avanzado
            </p>
          </div>
        </div>
        <div className="mt-4 w-1/3">
          <Input
            type="number"
            label="Años de Experiencia"
            {...register('yearsExperience', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          Guardar Página Sobre Mí
        </Button>
      </div>
    </form>
  )
}
