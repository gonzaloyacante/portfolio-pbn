'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { EditorPositionControl } from './EditorPositionControl'
import { MobileInheritNote, MobileResetButton } from './MobileHelpers'

interface MobileOverridablePositionProps {
  fields: {
    offsetX?: keyof HomeSettingsData
    offsetY?: keyof HomeSettingsData
    rotation?: keyof HomeSettingsData
  }
  mobileFields?: {
    offsetX?: keyof HomeSettingsData
    offsetY?: keyof HomeSettingsData
    rotation?: keyof HomeSettingsData
  }
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
}

export function MobileOverridablePosition({
  fields,
  mobileFields,
  settings,
  onUpdate,
}: MobileOverridablePositionProps) {
  const mobileXKey = mobileFields?.offsetX
  const mobileYKey = mobileFields?.offsetY
  const mobileRotKey = mobileFields?.rotation

  const desktopX = (settings[fields.offsetX!] as number) ?? 0
  const desktopY = (settings[fields.offsetY!] as number) ?? 0
  const desktopRot = fields.rotation ? ((settings[fields.rotation] as number) ?? 0) : undefined

  const currentX = mobileXKey ? (settings[mobileXKey] as number | null) : desktopX
  const currentY = mobileYKey ? (settings[mobileYKey] as number | null) : desktopY
  const currentRot = mobileRotKey ? (settings[mobileRotKey] as number | null) : desktopRot

  const effectiveXKey = mobileXKey ?? fields.offsetX!
  const effectiveYKey = mobileYKey ?? fields.offsetY!
  const effectiveRotKey = mobileRotKey ?? fields.rotation

  const posHasOverride = mobileXKey != null && (currentX != null || currentY != null)
  const rotHasOverride = mobileRotKey != null && currentRot != null

  return (
    <div>
      <EditorPositionControl
        label={mobileXKey ? 'Posición (móvil)' : undefined}
        offsetX={(currentX ?? desktopX) as number}
        offsetY={(currentY ?? desktopY) as number}
        onChangeX={(val: number) =>
          onUpdate(effectiveXKey, val as HomeSettingsData[typeof effectiveXKey])
        }
        onChangeY={(val: number) =>
          onUpdate(effectiveYKey, val as HomeSettingsData[typeof effectiveYKey])
        }
        rotation={effectiveRotKey ? ((currentRot ?? desktopRot ?? 0) as number) : undefined}
        onChangeRotation={
          effectiveRotKey
            ? (val: number) =>
                onUpdate(effectiveRotKey, val as HomeSettingsData[typeof effectiveRotKey])
            : undefined
        }
      />
      {mobileXKey && (
        <div className="mt-1 space-y-0.5">
          {posHasOverride ? (
            <MobileResetButton
              desktopLabel={`X:${desktopX}, Y:${desktopY}`}
              onReset={() => {
                onUpdate(mobileXKey, null as HomeSettingsData[typeof mobileXKey])
                if (mobileYKey) onUpdate(mobileYKey, null as HomeSettingsData[typeof mobileYKey])
              }}
            />
          ) : (
            <MobileInheritNote desktopLabel={`X:${desktopX}, Y:${desktopY}`} />
          )}
          {mobileRotKey &&
            (rotHasOverride ? (
              <MobileResetButton
                desktopLabel={`${desktopRot ?? 0}°`}
                onReset={() =>
                  onUpdate(mobileRotKey, null as HomeSettingsData[typeof mobileRotKey])
                }
              />
            ) : (
              desktopRot !== undefined && (
                <MobileInheritNote desktopLabel={`Rotación: ${desktopRot}°`} />
              )
            ))}
        </div>
      )}
    </div>
  )
}
