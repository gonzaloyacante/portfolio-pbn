'use client'

import { useState, useCallback } from 'react'
import { renderLucideIcon } from './IconPickerLucideTab'
import { IconPickerDropdown } from './IconPickerDropdown'

interface IconPickerProps {
  value: string
  onChange: (icon: string) => void
  label?: string
  description?: string
}

function renderCurrentValue(value: string) {
  if (!value) return <span className="text-muted-foreground text-base">＋</span>
  if (value.startsWith('lucide:')) {
    return renderLucideIcon(value, 'h-5 w-5') ?? <span>{value}</span>
  }
  return <span className="text-xl">{value}</span>
}

export default function IconPicker({ value, onChange, label, description }: IconPickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = useCallback(
    (v: string) => {
      onChange(v)
      setOpen(false)
    },
    [onChange]
  )

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium">{label}</span>}
      {description && <span className="text-muted-foreground text-xs">{description}</span>}

      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="border-border bg-background hover:bg-accent flex h-10 w-10 items-center justify-center rounded-lg border transition-colors"
          aria-label="Seleccionar ícono"
        >
          {renderCurrentValue(value)}
        </button>

        {open && (
          <IconPickerDropdown
            value={value}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
