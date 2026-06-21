'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { EditorSliderControl } from './EditorSliderControl'
import type { ViewportMode } from '../types'

interface ViewportSliderProps {
  label: string
  desktopKey: keyof HomeSettingsData
  mobileKey?: keyof HomeSettingsData
  tabletKey?: keyof HomeSettingsData
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  defaultValue: number
  min: number
  max: number
  viewportMode: ViewportMode
}

/**
 * Slider que edita el valor del viewport activo (desktop/tablet/mobile).
 * En tablet/mobile, edita el campo *Tablet* / *Mobile* correspondiente.
 */
export function ViewportSlider({
  label,
  desktopKey,
  mobileKey,
  tabletKey,
  settings,
  onUpdate,
  defaultValue,
  min,
  max,
  viewportMode,
}: ViewportSliderProps) {
  const activeKey =
    viewportMode === 'mobile'
      ? (mobileKey ?? desktopKey)
      : viewportMode === 'tablet'
        ? (tabletKey ?? desktopKey)
        : desktopKey

  const desktopVal = (settings[desktopKey] as number) ?? defaultValue
  const activeVal = (settings[activeKey] as number | null) ?? desktopVal

  return (
    <div>
      <EditorSliderControl
        label={
          viewportMode === 'mobile'
            ? `${label} (móvil)`
            : viewportMode === 'tablet'
              ? `${label} (tablet)`
              : label
        }
        value={activeVal}
        onChange={(val: number) => onUpdate(activeKey, val as HomeSettingsData[typeof activeKey])}
        min={min}
        max={max}
      />
      {(viewportMode === 'mobile' || viewportMode === 'tablet') && (
        <p className="text-muted-foreground mt-1 text-xs italic">
          Heredado de escritorio: {desktopVal}
        </p>
      )}
    </div>
  )
}
