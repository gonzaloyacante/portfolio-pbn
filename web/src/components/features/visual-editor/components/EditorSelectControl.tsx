'use client'

import { Select } from '@/components/ui'

interface EditorSelectControlProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export function EditorSelectControl({ label, value, options, onChange }: EditorSelectControlProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onChange={onChange} options={options} placeholder="Seleccionar..." />
    </div>
  )
}
