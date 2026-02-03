'use client'

import { Square, Circle, LayoutTemplate, User, Star, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageStylePickerProps {
  value: string
  onChange: (value: string) => void
}

const STYLES = [
  { id: 'original', label: 'Original', icon: ImageIcon },
  { id: 'square', label: 'Cuadrada', icon: Square },
  { id: 'circle', label: 'Circular', icon: Circle },
  { id: 'landscape', label: 'Paisaje', icon: LayoutTemplate },
  { id: 'portrait', label: 'Retrato', icon: User },
  { id: 'star', label: 'Estrella', icon: Star },
]

export function ImageStylePicker({ value, onChange }: ImageStylePickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Forma de Imagen</label>
      <div className="grid grid-cols-3 gap-2">
        {STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              'hover:bg-accent flex flex-col items-center justify-center gap-2 rounded-md border p-3 text-xs transition-all',
              value === style.id
                ? 'border-primary bg-primary/10 text-primary ring-primary ring-1'
                : 'border-muted text-muted-foreground'
            )}
            title={style.label}
          >
            <style.icon className="h-5 w-5" />
            <span>{style.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
