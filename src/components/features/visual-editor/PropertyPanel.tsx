'use client'

import { Card, Input, GoogleFontPicker } from '@/components/ui'
import type { HomeSettingsData } from '@/actions/settings/home'
import type { EditableElement } from './types'
import { Info } from 'lucide-react'

// Import encapsulated controls
import { EditorSliderControl } from './components/EditorSliderControl'
import { EditorDualColorControl } from './components/EditorColorControl'
import { EditorZIndexControl } from './components/EditorZIndexControl'
import { EditorVariantControl } from './components/EditorVariantControl'
import { EditorSelectControl } from './components/EditorSelectControl'
import { EditorImageUpload } from './components/EditorImageUpload'
import { EditorPositionControl } from './components/EditorPositionControl'

// Image Styles Options
const IMAGE_STYLES = [
  { value: 'original', label: 'Original' },
  { value: 'square', label: 'Cuadrado' },
  { value: 'circle', label: 'Círculo' },
  { value: 'landscape', label: 'Paisaje (16:9)' },
  { value: 'portrait', label: 'Retrato (3:4)' },
  { value: 'star', label: 'Estrella' },
]

interface PropertyPanelProps {
  selectedElement: EditableElement
  settings: HomeSettingsData | null
  onUpdate: (field: string, value: unknown) => void
}

/**
 * Property Panel
 * Composed of Reusable Editor Components with Single Responsibility
 */
export function PropertyPanel({ selectedElement, settings, onUpdate }: PropertyPanelProps) {
  if (!selectedElement) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 text-center">
          <Info className="h-12 w-12" />
          <p>Selecciona un elemento en la vista previa para editarlo</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Propiedades</h3>
      <div className="space-y-4">{renderPropertiesFor(selectedElement, settings, onUpdate)}</div>
    </Card>
  )
}

function renderPropertiesFor(
  element: Exclude<EditableElement, null>,
  settings: HomeSettingsData | null,
  onUpdate: (field: string, value: unknown) => void
) {
  if (!settings) return null

  switch (element) {
    case 'heroTitle1':
      return (
        <div className="space-y-6">
          <Input
            label="Texto"
            value={settings.heroTitle1Text || ''}
            onChange={(e) => onUpdate('heroTitle1Text', e.target.value)}
          />
          <GoogleFontPicker
            value={settings.heroTitle1Font || ''}
            onValueChange={(font, url) => {
              onUpdate('heroTitle1Font', font)
              onUpdate('heroTitle1FontUrl', url)
            }}
            label="Tipografía"
          />
          <EditorSliderControl
            label="Tamaño"
            value={settings.heroTitle1FontSize || 112}
            onChange={(val) => onUpdate('heroTitle1FontSize', val)}
            min={20}
            max={300}
          />
          <EditorDualColorControl
            label="Color"
            lightColor={settings.heroTitle1Color || ''}
            darkColor={settings.heroTitle1ColorDark || ''}
            onChangeLight={(val) => onUpdate('heroTitle1Color', val)}
            onChangeDark={(val) => onUpdate('heroTitle1ColorDark', val)}
          />
          <EditorZIndexControl
            value={settings.heroTitle1ZIndex || 20}
            onChange={(val) => onUpdate('heroTitle1ZIndex', val)}
          />
          <EditorPositionControl
            offsetX={settings.heroTitle1OffsetX || 0}
            offsetY={settings.heroTitle1OffsetY || 0}
            onChangeX={(val) => onUpdate('heroTitle1OffsetX', val)}
            onChangeY={(val) => onUpdate('heroTitle1OffsetY', val)}
          />
        </div>
      )

    case 'heroTitle2':
      return (
        <div className="space-y-6">
          <Input
            label="Texto"
            value={settings.heroTitle2Text || ''}
            onChange={(e) => onUpdate('heroTitle2Text', e.target.value)}
          />
          <GoogleFontPicker
            value={settings.heroTitle2Font || ''}
            onValueChange={(font, url) => {
              onUpdate('heroTitle2Font', font)
              onUpdate('heroTitle2FontUrl', url)
            }}
            label="Tipografía"
          />
          <EditorSliderControl
            label="Tamaño"
            value={settings.heroTitle2FontSize || 96}
            onChange={(val) => onUpdate('heroTitle2FontSize', val)}
            min={20}
            max={300}
          />
          <EditorDualColorControl
            label="Color"
            lightColor={settings.heroTitle2Color || ''}
            darkColor={settings.heroTitle2ColorDark || ''}
            onChangeLight={(val) => onUpdate('heroTitle2Color', val)}
            onChangeDark={(val) => onUpdate('heroTitle2ColorDark', val)}
          />
          <EditorZIndexControl
            value={settings.heroTitle2ZIndex || 10}
            onChange={(val) => onUpdate('heroTitle2ZIndex', val)}
          />
          <EditorPositionControl
            offsetX={settings.heroTitle2OffsetX || 0}
            offsetY={settings.heroTitle2OffsetY || 0}
            onChangeX={(val) => onUpdate('heroTitle2OffsetX', val)}
            onChangeY={(val) => onUpdate('heroTitle2OffsetY', val)}
          />
        </div>
      )

    case 'ownerName':
      return (
        <div className="space-y-6">
          <Input
            label="Nombre"
            value={settings.ownerNameText || ''}
            onChange={(e) => onUpdate('ownerNameText', e.target.value)}
          />
          <GoogleFontPicker
            value={settings.ownerNameFont || ''}
            onValueChange={(font, url) => {
              onUpdate('ownerNameFont', font)
              onUpdate('ownerNameFontUrl', url)
            }}
            label="Tipografía"
          />
          <EditorSliderControl
            label="Tamaño"
            value={settings.ownerNameFontSize || 36}
            onChange={(val) => onUpdate('ownerNameFontSize', val)}
            min={12}
            max={100}
          />
          <EditorDualColorControl
            label="Color"
            lightColor={settings.ownerNameColor || ''}
            darkColor={settings.ownerNameColorDark || ''}
            onChangeLight={(val) => onUpdate('ownerNameColor', val)}
            onChangeDark={(val) => onUpdate('ownerNameColorDark', val)}
          />
          <EditorZIndexControl
            value={settings.ownerNameZIndex || 15}
            onChange={(val) => onUpdate('ownerNameZIndex', val)}
          />
          <EditorPositionControl
            offsetX={settings.ownerNameOffsetX || 0}
            offsetY={settings.ownerNameOffsetY || 0}
            onChangeX={(val) => onUpdate('ownerNameOffsetX', val)}
            onChangeY={(val) => onUpdate('ownerNameOffsetY', val)}
          />
        </div>
      )

    case 'illustration':
      return (
        <div className="space-y-6">
          <EditorImageUpload
            label="Subir Ilustración"
            value={settings.illustrationUrl}
            onChange={(val) => onUpdate('illustrationUrl', val)}
          />
          <EditorSliderControl
            label="Tamaño"
            value={settings.illustrationSize || 100}
            onChange={(val) => onUpdate('illustrationSize', val)}
            min={10}
            max={500}
          />
          <EditorSliderControl
            label="Opacidad (%)"
            value={settings.illustrationOpacity ?? 100}
            onChange={(val) => onUpdate('illustrationOpacity', val)}
            min={0}
            max={100}
            suffix="%"
          />
          <EditorZIndexControl
            value={settings.illustrationZIndex || 10}
            onChange={(val) => onUpdate('illustrationZIndex', val)}
          />
          <EditorPositionControl
            offsetX={settings.illustrationOffsetX || 0}
            offsetY={settings.illustrationOffsetY || 0}
            onChangeX={(val) => onUpdate('illustrationOffsetX', val)}
            onChangeY={(val) => onUpdate('illustrationOffsetY', val)}
            rotation={settings.illustrationRotation || 0}
            onChangeRotation={(val) => onUpdate('illustrationRotation', val)}
          />
        </div>
      )

    case 'ctaButton':
      return (
        <div className="space-y-6">
          <Input
            label="Texto del Botón"
            value={settings.ctaText || ''}
            onChange={(e) => onUpdate('ctaText', e.target.value)}
          />
          <Input
            label="URL Destino"
            value={settings.ctaLink || ''}
            onChange={(e) => onUpdate('ctaLink', e.target.value)}
          />

          <div className="my-4 border-t pt-4">
            <EditorVariantControl
              value={settings.ctaVariant || 'primary'}
              onChange={(val) => onUpdate('ctaVariant', val)}
            />
          </div>

          <div className="my-4 border-t pt-4">
            <GoogleFontPicker
              value={settings.ctaFont || ''}
              onValueChange={(font, url) => {
                onUpdate('ctaFont', font)
                onUpdate('ctaFontUrl', url)
              }}
              label="Tipografía"
            />
            <EditorSliderControl
              label="Tamaño de Texto"
              value={settings.ctaFontSize || 16}
              onChange={(val) => onUpdate('ctaFontSize', val)}
              min={10}
              max={32}
            />
            <EditorPositionControl
              offsetX={settings.ctaOffsetX || 0}
              offsetY={settings.ctaOffsetY || 0}
              onChangeX={(val) => onUpdate('ctaOffsetX', val)}
              onChangeY={(val) => onUpdate('ctaOffsetY', val)}
            />
          </div>
        </div>
      )

    case 'heroMainImage':
      return (
        <div className="space-y-6">
          <EditorImageUpload
            label="Imagen Principal"
            value={settings.heroMainImageUrl}
            onChange={(val) => onUpdate('heroMainImageUrl', val)}
          />
          <EditorSelectControl
            label="Estilo de Imagen"
            value={settings.heroImageStyle || 'original'}
            options={IMAGE_STYLES}
            onChange={(val) => onUpdate('heroImageStyle', val)}
          />
          <EditorZIndexControl
            value={settings.heroMainImageZIndex || 5}
            onChange={(val) => onUpdate('heroMainImageZIndex', val)}
          />
          <EditorPositionControl
            offsetX={settings.heroMainImageOffsetX || 0}
            offsetY={settings.heroMainImageOffsetY || 0}
            onChangeX={(val) => onUpdate('heroMainImageOffsetX', val)}
            onChangeY={(val) => onUpdate('heroMainImageOffsetY', val)}
          />
        </div>
      )

    default:
      return (
        <p className="text-muted-foreground text-sm">Propiedades para {element} en desarrollo</p>
      )
  }
}
