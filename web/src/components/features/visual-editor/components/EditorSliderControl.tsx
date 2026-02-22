'use client'

import { Input } from '@/components/ui'

interface EditorSliderControlProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}

/**
 * Numeric Control with Slider and Input
 */
export function EditorSliderControl({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = 'px',
}: EditorSliderControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-muted-foreground text-xs">
          {value}
          {suffix}
        </span>
      </div>
      <div className="flex gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="accent-primary w-full cursor-pointer"
        />
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="form-input w-20"
          min={min}
          max={max}
        />
      </div>
    </div>
  )
}
