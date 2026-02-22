'use client'

import { Input } from '@/components/ui'

export function EditorZIndexControl({
  value,
  onChange,
}: {
  value: number
  onChange: (val: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Orden de Capas (Z-Index)</label>
        <span className="text-muted-foreground text-xs">Mayor = Más arriba</span>
      </div>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={0}
        max={999}
      />
    </div>
  )
}
