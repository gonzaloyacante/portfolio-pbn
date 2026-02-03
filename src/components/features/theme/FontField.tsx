'use client'

import React from 'react'
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import { ThemeEditorData } from '@/lib/validations'
import { GoogleFontPicker } from '@/components/ui'

interface FontFieldProps {
  label: string
  description: string
  fontKey: keyof ThemeEditorData
  urlKey: keyof ThemeEditorData
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
    <div className="bg-card hover:border-primary/50 space-y-3 rounded-lg border p-4 shadow-sm transition-all">
      <GoogleFontPicker
        value={currentFont || ''}
        onValueChange={handleFontChange}
        label={label}
        description={description}
      />
      {errors[fontKey] && (
        <span className="text-destructive text-xs">{errors[fontKey]?.message}</span>
      )}
    </div>
  )
}
