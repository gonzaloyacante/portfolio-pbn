'use client'

import { Card, Input } from '@/components/ui'
import type { HomeSettingsData } from '@/actions/theme.actions'
import type { EditableElement } from './types'
import { Info } from 'lucide-react'

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
  switch (element) {
    case 'heroTitle1':
      return (
        <>
          <Input
            label="Texto"
            value={settings?.heroTitle1Text || ''}
            onChange={(e) => onUpdate('heroTitle1Text', e.target.value)}
          />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Próximamente: selector de fuente, tamaño y colores
            </AlertDescription>
          </Alert>
        </>
      )

    case 'heroTitle2':
      return (
        <>
          <Input
            label="Texto"
            value={settings?.heroTitle2Text || ''}
            onChange={(e) => onUpdate('heroTitle2Text', e.target.value)}
          />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Próximamente: selector de fuente, tamaño y colores
            </AlertDescription>
          </Alert>
        </>
      )

    case 'ownerName':
      return (
        <>
          <Input
            label="Nombre"
            value={settings?.ownerNameText || ''}
            onChange={(e) => onUpdate('ownerNameText', e.target.value)}
          />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Próximamente: selector de fuente, tamaño y colores
            </AlertDescription>
          </Alert>
        </>
      )

    case 'ctaButton':
      return (
        <>
          <Input
            label="Texto del Botón"
            value={settings?.ctaText || ''}
            onChange={(e) => onUpdate('ctaText', e.target.value)}
          />
          <Input
            label="URL Destino"
            value={settings?.ctaLink || ''}
            onChange={(e) => onUpdate('ctaLink', e.target.value)}
          />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Próximamente: selector de fuente, tamaño, variant y size
            </AlertDescription>
          </Alert>
        </>
      )

    default:
      return (
        <p className="text-muted-foreground text-sm">Propiedades para {element} en desarrollo</p>
      )
  }
}
