'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateServicesPageSettings } from '@/actions/settings/services-page'
import {
  DEFAULT_SERVICES_PAGE_LIST_INTRO,
  type ServicesPageSettingsData,
} from '@/lib/services-page-settings'
import { EditorSliderControl } from '@/components/features/visual-editor/components/EditorSliderControl'
import { BRAND } from '@/lib/design-tokens'
import { Button, ColorPicker, Input } from '@/components/ui'
import { servicesPageSettingsSchema, type ServicesPageSettingsFormData } from '@/lib/validations'
import { showToast } from '@/lib/toast'

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

interface ServicesPageHeroEditorProps {
  settings: ServicesPageSettingsData | null
}

export function ServicesPageHeroEditor({ settings }: ServicesPageHeroEditorProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ServicesPageSettingsFormData>({
    resolver: zodResolver(servicesPageSettingsSchema),
    defaultValues: {
      listTitle: settings?.listTitle ?? 'Mis Servicios',
      listIntro: settings?.listIntro ?? DEFAULT_SERVICES_PAGE_LIST_INTRO,
      listTitleFont: settings?.listTitleFont ?? '',
      listTitleFontUrl: settings?.listTitleFontUrl ?? '',
      listTitleFontSize: settings?.listTitleFontSize ?? undefined,
      listTitleMobileFontSize: settings?.listTitleMobileFontSize ?? undefined,
      listTitleColor: settings?.listTitleColor ?? undefined,
      listTitleColorDark: settings?.listTitleColorDark ?? undefined,
    },
  })

  const listTitleFontSize = useWatch({ control, name: 'listTitleFontSize' })
  const listTitleMobileFontSize = useWatch({ control, name: 'listTitleMobileFontSize' })
  const listTitleFontWatch = useWatch({ control, name: 'listTitleFont' })

  const onSubmit = async (data: ServicesPageSettingsFormData) => {
    try {
      const result = await updateServicesPageSettings({
        ...data,
        listTitleFont: data.listTitleFont?.trim() || null,
        listTitleFontUrl: data.listTitleFontUrl?.trim() || null,
        listTitleColor: data.listTitleColor?.trim() ? data.listTitleColor.trim() : null,
        listTitleColorDark: data.listTitleColorDark?.trim() ? data.listTitleColorDark.trim() : null,
      })
      if (result.success) {
        showToast.success(result.message || 'Cabecera guardada')
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
      className="border-border bg-card space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">Cabecera pública — Lista de servicios</h2>
        <p className="text-muted-foreground text-sm">
          Título e introducción que ven las visitas en <strong>/servicios</strong>. Tipografía y
          colores son opcionales; si los dejas vacíos, se usa el tema global (Poppins / tokens).
        </p>
      </div>

      <Input label="Título" {...register('listTitle')} error={errors.listTitle?.message} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Texto introductorio</label>
        <textarea
          {...register('listIntro')}
          rows={3}
          className="dark:bg-muted w-full rounded border p-2 text-sm"
          placeholder={DEFAULT_SERVICES_PAGE_LIST_INTRO}
        />
      </div>

      <GoogleFontPicker
        value={listTitleFontWatch || ''}
        onValueChange={(fontName, url) => {
          setValue('listTitleFont', fontName, { shouldDirty: true })
          setValue('listTitleFontUrl', url, { shouldDirty: true })
        }}
        label="Tipografía del título"
        description="Google Fonts (igual que en Inicio / tema)."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <EditorSliderControl
          label="Tamaño título — escritorio"
          value={listTitleFontSize ?? 32}
          onChange={(v) => setValue('listTitleFontSize', v, { shouldDirty: true })}
          min={12}
          max={96}
          suffix=" px"
        />
        <EditorSliderControl
          label="Tamaño título — móvil"
          value={listTitleMobileFontSize ?? 28}
          onChange={(v) => setValue('listTitleMobileFontSize', v, { shouldDirty: true })}
          min={12}
          max={72}
          suffix=" px"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Color título — modo claro</p>
          <p className="text-muted-foreground text-xs">Vacío = color del tema (--foreground).</p>
          <Controller
            name="listTitleColor"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                <ColorPicker
                  color={field.value?.trim() ? field.value : BRAND.foreground}
                  onChange={(hex) => field.onChange(hex)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange(null)}
                >
                  Usar color por defecto del tema
                </Button>
              </div>
            )}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Color título — modo oscuro</p>
          <p className="text-muted-foreground text-xs">
            Vacío = mismo que claro o foreground oscuro.
          </p>
          <Controller
            name="listTitleColorDark"
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
                  Usar color por defecto del tema
                </Button>
              </div>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end border-t pt-4">
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          Guardar cabecera de servicios
        </Button>
      </div>
    </form>
  )
}
