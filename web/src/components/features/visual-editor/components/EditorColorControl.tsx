'use client'

import { Input } from '@/components/ui'

interface EditorColorControlProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function EditorColorControl({ label, value, onChange }: EditorColorControlProps) {
  const hasValue = !!value

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-sm">
          <input
            type="color"
            value={hasValue ? value : '#666666'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          {hasValue ? (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundColor: value }}
            />
          ) : (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
              }}
            />
          )}
        </div>
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Sin color"
          className="flex-1"
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-muted-foreground hover:text-foreground shrink-0 px-1 text-xs"
            title="Limpiar color"
          >
            ✕
          </button>
        )}
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
