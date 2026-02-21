'use client'

import dynamic from 'next/dynamic'
import { Input, Switch } from '@/components/ui'
import type { HomeSettingsData } from '@/actions/settings/home'

const GoogleFontPicker = dynamic(
  () =>
    import('@/components/ui/forms/GoogleFontPicker').then((m) => ({ default: m.GoogleFontPicker })),
  { ssr: false, loading: () => <div className="bg-muted h-14 w-full animate-pulse rounded-md" /> }
)
import { EditorDualColorControl } from './components/EditorColorControl'
import { EditorSliderControl } from './components/EditorSliderControl'
import { EditorZIndexControl } from './components/EditorZIndexControl'
import { EditorPositionControl } from './components/EditorPositionControl'
import { EditorImageUpload } from './components/EditorImageUpload'
import { EditorVariantControl } from './components/EditorVariantControl'
import { EditorSelectControl } from './components/EditorSelectControl'
import { ELEMENT_CONFIG } from './propertyEditorConfig'
import type { EditableElement } from './types'

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
}

/**
 * Generic Property Editor
 * Renders controls based on element configuration
 */
export function PropertyEditor({ element, settings, onUpdate }: PropertyEditorProps) {
  const config = ELEMENT_CONFIG[element]

  if (!config) {
    return <p className="text-muted-foreground text-sm">Propiedades para {element} en desarrollo</p>
  }

  const { fields, defaults } = config

  return (
    <div className="space-y-6">
      {/* Text Input */}
      {fields.text && (
        <Input
          label="Texto"
          value={(settings[fields.text] as string) ?? ''}
          onChange={(e) => onUpdate(fields.text as keyof HomeSettingsData, e.target.value)}
        />
      )}

      {/* Link Input (CTA) */}
      {fields.link && (
        <Input
          label="URL Destino"
          value={(settings[fields.link] as string) ?? ''}
          onChange={(e) => onUpdate(fields.link as keyof HomeSettingsData, e.target.value)}
        />
      )}

      {/* Variant Control (CTA) */}
      {fields.variant && (
        <div className="my-4 border-t pt-4">
          <EditorVariantControl
            value={(settings[fields.variant] as string) ?? 'primary'}
            onChange={(val: string) => onUpdate(fields.variant as keyof HomeSettingsData, val)}
          />
        </div>
      )}

      {/* Image Upload */}
      {fields.imageUrl && (
        <EditorImageUpload
          label={element === 'illustration' ? 'Subir Ilustración' : 'Imagen Principal'}
          value={(settings[fields.imageUrl] as string) ?? null}
          onChange={(val: string | null) =>
            onUpdate(fields.imageUrl as keyof HomeSettingsData, val)
          }
        />
      )}

      {/* Image Style Select */}
      {fields.imageStyle && (
        <EditorSelectControl
          label="Estilo de Imagen"
          value={(settings[fields.imageStyle] as string) ?? 'original'}
          options={IMAGE_STYLES}
          onChange={(val: string) => onUpdate(fields.imageStyle as keyof HomeSettingsData, val)}
        />
      )}

      {/* Font Picker */}
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

      {/* Font Size */}
      {fields.fontSize && (
        <EditorSliderControl
          label={element === 'ctaButton' ? 'Tamaño de Texto' : 'Tamaño'}
          value={(settings[fields.fontSize] as number) ?? defaults.fontSize ?? 16}
          onChange={(val: number) => onUpdate(fields.fontSize as keyof HomeSettingsData, val)}
          min={defaults.fontSizeMin || 10}
          max={defaults.fontSizeMax || 100}
        />
      )}

      {/* Size (for non-text elements like illustration) */}
      {fields.size && (
        <EditorSliderControl
          label="Tamaño"
          value={(settings[fields.size] as number) ?? 100}
          onChange={(val: number) => onUpdate(fields.size as keyof HomeSettingsData, val)}
          min={10}
          max={500}
        />
      )}

      {/* Opacity */}
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

      {/* Dual Color Control */}
      {fields.color && fields.colorDark && (
        <EditorDualColorControl
          label="Color"
          lightColor={(settings[fields.color] as string) ?? ''}
          darkColor={(settings[fields.colorDark] as string) ?? ''}
          onChangeLight={(val: string) => onUpdate(fields.color as keyof HomeSettingsData, val)}
          onChangeDark={(val: string) => onUpdate(fields.colorDark as keyof HomeSettingsData, val)}
        />
      )}

      {/* Z-Index */}
      {fields.zIndex && (
        <EditorZIndexControl
          value={(settings[fields.zIndex] as number) ?? defaults.zIndex ?? 10}
          onChange={(val: number) => onUpdate(fields.zIndex as keyof HomeSettingsData, val)}
        />
      )}

      {/* Position Control */}
      {fields.offsetX && fields.offsetY && (
        <EditorPositionControl
          offsetX={(settings[fields.offsetX] as number) ?? 0}
          offsetY={(settings[fields.offsetY] as number) ?? 0}
          onChangeX={(val: number) => onUpdate(fields.offsetX as keyof HomeSettingsData, val)}
          onChangeY={(val: number) => onUpdate(fields.offsetY as keyof HomeSettingsData, val)}
          rotation={fields.rotation ? ((settings[fields.rotation] as number) ?? 0) : undefined}
          onChangeRotation={
            fields.rotation
              ? (val: number) => onUpdate(fields.rotation as keyof HomeSettingsData, val)
              : undefined
          }
        />
      )}

      {/* Alt Text (accessibility) */}
      {fields.alt && (
        <Input
          label="Texto alternativo (alt)"
          value={(settings[fields.alt] as string) ?? ''}
          onChange={(e) => onUpdate(fields.alt as keyof HomeSettingsData, e.target.value)}
          placeholder="Describe la imagen para accesibilidad"
        />
      )}

      {/* Show Featured Projects Toggle */}
      {fields.showFeatured && (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Mostrar proyectos destacados</p>
            <p className="text-muted-foreground text-xs">
              Muestra la sección de proyectos bajo el hero
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

      {/* Featured Count */}
      {fields.featuredCount && (
        <EditorSliderControl
          label="Número de proyectos destacados"
          value={(settings[fields.featuredCount] as number) ?? 6}
          onChange={(val: number) => onUpdate(fields.featuredCount as keyof HomeSettingsData, val)}
          min={1}
          max={20}
        />
      )}
    </div>
  )
}
