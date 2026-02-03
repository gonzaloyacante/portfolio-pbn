'use client'

import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Input } from '@/components/ui'
import { ThemeEditorData } from '@/lib/validations'

interface FontFieldProps {
  label: string
  description: string
  fontKey: keyof ThemeEditorData
  urlKey: keyof ThemeEditorData
  register: UseFormRegister<ThemeEditorData>
  errors: FieldErrors<ThemeEditorData>
}

export const FontField: React.FC<FontFieldProps> = ({
  label,
  description,
  fontKey,
  urlKey,
  register,
  errors,
}) => {
  return (
    <div className="bg-card hover:border-primary/50 space-y-3 rounded-lg border p-4 shadow-sm transition-all">
      <div>
        <label className="mb-1 block text-sm font-medium">{label}</label>
        <Input placeholder="Ej: Poppins" {...register(fontKey)} />
        {errors[fontKey] && (
          <span className="text-destructive text-xs">{errors[fontKey]?.message}</span>
        )}
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wider uppercase">
          Google Fonts Import URL
        </label>
        <Input
          placeholder="https://fonts.googleapis.com..."
          {...register(urlKey)}
          className="text-muted-foreground font-mono text-xs"
        />
        {errors[urlKey] && (
          <span className="text-destructive text-xs">{errors[urlKey]?.message}</span>
        )}
      </div>
      <p className="text-muted-foreground text-xs">{description}</p>
    </div>
  )
}
