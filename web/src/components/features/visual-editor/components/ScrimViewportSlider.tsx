'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { EditorSliderControl } from './EditorSliderControl'
import type { ViewportMode } from '../types'

interface ScrimViewportSliderProps {
  label: string
  desktopKey: keyof HomeSettingsData
  tabletKey: keyof HomeSettingsData
  mobileKey: keyof HomeSettingsData
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  defaultValue: number
  min: number
  max: number
  viewportMode: ViewportMode
  suffix?: string
}

const VIEWPORT_LABELS: Record<ViewportMode, string> = {
  desktop: 'escritorio',
  tablet: 'tablet',
  mobile: 'móvil',
}

/**
 * Slider que edita el valor del viewport activo (escritorio / tablet / móvil)
 * SIN herencia: cada viewport tiene su propio campo y su propio default. Si el
 * campo está vacío en la DB, se usa el default ESPECÍFICO del viewport activo,
 * nunca el de escritorio.
 *
 * El label SIEMPRE incluye el viewport activo: "Cuánto espacio ocupa (escritorio)".
 */
export function ScrimViewportSlider({
  label,
  desktopKey,
  tabletKey,
  mobileKey,
  settings,
  onUpdate,
  defaultValue,
  min,
  max,
  viewportMode,
  suffix = 'px',
}: ScrimViewportSliderProps) {
  const activeKey =
    viewportMode === 'mobile' ? mobileKey : viewportMode === 'tablet' ? tabletKey : desktopKey

  const activeVal = (settings[activeKey] as number | null) ?? defaultValue

  return (
    <EditorSliderControl
      label={`${label} (${VIEWPORT_LABELS[viewportMode]})`}
      value={activeVal}
      onChange={(val: number) => onUpdate(activeKey, val as HomeSettingsData[typeof activeKey])}
      min={min}
      max={max}
      suffix={suffix}
    />
  )
}
