'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { EditorSelectControl } from './EditorSelectControl'
import type { ViewportMode } from '../types'

interface ViewportSelectOption {
  value: string
  label: string
}

interface ViewportSelectControlProps {
  label: string
  desktopKey: keyof HomeSettingsData
  mobileKey?: keyof HomeSettingsData
  tabletKey?: keyof HomeSettingsData
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  options: ViewportSelectOption[]
  defaultValue?: string
  viewportMode: ViewportMode
}

const VIEWPORT_LABELS: Record<ViewportMode, string> = {
  desktop: 'escritorio',
  tablet: 'tablet',
  mobile: 'móvil',
}

/**
 * Select que edita el valor del viewport activo (escritorio / tablet / móvil).
 * El label SIEMPRE incluye el viewport activo: "Tamaño del botón (escritorio)".
 */
export function ViewportSelectControl({
  label,
  desktopKey,
  mobileKey,
  tabletKey,
  settings,
  onUpdate,
  options,
  defaultValue,
  viewportMode,
}: ViewportSelectControlProps) {
  const activeKey =
    viewportMode === 'mobile'
      ? (mobileKey ?? desktopKey)
      : viewportMode === 'tablet'
        ? (tabletKey ?? desktopKey)
        : desktopKey

  const desktopVal = (settings[desktopKey] as string | null) ?? defaultValue ?? ''
  const activeVal = (settings[activeKey] as string | null) ?? desktopVal

  return (
    <div>
      <EditorSelectControl
        label={`${label} (${VIEWPORT_LABELS[viewportMode]})`}
        value={activeVal}
        options={options}
        onChange={(val: string) => onUpdate(activeKey, val as HomeSettingsData[typeof activeKey])}
      />
    </div>
  )
}
