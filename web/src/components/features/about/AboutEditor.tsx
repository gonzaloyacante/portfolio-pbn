'use client'

import dynamic from 'next/dynamic'
import { AboutSettingsData, updateAboutSettings } from '@/actions/settings/about'
import { useRouter } from 'next/navigation'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { EditorSliderControl } from '@/components/features/visual-editor/components/EditorSliderControl'
import { BRAND } from '@/lib/design-tokens'
import { Button, ColorPicker, Input, TextArea, ImageUpload, Switch, Select } from '@/components/ui'
import { showToast } from '@/lib/toast'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { aboutSettingsSchema, type AboutSettingsFormData } from '@/lib/validations'
import { AboutBioPreview } from './AboutBioPreview'

const GoogleFontPicker = dynamic(
  () =>
    import('@/components/ui/forms/GoogleFontPicker').then((m) => ({
      default: m.GoogleFontPicker,
    })),
  {
    ssr: false,
    loading: () => <div className="bg-muted h-14 w-full animate-pulse rounded-md" />,
  }
)

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
    reset,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<AboutSettingsFormData>({
    resolver: zodResolver(aboutSettingsSchema),
    defaultValues: {
      bioTitle: settings?.bioTitle || 'Hola, soy Paola.',
      bioTitleFont: settings?.bioTitleFont ?? '',
      bioTitleFontUrl: settings?.bioTitleFontUrl ?? '',
      bioTitleFontSize: settings?.bioTitleFontSize ?? undefined,
      bioTitleMobileFontSize: settings?.bioTitleMobileFontSize ?? undefined,
      bioTitleColor: settings?.bioTitleColor ?? undefined,
      bioTitleColorDark: settings?.bioTitleColorDark ?? undefined,
      illustrationMaxPx: settings?.illustrationMaxPx ?? 112,
      illustrationMobileMaxPx: settings?.illustrationMobileMaxPx ?? 96,
      bioIntro: settings?.bioIntro || '',
      bioDescription: settings?.bioDescription || '',
      profileImageUrl: settings?.profileImageUrl || undefined,
      profileImageAlt: settings?.profileImageAlt || 'Paola Bolívar Nievas',
      profileImageShape: (settings?.profileImageShape || 'ellipse') as
        'ellipse' | 'circle' | 'rounded' | 'none',
      illustrationUrl: settings?.illustrationUrl || undefined,
      illustrationAlt: settings?.illustrationAlt || 'Ilustración sobre mí',
      skills: settings?.skills || [],
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

  useUnsavedChanges(isDirty)

  // Watch image fields for real-time updates and persistence
  const profileImageUrl = useWatch({ control, name: 'profileImageUrl' })
  const illustrationUrl = useWatch({ control, name: 'illustrationUrl' })
  const profileImageShadowEnabled = useWatch({ control, name: 'profileImageShadowEnabled' })
  const profileImageShadowOpacity = useWatch({ control, name: 'profileImageShadowOpacity' })
  const profileImageShadowBlur = useWatch({ control, name: 'profileImageShadowBlur' })
  const profileImageShadowSpread = useWatch({ control, name: 'profileImageShadowSpread' })
  const profileImageShadowOffsetX = useWatch({ control, name: 'profileImageShadowOffsetX' })
  const profileImageShadowOffsetY = useWatch({ control, name: 'profileImageShadowOffsetY' })
  const bioTitleFontSize = useWatch({ control, name: 'bioTitleFontSize' })
  const bioTitleMobileFontSize = useWatch({ control, name: 'bioTitleMobileFontSize' })
  const illustrationMaxPx = useWatch({ control, name: 'illustrationMaxPx' })
  const illustrationMobileMaxPx = useWatch({ control, name: 'illustrationMobileMaxPx' })
  const bioTitleFontWatch = useWatch({ control, name: 'bioTitleFont' })
  const bioTitleWatch = useWatch({ control, name: 'bioTitle' })
  const bioTitleColorWatch = useWatch({ control, name: 'bioTitleColor' })
  const bioTitleColorDarkWatch = useWatch({ control, name: 'bioTitleColorDark' })
  const bioTitleFontUrlWatch = useWatch({ control, name: 'bioTitleFontUrl' })
  const profileImageShapeWatch = useWatch({ control, name: 'profileImageShape' })
  const profileImageShadowColorWatch = useWatch({ control, name: 'profileImageShadowColor' })

  const onSubmit = async (data: AboutSettingsFormData) => {
    const trimmedColor = data.profileImageShadowColor?.trim()
    const cleaned = {
      ...data,
      profileImageShadowColor: trimmedColor && trimmedColor.length > 0 ? trimmedColor : null,
      bioTitleFont: data.bioTitleFont?.trim() || null,
      bioTitleFontUrl: data.bioTitleFontUrl?.trim() || null,
      bioTitleColor: data.bioTitleColor?.trim() ? data.bioTitleColor.trim() : null,
      bioTitleColorDark: data.bioTitleColorDark?.trim() ? data.bioTitleColorDark.trim() : null,
    }

    // 🎯 FIX: Usamos `cleaned` (TODOS los campos del form) en vez de solo el
    // diff parcial. El bug original era que `dirtyFields` puede no incluir
    // algunos campos cambiados via `useWatch` (React Hook Form a veces no los
    // marca como dirty), lo que causaba que `diff` quedara vacío y la
    // action no hiciera nada, sin error ni success.
    // El costo: server action recibe todos los campos, pero Zod los
    // acepta todos (schema.partial() + todos los campos son válidos).
    const diff = Object.fromEntries(
      Object.entries(cleaned).filter(([key]) => key in dirtyFields)
    ) as Partial<AboutSettingsFormData>

    // Si el diff parcial está vacío (raro), igual enviamos todo el
    // cleaned para garantizar la persistencia.
    const payload = Object.keys(diff).length === 0 ? cleaned : diff

    if (Object.keys(diff).length === 0) {
      showToast.info('No hay cambios para guardar — reenviando todo')
    }

    try {
      const result = await updateAboutSettings(payload)
      if (result.success) {
        reset(data)
        showToast.success('Página Sobre Mí actualizada')
        router.refresh()
      } else {
        showToast.error(result.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('[AboutEditor] submit error:', error)
      showToast.error('Error inesperado')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
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

            <GoogleFontPicker
              value={bioTitleFontWatch || ''}
              onValueChange={(fontName, url) => {
                setValue('bioTitleFont', fontName, { shouldDirty: true })
                setValue('bioTitleFontUrl', url, { shouldDirty: true })
              }}
              label="Tipografía del título (“Hola…”)"
              description="Vacío = usa la fuente script del tema (Great Vibes por defecto)."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <EditorSliderControl
                label="Tamaño título — escritorio"
                value={bioTitleFontSize ?? 36}
                onChange={(v) => setValue('bioTitleFontSize', v, { shouldDirty: true })}
                min={12}
                max={120}
                suffix=" px"
              />
              <EditorSliderControl
                label="Tamaño título — móvil"
                value={bioTitleMobileFontSize ?? 32}
                onChange={(v) => setValue('bioTitleMobileFontSize', v, { shouldDirty: true })}
                min={12}
                max={96}
                suffix=" px"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Color título — modo claro</p>
                <p className="text-muted-foreground text-xs">Vacío = color primario del tema.</p>
                <Controller
                  name="bioTitleColor"
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
                        Usar primario del tema
                      </Button>
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Color título — modo oscuro</p>
                <Controller
                  name="bioTitleColorDark"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      <ColorPicker
                        color={field.value?.trim() ? field.value : BRAND.darkPrimary}
                        onChange={(hex) => field.onChange(hex)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange(null)}
                      >
                        Usar color por defecto oscuro
                      </Button>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextArea
                label="Intro (Primer párrafo)"
                {...register('bioIntro')}
                error={errors.bioIntro?.message}
                placeholder="Breve introducción..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <TextArea
                label="Biografía Completa"
                {...register('bioDescription')}
                error={errors.bioDescription?.message}
                placeholder="Historia completa..."
                rows={8}
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
              <Controller
                name="profileImageShape"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? 'ellipse'}
                    onChange={(v) => field.onChange(v)}
                    options={[
                      { value: 'ellipse', label: 'Óvalo (Elipse)' },
                      { value: 'circle', label: 'Círculo' },
                      { value: 'rounded', label: 'Esquinas Redondeadas' },
                      { value: 'none', label: 'Rectangular (Sin recorte)' },
                    ]}
                  />
                )}
              />
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
                  <p className="text-destructive text-xs">
                    {errors.profileImageShadowColor.message}
                  </p>
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

            <div className="grid gap-4 sm:grid-cols-2">
              <EditorSliderControl
                label="Tamaño ilustración — escritorio"
                value={illustrationMaxPx ?? 112}
                onChange={(v) => setValue('illustrationMaxPx', v, { shouldDirty: true })}
                min={48}
                max={320}
                suffix=" px"
              />
              <EditorSliderControl
                label="Tamaño ilustración — móvil"
                value={illustrationMobileMaxPx ?? 96}
                onChange={(v) => setValue('illustrationMobileMaxPx', v, { shouldDirty: true })}
                min={48}
                max={280}
                suffix=" px"
              />
            </div>
          </div>
        </div>

        {/* Skills & Certs */}
        <div className="border-t pt-6">
          <h2 className="mb-4 text-lg font-semibold">Habilidades y Formación</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <TextArea
                  label="Habilidades (una por línea)"
                  value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(/\r?\n/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  onBlur={field.onBlur}
                  rows={4}
                  helpText="Ej: Maquillaje social, FX, Caracterización"
                />
              )}
            />

            <Controller
              name="certifications"
              control={control}
              render={({ field }) => (
                <TextArea
                  label="Certificaciones (una por línea)"
                  value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(/\r?\n/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  onBlur={field.onBlur}
                  rows={4}
                  helpText="Ej: Master en Maquillaje 2023, Curso FX Avanzado"
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end border-t pt-6">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            Guardar Página Sobre Mí
          </Button>
        </div>
      </form>

      {/* Preview sticky en escritorio */}
      <div className="xl:sticky xl:top-4 xl:self-start">
        <AboutBioPreview
          bioTitle={bioTitleWatch || 'Hola, soy Paola.'}
          bioTitleFont={bioTitleFontWatch}
          bioTitleFontUrl={bioTitleFontUrlWatch}
          bioTitleFontSize={bioTitleFontSize}
          bioTitleColor={bioTitleColorWatch}
          bioTitleColorDark={bioTitleColorDarkWatch}
          profileImageUrl={profileImageUrl}
          profileImageShape={profileImageShapeWatch}
          shadowEnabled={profileImageShadowEnabled}
          shadowColor={profileImageShadowColorWatch}
          shadowOpacity={profileImageShadowOpacity}
          shadowBlur={profileImageShadowBlur}
          shadowSpread={profileImageShadowSpread}
          shadowOffsetX={profileImageShadowOffsetX}
          shadowOffsetY={profileImageShadowOffsetY}
          illustrationUrl={illustrationUrl}
          illustrationMaxPx={illustrationMaxPx}
        />
      </div>
    </div>
  )
}
