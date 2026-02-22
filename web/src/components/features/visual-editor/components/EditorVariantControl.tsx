'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Button Variants options
const BUTTON_VARIANTS = [
  { id: 'primary', label: 'Primary', class: 'bg-primary text-primary-foreground' },
  { id: 'secondary', label: 'Secondary', class: 'bg-secondary text-secondary-foreground' },
  { id: 'outline', label: 'Outline', class: 'bg-background border border-input text-foreground' },
  {
    id: 'ghost',
    label: 'Ghost',
    class: 'hover:bg-accent hover:text-accent-foreground text-foreground',
  },
]

export function EditorVariantControl({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Estilo de Botón</label>
      <div className="grid grid-cols-2 gap-2">
        {BUTTON_VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onChange(v.id)}
            className={cn(
              'relative flex h-10 items-center justify-center rounded-md border text-sm font-medium transition-all hover:scale-[1.02]',
              v.class,
              value === v.id ? 'ring-primary ring-2 ring-offset-2' : 'border border-transparent'
            )}
          >
            {v.label}
            {value === v.id && (
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
                <Check className="h-2.5 w-2.5" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
