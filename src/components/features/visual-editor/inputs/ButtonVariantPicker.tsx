'use client'

import { Button } from '@/components/ui'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonVariantPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

const VARIANTS = [
  { id: 'primary', label: 'Primary', bg: 'bg-primary', text: 'text-primary-foreground' },
  { id: 'secondary', label: 'Secondary', bg: 'bg-secondary', text: 'text-secondary-foreground' },
  {
    id: 'outline',
    label: 'Outline',
    bg: 'bg-background border border-input',
    text: 'text-foreground',
  },
  { id: 'ghost', label: 'Ghost', bg: 'bg-transparent hover:bg-accent', text: 'text-foreground' },
]

export function ButtonVariantPicker({
  value,
  onChange,
  label = 'Variantes',
}: ButtonVariantPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {VARIANTS.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onChange(variant.id)}
            className={cn(
              'relative flex h-10 items-center justify-center rounded-md border text-sm font-medium transition-all hover:scale-[1.02]',
              variant.bg,
              variant.text,
              value === variant.id ? 'ring-primary ring-2 ring-offset-2' : 'border-transparent'
            )}
          >
            {variant.label}
            {value === variant.id && (
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
