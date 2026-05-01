'use client'

import { AboutSettingsData, updateAboutSettings } from '@/actions/settings/about'
import { useRouter } from 'next/navigation'
import { EditorSliderControl } from '@/components/features/visual-editor/components/EditorSliderControl'
import { BRAND } from '@/lib/design-tokens'
import { Button, ColorPicker, Input, ImageUpload, Switch } from '@/components/ui'
import { showToast } from '@/lib/toast'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { aboutSettingsSchema, type AboutSettingsFormData } from '@/lib/validations'

interface AboutEditorProps {
  settings: AboutSettingsData | null
}

export function AboutEditor({ settings }: AboutEditorProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AboutSettingsFormData>({
    resolver: zodResolver(aboutSettingsSchema),
    defaultValues: {
      bioTitle: settings?.bioTitle || 'Hola, soy Paola.',
      bioIntro: settings?.bioIntro || '',
      bioDescription: settings?.bioDescription || '',
      profileImageUrl: settings?.profileImageUrl || undefined,
      profileImageAlt: settings?.profileImageAlt || 'Paola Bolívar Nievas',
      profileImageShape: (settings?.profileImageShape || 'ellipse') as
        | 'ellipse'
        | 'circle'
        | 'rounded'
        | 'none',
      illustrationUrl: settings?.illustrationUrl || undefined,
      illustrationAlt: settings?.illustrationAlt || 'Ilustración sobre mí',
      skills: settings?.skills || [],
      yearsExperience: settings?.yearsExperience || 0,
      certifications: settings?.certifications || [],
      profileImageShadowEnabled: settings?.profileImageShadowEnabled ?? true,
      profileImageShadowBlur: settings?.profileImageShadowBlur ?? 24,
      profileImageShadowSpread: settings?.profileImageShadowSpread ?? 0,
      profileImageShadowOffsetX: settings?.profileImageShadowOffsetX ?? 0,
      profileImageShadowOffsetY: settings?.profileImageShadowOffsetY ?? 8,
      profileImageShadowColor: settings?.profileImageShadowColor ?? undefined,
      profileImageShadowOpacity: settings?.profileImageShadowOpacity ?? 35,
    },
  })

  // Watch image fields for real-time updates and persistence
  const profileImageUrl = useWatch({ control, name: 'profileImageUrl' })
  const illustrationUrl = useWatch({ control, name: 'illustrationUrl' })
  const skillsRaw = useWatch({ control, name: 'skills' })
  const certificationsRaw = useWatch({ control, name: 'certifications' })
  const profileImageShadowEnabled = useWatch({ control, name: 'profileImageShadowEnabled' })
  const profileImageShadowOpacity = useWatch({ control, name: 'profileImageShadowOpacity' })
  const profileImageShadowBlur = useWatch({ control, name: 'profileImageShadowBlur' })
  const profileImageShadowSpread = useWatch({ control, name: 'profileImageShadowSpread' })
  const profileImageShadowOffsetX = useWatch({ control, name: 'profileImageShadowOffsetX' })
  const profileImageShadowOffsetY = useWatch({ control, name: 'profileImageShadowOffsetY' })

  // Helper for array fields (one per line)
  const skillsString = skillsRaw?.join('\n') || ''
  const certificationsString = certificationsRaw?.join('\n') || ''

  const onSubmit = async (data: AboutSettingsFormData) => {
    try {
      const trimmedColor = data.profileImageShadowColor?.trim()
      const result = await updateAboutSettings({
        ...data,
        profileImageShadowColor: trimmedColor && trimmedColor.length > 0 ? trimmedColor : null,
      })
      if (result.success) {
        showToast.success('Página Sobre Mí actualizada')
        router.refresh()
      } else {
        showToast.error(result.error || 'Error al guardar')
      }
    } catch {
      showToast.error('Error inesperado')
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
              className="dark:bg-muted w-full rounded border p-2 text-sm"
              placeholder="Breve introducción..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Biografía Completa</label>
            <textarea
              {...register('bioDescription')}
              rows={8}
              className="dark:bg-muted w-full rounded border p-2 text-sm"
              placeholder="Historia completa..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto de Perfil</label>
            <ImageUpload
              name="profileImageUrl"
              value={profileImageUrl ? [profileImageUrl] : []}
              onChange={(urls: string[]) =>
                setValue('profileImageUrl', urls[0], { shouldDirty: true })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Forma de la Foto</label>
            <select
              {...register('profileImageShape')}
              className="dark:bg-muted w-full rounded border p-2 text-sm"
            >
              <option value="ellipse">Óvalo (Elipse)</option>
              <option value="circle">Círculo</option>
              <option value="rounded">Esquinas Redondeadas</option>
              <option value="none">Rectangular (Sin recorte)</option>
            </select>
          </div>

          <div className="border-border space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Sombra de la foto</p>
                <p className="text-muted-foreground text-xs">
                  Desactiva si el recorte deja la sombra “en el aire”
                </p>
              </div>
              <Switch
                checked={profileImageShadowEnabled ?? true}
                onCheckedChange={(v) =>
                  setValue('profileImageShadowEnabled', v, { shouldDirty: true })
                }
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Color de la sombra</p>
              <p className="text-muted-foreground text-xs">
                Vacío = usa el color primario del tema en la web pública.
              </p>
              <Controller
                name="profileImageShadowColor"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <ColorPicker
                      color={field.value?.trim() ? field.value : BRAND.primary}
                      onChange={(hex) => field.onChange(hex)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange(null)}
                    >
                      Usar color primario del tema (automático)
                    </Button>
                  </div>
                )}
              />
              {errors.profileImageShadowColor?.message && (
                <p className="text-destructive text-xs">{errors.profileImageShadowColor.message}</p>
              )}
            </div>
            <EditorSliderControl
              label="Opacidad sombra"
              value={profileImageShadowOpacity ?? 35}
              onChange={(v) => setValue('profileImageShadowOpacity', v, { shouldDirty: true })}
              min={0}
              max={100}
              suffix="%"
            />
            <EditorSliderControl
              label="Desenfoque (blur)"
              value={profileImageShadowBlur ?? 24}
              onChange={(v) => setValue('profileImageShadowBlur', v, { shouldDirty: true })}
              min={0}
              max={80}
              suffix=" px"
            />
            <EditorSliderControl
              label="Expansión (spread)"
              value={profileImageShadowSpread ?? 0}
              onChange={(v) => setValue('profileImageShadowSpread', v, { shouldDirty: true })}
              min={-40}
              max={40}
              suffix=" px"
            />
            <div className="grid grid-cols-2 gap-3">
              <EditorSliderControl
                label="Offset X"
                value={profileImageShadowOffsetX ?? 0}
                onChange={(v) => setValue('profileImageShadowOffsetX', v, { shouldDirty: true })}
                min={-80}
                max={80}
                suffix=" px"
              />
              <EditorSliderControl
                label="Offset Y"
                value={profileImageShadowOffsetY ?? 8}
                onChange={(v) => setValue('profileImageShadowOffsetY', v, { shouldDirty: true })}
                min={-80}
                max={80}
                suffix=" px"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ilustración Decorativa</label>
            <ImageUpload
              name="illustrationUrl"
              value={illustrationUrl ? [illustrationUrl] : []}
              onChange={(urls) => setValue('illustrationUrl', urls[0], { shouldDirty: true })}
            />
          </div>
        </div>
      </div>

      {/* Skills & Certs */}
      <div className="border-t pt-6">
        <h2 className="mb-4 text-lg font-semibold">Habilidades y Formación</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Habilidades (una por línea)</label>
            <textarea
              defaultValue={skillsString}
              onChange={(e) =>
                setValue(
                  'skills',
                  e.target.value
                    .split(/\r?\n/) // one skill per line
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              className="dark:bg-muted w-full rounded border p-2 text-sm"
              rows={4}
            />
            <p className="text-muted-foreground text-xs">
              Ej:
              <br />
              Maquillaje social
              <br />
              FX
              <br />
              Caracterización
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Certificaciones (una por línea)</label>
            <textarea
              defaultValue={certificationsString}
              onChange={(e) =>
                setValue(
                  'certifications',
                  e.target.value
                    .split(/\r?\n/) // one certification per line
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              className="dark:bg-muted w-full rounded border p-2 text-sm"
              rows={4}
            />
            <p className="text-muted-foreground text-xs">
              Ej:
              <br />
              Master en Maquillaje 2023
              <br />
              Curso FX Avanzado
            </p>
          </div>
        </div>
        {/* yearsExperience removed from admin editor (not shown publicly) */}
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          Guardar Página Sobre Mí
        </Button>
      </div>
    </form>
  )
}
