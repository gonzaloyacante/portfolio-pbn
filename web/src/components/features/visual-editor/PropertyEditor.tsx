'use client'

import dynamic from 'next/dynamic'
import { Input, Switch, TextArea } from '@/components/ui'
import type { HomeSettingsData } from '@/actions/settings/home'
import { Monitor, Tablet, Smartphone } from 'lucide-react'

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
import { ViewportPositionControl } from './components/ViewportPositionControl'
import { ViewportSlider } from './components/ViewportSlider'
import { ViewportSelectControl } from './components/ViewportSelectControl'
import { ELEMENT_CONFIG } from './propertyEditorConfig'
import type { EditableElement, ViewportMode } from './types'
import { HeroBackdropPropertyEditor } from './HeroBackdropPropertyEditor'

const IMAGE_STYLES = [
  { value: 'original', label: 'Original' },
  { value: 'rounded', label: 'Redondeado' },
  { value: 'square', label: 'Cuadrado' },
  { value: 'circle', label: 'Círculo' },
  { value: 'landscape', label: 'Paisaje (16:9)' },
  { value: 'portrait', label: 'Retrato (3:4)' },
  { value: 'star', label: 'Estrella' },
]

const VIEWPORT_META: Record<ViewportMode, { icon: typeof Monitor; label: string }> = {
  desktop: { icon: Monitor, label: 'escritorio' },
  tablet: { icon: Tablet, label: 'tablet' },
  mobile: { icon: Smartphone, label: 'móvil' },
}

interface PropertyEditorProps {
  element: Exclude<EditableElement, null>
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  viewportMode: ViewportMode
}

/**
 * Property Editor — soporta 3 viewports.
 *
 * Comportamiento:
 * - Campos compartidos (text, color, font, etc.) → se editan UNA vez, en cualquier viewport.
 * - Campos de tamaño/posición (fontSize, size, offsetX/Y, rotation, imageStyle) → se editan
 *   en el viewport activo (desktop, tablet o mobile). El form muestra el valor del viewport
 *   activo, no del escritorio.
 */
export function PropertyEditor({ element, settings, onUpdate, viewportMode }: PropertyEditorProps) {
  if (element === 'heroBackdrop') {
    return (
      <HeroBackdropPropertyEditor
        settings={settings}
        onUpdate={onUpdate}
        viewportMode={viewportMode}
      />
    )
  }

  const config = ELEMENT_CONFIG[element]

  if (!config) {
    return <p className="text-muted-foreground text-sm">Propiedades para {element} en desarrollo</p>
  }

  const { fields, mobileFields, tabletFields, defaults } = config
  const meta = VIEWPORT_META[viewportMode]
  const Icon = meta.icon

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        Editando valores para <strong>{meta.label}</strong>. Los campos vacíos heredan el valor de
        escritorio.
      </div>

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

      {fields.buttonSize && (
        <ViewportSelectControl
          label="Tamaño del botón"
          desktopKey={fields.buttonSize}
          mobileKey={mobileFields?.size}
          tabletKey={tabletFields?.size}
          settings={settings}
          onUpdate={onUpdate}
          defaultValue="default"
          viewportMode={viewportMode}
          options={[
            { value: 'sm', label: 'Pequeño' },
            { value: 'default', label: 'Normal' },
            { value: 'lg', label: 'Grande' },
          ]}
        />
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
        <ViewportSelectControl
          label="Estilo de imagen"
          desktopKey={fields.imageStyle}
          mobileKey={mobileFields?.imageStyle}
          tabletKey={tabletFields?.imageStyle}
          settings={settings}
          onUpdate={onUpdate}
          defaultValue="original"
          viewportMode={viewportMode}
          options={IMAGE_STYLES}
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
        <ViewportSlider
          label={element === 'ctaButton' ? 'Tamaño de Texto' : 'Tamaño'}
          desktopKey={fields.fontSize}
          mobileKey={mobileFields?.fontSize}
          tabletKey={tabletFields?.fontSize}
          settings={settings}
          onUpdate={onUpdate}
          defaultValue={defaults.fontSize ?? 16}
          min={defaults.fontSizeMin || 10}
          max={defaults.fontSizeMax || 100}
          viewportMode={viewportMode}
        />
      )}

      {fields.size && (
        <ViewportSlider
          label="Tamaño"
          desktopKey={fields.size}
          mobileKey={mobileFields?.size}
          tabletKey={tabletFields?.size}
          settings={settings}
          onUpdate={onUpdate}
          defaultValue={100}
          min={10}
          max={500}
          viewportMode={viewportMode}
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
        <ViewportPositionControl
          fields={fields}
          mobileFields={mobileFields}
          tabletFields={tabletFields}
          settings={settings}
          onUpdate={onUpdate}
          viewportMode={viewportMode}
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

      {fields.caption && (
        <TextArea
          label="Caption (texto sobre la imagen)"
          value={(settings[fields.caption] as string | null) ?? ''}
          onChange={(e) =>
            onUpdate(fields.caption as keyof HomeSettingsData, e.target.value || null)
          }
          placeholder="Texto que aparece como overlay sobre la imagen"
          rows={3}
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
