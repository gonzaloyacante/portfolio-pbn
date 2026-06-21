'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { EditorPositionControl } from './EditorPositionControl'
import type { ViewportMode } from '../types'

const VIEWPORT_LABELS: Record<ViewportMode, string> = {
  desktop: 'escritorio',
  tablet: 'tablet',
  mobile: 'móvil',
}

interface ViewportPositionProps {
  fields: {
    offsetX?: keyof HomeSettingsData
    offsetY?: keyof HomeSettingsData
    rotation?: keyof HomeSettingsData
  }
  /** Override fields per viewport. Si el viewport activo tiene override, se usa ese. */
  mobileFields?: {
    offsetX?: keyof HomeSettingsData
    offsetY?: keyof HomeSettingsData
    rotation?: keyof HomeSettingsData
  }
  tabletFields?: {
    offsetX?: keyof HomeSettingsData
    offsetY?: keyof HomeSettingsData
    rotation?: keyof HomeSettingsData
  }
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  viewportMode: ViewportMode
}

/**
 * Position control con soporte para 3 viewports. Cuando el viewport activo es
 * tablet o mobile, edita los campos *Tablet* / *Mobile* correspondientes.
 */
export function ViewportPositionControl({
  fields,
  mobileFields,
  tabletFields,
  settings,
  onUpdate,
  viewportMode,
}: ViewportPositionProps) {
  const activeFields =
    viewportMode === 'mobile' ? mobileFields : viewportMode === 'tablet' ? tabletFields : undefined

  const mobileXKey = mobileFields?.offsetX
  const mobileYKey = mobileFields?.offsetY
  const mobileRotKey = mobileFields?.rotation
  const tabletXKey = tabletFields?.offsetX
  const tabletYKey = tabletFields?.offsetY
  const tabletRotKey = tabletFields?.rotation

  const desktopX = (settings[fields.offsetX!] as number) ?? 0
  const desktopY = (settings[fields.offsetY!] as number) ?? 0
  const desktopRot = fields.rotation ? ((settings[fields.rotation] as number) ?? 0) : undefined

  const currentXKey = activeFields?.offsetX ?? fields.offsetX!
  const currentYKey = activeFields?.offsetY ?? fields.offsetY!
  const currentRotKey = activeFields?.rotation ?? fields.rotation

  const currentX = (settings[currentXKey] as number | null) ?? desktopX
  const currentY = (settings[currentYKey] as number | null) ?? desktopY
  const currentRot = currentRotKey
    ? ((settings[currentRotKey] as number | null) ?? desktopRot ?? 0)
    : undefined

  return (
    <div>
      <EditorPositionControl
        label={`Posición (${VIEWPORT_LABELS[viewportMode]})`}
        offsetX={currentX as number}
        offsetY={currentY as number}
        onChangeX={(val: number) =>
          onUpdate(currentXKey, val as HomeSettingsData[typeof currentXKey])
        }
        onChangeY={(val: number) =>
          onUpdate(currentYKey, val as HomeSettingsData[typeof currentYKey])
        }
        rotation={currentRotKey ? (currentRot as number) : undefined}
        onChangeRotation={
          currentRotKey
            ? (val: number) =>
                onUpdate(currentRotKey, val as HomeSettingsData[typeof currentRotKey])
            : undefined
        }
      />
    </div>
  )
}
