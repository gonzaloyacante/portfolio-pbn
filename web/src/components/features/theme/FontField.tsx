'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import { ThemeEditorData } from '@/lib/validations'

const GoogleFontPicker = dynamic(
  () =>
    import('@/components/ui/forms/GoogleFontPicker').then((m) => ({ default: m.GoogleFontPicker })),
  { ssr: false, loading: () => <div className="bg-muted h-14 w-full animate-pulse rounded-md" /> }
)

interface FontFieldProps {
  label: string
  description: string
  fontKey: keyof ThemeEditorData
  urlKey: keyof ThemeEditorData
  sizeKey?: keyof ThemeEditorData
  register: UseFormRegister<ThemeEditorData>
  errors: FieldErrors<ThemeEditorData>
  setValue: UseFormSetValue<ThemeEditorData>
  watch: UseFormWatch<ThemeEditorData>
}

export const FontField: React.FC<FontFieldProps> = ({
  label,
  description,
  fontKey,
  urlKey,
  sizeKey,
  setValue,
  watch,
  errors,
}) => {
  const currentFont = watch(fontKey) as string

  const handleFontChange = (fontName: string, fontUrl: string) => {
    setValue(fontKey, fontName, { shouldDirty: true })
    setValue(urlKey, fontUrl, { shouldDirty: true })
  }

  return (
    <div className="bg-card hover:border-primary/50 space-y-4 rounded-lg border p-4 shadow-sm transition-all">
      <GoogleFontPicker
        value={currentFont || ''}
        onValueChange={handleFontChange}
        label={label}
        description={description}
      />

      {/* Font Size Control */}
      {sizeKey && (
        <div className="flex items-center gap-4">
          <label className="text-muted-foreground w-20 text-xs font-medium tracking-wider uppercase">
            Tamaño
          </label>
          <div className="flex flex-1 items-center gap-4">
            <input
              type="range"
              min="10"
              max={sizeKey.includes('brand') || sizeKey.includes('portfolio') ? '300' : '200'}
              step="1"
              className="bg-muted accent-primary h-2 flex-1 cursor-pointer appearance-none rounded-full"
              value={(watch(sizeKey) as number) || 16}
              onChange={(e) => setValue(sizeKey, Number(e.target.value), { shouldDirty: true })}
            />
            <div className="relative">
              <input
                type="number"
                min="10"
                max={sizeKey.includes('brand') || sizeKey.includes('portfolio') ? '300' : '200'}
                className="bg-background border-input focus:border-primary focus:ring-primary w-20 rounded-md border px-3 py-1 text-right text-sm focus:ring-1 focus:outline-none"
                value={(watch(sizeKey) as number) || 16}
                onChange={(e) => setValue(sizeKey, Number(e.target.value), { shouldDirty: true })}
              />
              <span className="text-muted-foreground absolute top-1/2 right-7 -translate-y-1/2 text-xs opacity-50">
                px
              </span>
            </div>
          </div>
        </div>
      )}

      {errors[fontKey] && (
        <span className="text-destructive text-xs">{errors[fontKey]?.message}</span>
      )}
    </div>
  )
}
