'use client'

import { Card, Input, GoogleFontPicker } from '@/components/ui'
import type { HomeSettingsData } from '@/actions/theme.actions'
import type { EditableElement } from './types'
import { Info } from 'lucide-react'
import { SizeSlider } from './inputs/SizeSlider'
import { ButtonVariantPicker } from './inputs/ButtonVariantPicker'
import { DualColorPicker } from './inputs/DualColorPicker'
import { ImageStylePicker } from './inputs/ImageStylePicker'

// Temporary Alert component (inline for now)
const Alert = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950 ${className}`}
  >
    {children}
  </div>
)
const AlertDescription = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => <div className={`text-sm text-blue-800 dark:text-blue-200 ${className}`}>{children}</div>

interface PropertyPanelProps {
  selectedElement: EditableElement
  settings: HomeSettingsData | null
  onUpdate: (field: string, value: unknown) => void
}

/**
 * Panel dinámico que muestra las propiedades editables del elemento seleccionado
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

          <SizeSlider
            label="Tamaño de Fuente"
            value={settings.heroTitle1FontSize || 112}
            onChange={(val) => onUpdate('heroTitle1FontSize', val)}
            min={20}
            max={200}
          />

          <DualColorPicker
            label="Color Personalizado"
            lightColor={settings.heroTitle1Color || ''}
            darkColor={settings.heroTitle1ColorDark || ''}
            onChangeLight={(val) => onUpdate('heroTitle1Color', val)}
            onChangeDark={(val) => onUpdate('heroTitle1ColorDark', val)}
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

          <SizeSlider
            label="Tamaño de Fuente"
            value={settings.heroTitle2FontSize || 96}
            onChange={(val) => onUpdate('heroTitle2FontSize', val)}
            min={20}
            max={200}
          />

          <DualColorPicker
            label="Color Personalizado"
            lightColor={settings.heroTitle2Color || ''}
            darkColor={settings.heroTitle2ColorDark || ''}
            onChangeLight={(val) => onUpdate('heroTitle2Color', val)}
            onChangeDark={(val) => onUpdate('heroTitle2ColorDark', val)}
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

          <SizeSlider
            label="Tamaño de Fuente"
            value={settings.ownerNameFontSize || 36}
            onChange={(val) => onUpdate('ownerNameFontSize', val)}
            min={12}
            max={100}
          />

          <DualColorPicker
            label="Color Personalizado"
            lightColor={settings.ownerNameColor || ''}
            darkColor={settings.ownerNameColorDark || ''}
            onChangeLight={(val) => onUpdate('ownerNameColor', val)}
            onChangeDark={(val) => onUpdate('ownerNameColorDark', val)}
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
            <ButtonVariantPicker
              value={settings.ctaVariant || 'default'}
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
            <SizeSlider
              label="Tamaño de Fuente"
              value={settings.ctaFontSize || 16}
              onChange={(val) => onUpdate('ctaFontSize', val)}
              min={10}
              max={32}
            />
          </div>
        </div>
      )

    case 'heroMainImage':
      return (
        <div className="space-y-6">
          <ImageStylePicker
            value={settings.heroImageStyle || 'original'}
            onChange={(val) => onUpdate('heroImageStyle', val)}
          />
        </div>
      )

    default:
      return (
        <p className="text-muted-foreground text-sm">Propiedades para {element} en desarrollo</p>
      )
  }
}
