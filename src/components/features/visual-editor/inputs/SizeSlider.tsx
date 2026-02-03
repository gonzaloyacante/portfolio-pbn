'use client'

import { Input } from '@/components/ui'

interface SizeSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  unit?: string
}

export function SizeSlider({
  value,
  onChange,
  min = 12,
  max = 100,
  label = 'Tamaño',
  unit = 'px',
}: SizeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (!isNaN(val)) onChange(val)
            }}
            className="h-6 w-16 px-1 text-right text-xs"
          />
          <span className="text-muted-foreground text-xs">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-secondary accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg"
      />
    </div>
  )
}
