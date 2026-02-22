'use client'

import { Input } from '@/components/ui'

interface EditorColorControlProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function EditorColorControl({ label, value, onChange }: EditorColorControlProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-sm">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="h-full w-full cursor-pointer opacity-0"
            style={{ backgroundColor: value || 'transparent' }}
          />
          {/* Fallback visual if opacity 0 doesnt show background in some browsers, but actually we want the native picker trigger */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: value || 'transparent' }}
          />
        </div>
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  )
}

export function EditorDualColorControl({
  label,
  lightColor,
  darkColor,
  onChangeLight,
  onChangeDark,
}: {
  label: string
  lightColor: string
  darkColor: string
  onChangeLight: (val: string) => void
  onChangeDark: (val: string) => void
}) {
  return (
    <div className="bg-muted/10 space-y-4 rounded-lg border p-4">
      <h4 className="text-sm font-semibold">{label}</h4>
      <EditorColorControl label="Modo Claro" value={lightColor} onChange={onChangeLight} />
      <EditorColorControl label="Modo Oscuro" value={darkColor} onChange={onChangeDark} />
    </div>
  )
}
