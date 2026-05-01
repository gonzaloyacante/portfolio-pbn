'use client'

import dynamic from 'next/dynamic'
import { Input, Switch } from '@/components/ui'
import type { HomeSettingsData } from '@/actions/settings/home'
import { Smartphone } from 'lucide-react'

const GoogleFontPicker = dynamic(
  () =>
    import('@/components/ui/forms/GoogleFontPicker').then((m) => ({ default: m.GoogleFontPicker })),
  { ssr: false, loading: () => <div className="bg-muted h-14 w-full animate-pulse rounded-md" /> }
)
import { EditorDualColorControl } from './components/EditorColorControl'
import { EditorSliderControl } from './components/EditorSliderControl'
import { EditorZIndexControl } from './components/EditorZIndexControl'
import { EditorImageUpload } from './components/EditorImageUpload'
import { EditorVariantControl } from './components/EditorVariantControl'
import { EditorSelectControl } from './components/EditorSelectControl'
import { MobileOverridableSlider } from './components/MobileOverridableSlider'
import { MobileOverridablePosition } from './components/MobileOverridablePosition'
import { ELEMENT_CONFIG } from './propertyEditorConfig'
import type { EditableElement, ViewportMode } from './types'

const IMAGE_STYLES = [
  { value: 'original', label: 'Original' },
  { value: 'rounded', label: 'Redondeado' },
  { value: 'square', label: 'Cuadrado' },
  { value: 'circle', label: 'Círculo' },
  { value: 'landscape', label: 'Paisaje (16:9)' },
  { value: 'portrait', label: 'Retrato (3:4)' },
  { value: 'star', label: 'Estrella' },
]

interface PropertyEditorProps {
  element: Exclude<EditableElement, null>
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  viewportMode: ViewportMode
}

/**
 * Generic Property Editor
 * Renders controls based on element configuration.
 * When viewportMode is 'mobile', overridable fields (position, fontSize, size, rotation)
 * edit mobile-specific DB fields. Non-overridable properties are shared across viewports.
 */
export function PropertyEditor({ element, settings, onUpdate, viewportMode }: PropertyEditorProps) {
  const config = ELEMENT_CONFIG[element]

  if (!config) {
    return <p className="text-muted-foreground text-sm">Propiedades para {element} en desarrollo</p>
  }

  const { fields, mobileFields, defaults } = config
  const isMobileEditing = viewportMode === 'mobile' && !!mobileFields

  return (
    <div className="space-y-6">
      {isMobileEditing && (
        <div className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium">
          <Smartphone className="h-3.5 w-3.5 shrink-0" />
          Editando valores para <strong>móvil</strong>. Los campos vacíos heredan el valor de
          escritorio.
        </div>
      )}

      {fields.visible && (
        <div className="flex items-center justify-between rounded-lg border border-(--border) p-3">
          <div>
            <p className="text-sm font-medium">Visible en la web pública</p>
            <p className="text-muted-foreground text-xs">
              Oculto en la portada; aquí sigue visible para editar
            </p>
          </div>
          <Switch
            checked={(settings[fields.visible] as boolean) ?? true}
            onCheckedChange={(val: boolean) =>
              onUpdate(fields.visible as keyof HomeSettingsData, val)
            }
          />
        </div>
      )}

      {fields.text && (
        <Input
          label="Texto"
          value={(settings[fields.text] as string) ?? ''}
          onChange={(e) => onUpdate(fields.text as keyof HomeSettingsData, e.target.value)}
        />
      )}

      {fields.link && (
        <Input
          label="URL Destino"
          value={(settings[fields.link] as string) ?? ''}
          onChange={(e) => onUpdate(fields.link as keyof HomeSettingsData, e.target.value)}
        />
      )}

      {fields.variant && (
        <div className="my-4 border-t pt-4">
          <EditorVariantControl
            value={(settings[fields.variant] as string) ?? 'primary'}
            onChange={(val: string) => onUpdate(fields.variant as keyof HomeSettingsData, val)}
          />
        </div>
      )}

      {fields.imageUrl && (
        <EditorImageUpload
          label={element === 'illustration' ? 'Subir Ilustración' : 'Imagen Principal'}
          value={(settings[fields.imageUrl] as string) ?? null}
          onChange={(val: string | null) =>
            onUpdate(fields.imageUrl as keyof HomeSettingsData, val)
          }
        />
      )}

      {fields.imageStyle && (
        <EditorSelectControl
          label="Estilo de Imagen"
          value={(settings[fields.imageStyle] as string) ?? 'original'}
          options={IMAGE_STYLES}
          onChange={(val: string) => onUpdate(fields.imageStyle as keyof HomeSettingsData, val)}
        />
      )}

      {fields.font && fields.fontUrl && (
        <div className={fields.variant ? 'my-4 border-t pt-4' : ''}>
          <GoogleFontPicker
            value={(settings[fields.font] as string) ?? ''}
            onValueChange={(font, url) => {
              onUpdate(fields.font as keyof HomeSettingsData, font)
              onUpdate(fields.fontUrl as keyof HomeSettingsData, url)
            }}
            label="Tipografía"
          />
        </div>
      )}

      {fields.fontSize && (
        <MobileOverridableSlider
          label={element === 'ctaButton' ? 'Tamaño de Texto' : 'Tamaño'}
          desktopKey={fields.fontSize}
          mobileKey={isMobileEditing ? mobileFields?.fontSize : undefined}
          settings={settings}
          onUpdate={onUpdate}
          defaultValue={defaults.fontSize ?? 16}
          min={defaults.fontSizeMin || 10}
          max={defaults.fontSizeMax || 100}
        />
      )}

      {fields.size && (
        <MobileOverridableSlider
          label="Tamaño"
          desktopKey={fields.size}
          mobileKey={isMobileEditing ? mobileFields?.size : undefined}
          settings={settings}
          onUpdate={onUpdate}
          defaultValue={100}
          min={10}
          max={500}
        />
      )}

      {fields.opacity && (
        <EditorSliderControl
          label="Opacidad (%)"
          value={(settings[fields.opacity] as number) ?? 100}
          onChange={(val: number) => onUpdate(fields.opacity as keyof HomeSettingsData, val)}
          min={0}
          max={100}
          suffix="%"
        />
      )}

      {fields.color && fields.colorDark && (
        <EditorDualColorControl
          label="Color"
          lightColor={(settings[fields.color] as string) ?? ''}
          darkColor={(settings[fields.colorDark] as string) ?? ''}
          onChangeLight={(val: string) => onUpdate(fields.color as keyof HomeSettingsData, val)}
          onChangeDark={(val: string) => onUpdate(fields.colorDark as keyof HomeSettingsData, val)}
        />
      )}

      {fields.zIndex && (
        <EditorZIndexControl
          value={(settings[fields.zIndex] as number) ?? defaults.zIndex ?? 10}
          onChange={(val: number) => onUpdate(fields.zIndex as keyof HomeSettingsData, val)}
        />
      )}

      {fields.offsetX && fields.offsetY && (
        <MobileOverridablePosition
          fields={fields}
          mobileFields={isMobileEditing ? mobileFields : undefined}
          settings={settings}
          onUpdate={onUpdate}
        />
      )}

      {fields.alt && (
        <Input
          label="Texto alternativo (alt)"
          value={(settings[fields.alt] as string) ?? ''}
          onChange={(e) => onUpdate(fields.alt as keyof HomeSettingsData, e.target.value)}
          placeholder="Describe la imagen para accesibilidad"
        />
      )}

      {fields.showFeatured && (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Mostrar imágenes destacadas</p>
            <p className="text-muted-foreground text-xs">
              Muestra la sección de imágenes destacadas bajo el hero
            </p>
          </div>
          <Switch
            checked={(settings[fields.showFeatured] as boolean) ?? true}
            onCheckedChange={(val: boolean) =>
              onUpdate(fields.showFeatured as keyof HomeSettingsData, val)
            }
          />
        </div>
      )}

      {fields.featuredCount && (
        <EditorSliderControl
          label="Número de imágenes destacadas"
          value={(settings[fields.featuredCount] as number) ?? 6}
          onChange={(val: number) => onUpdate(fields.featuredCount as keyof HomeSettingsData, val)}
          min={1}
          max={20}
        />
      )}
    </div>
  )
}
