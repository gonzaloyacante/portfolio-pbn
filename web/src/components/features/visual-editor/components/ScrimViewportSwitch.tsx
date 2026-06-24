'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { Switch } from '@/components/ui'
import type { ViewportMode } from '../types'

interface ScrimViewportSwitchProps {
  title: string
  description: string
  desktopKey: keyof HomeSettingsData
  tabletKey: keyof HomeSettingsData
  mobileKey: keyof HomeSettingsData
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  defaultChecked: boolean
  viewportMode: ViewportMode
}

const VIEWPORT_LABELS: Record<ViewportMode, string> = {
  desktop: 'escritorio',
  tablet: 'tablet',
  mobile: 'móvil',
}

/**
 * Switch que edita el valor del viewport activo (escritorio / tablet / móvil)
 * SIN herencia: cada viewport tiene su propio campo y su propio default. Si el
 * campo está vacío en la DB, se usa el default ESPECÍFICO del viewport activo,
 * nunca el de escritorio.
 *
 * El label SIEMPRE incluye el viewport activo: "Mostrar sombra a la izquierda (escritorio)".
 */
export function ScrimViewportSwitch({
  title,
  description,
  desktopKey,
  tabletKey,
  mobileKey,
  settings,
  onUpdate,
  defaultChecked,
  viewportMode,
}: ScrimViewportSwitchProps) {
  const activeKey =
    viewportMode === 'mobile' ? mobileKey : viewportMode === 'tablet' ? tabletKey : desktopKey

  const activeVal = (settings[activeKey] as boolean | null) ?? defaultChecked

  return (
    <div className="flex items-center justify-between rounded-lg border border-(--border) p-3">
      <div className="pr-4">
        <p className="text-sm font-medium">
          {title}{' '}
          <span className="text-muted-foreground font-normal">
            ({VIEWPORT_LABELS[viewportMode]})
          </span>
        </p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch
        checked={activeVal}
        onCheckedChange={(val: boolean) =>
          onUpdate(activeKey, val as HomeSettingsData[typeof activeKey])
        }
      />
    </div>
  )
}
