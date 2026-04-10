'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { EditorSliderControl } from './EditorSliderControl'
import { MobileInheritNote, MobileResetButton } from './MobileHelpers'

interface MobileOverridableSliderProps {
  label: string
  desktopKey: keyof HomeSettingsData
  mobileKey?: keyof HomeSettingsData
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  defaultValue: number
  min: number
  max: number
}

export function MobileOverridableSlider({
  label,
  desktopKey,
  mobileKey,
  settings,
  onUpdate,
  defaultValue,
  min,
  max,
}: MobileOverridableSliderProps) {
  const desktopVal = (settings[desktopKey] as number) ?? defaultValue
  const mobileVal = mobileKey ? (settings[mobileKey] as number | null) : undefined
  const effectiveKey = mobileKey ?? desktopKey
  const effectiveValue = mobileKey ? (mobileVal ?? desktopVal) : desktopVal
  const isInherited = mobileKey != null && mobileVal == null

  return (
    <div>
      <EditorSliderControl
        label={mobileKey ? `${label} (móvil)` : label}
        value={effectiveValue}
        onChange={(val: number) =>
          onUpdate(effectiveKey, val as HomeSettingsData[typeof effectiveKey])
        }
        min={min}
        max={max}
      />
      {mobileKey && !isInherited && (
        <MobileResetButton
          desktopLabel={`${desktopVal}px`}
          onReset={() => onUpdate(mobileKey, null as HomeSettingsData[typeof mobileKey])}
        />
      )}
      {isInherited && <MobileInheritNote desktopLabel={`${desktopVal}px`} />}
    </div>
  )
}
