'use client'

import { Input } from '@/components/ui'
import { Move } from 'lucide-react'

interface EditorPositionControlProps {
  label?: string
  offsetX: number
  offsetY: number
  onChangeX: (val: number) => void
  onChangeY: (val: number) => void
  rotation?: number
  onChangeRotation?: (val: number) => void
}

export function EditorPositionControl({
  label = 'Posición (Ajuste Fino)',
  offsetX,
  offsetY,
  onChangeX,
  onChangeY,
  rotation,
  onChangeRotation,
}: EditorPositionControlProps) {
  return (
    <div className="bg-muted/20 space-y-3 rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Move className="h-4 w-4" />
        <span>{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-muted-foreground text-xs">Horizontal (X)</label>
          <Input
            type="number"
            value={offsetX}
            onChange={(e) => onChangeX(Number(e.target.value))}
            step={1}
            placeholder="0"
          />
        </div>
        <div className="space-y-1">
          <label className="text-muted-foreground text-xs">Vertical (Y)</label>
          <Input
            type="number"
            value={offsetY}
            onChange={(e) => onChangeY(Number(e.target.value))}
            step={1}
            placeholder="0"
          />
        </div>
        {/* Optional Rotation */}
        {typeof rotation !== 'undefined' && onChangeRotation && (
          <div className="col-span-2 mt-1 space-y-1 border-t pt-2">
            <label className="text-muted-foreground text-xs">Rotación (Grados)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={rotation}
                onChange={(e) => onChangeRotation(Number(e.target.value))}
                className="flex-1"
                min={-360}
                max={360}
              />
              <span className="text-xs">deg</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
