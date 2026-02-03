'use client'

import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ThemeEditorData } from '@/lib/validations'
import { Input } from '@/components/ui'

interface ThemeLayoutSectionProps {
  register: UseFormRegister<ThemeEditorData>
  errors: FieldErrors<ThemeEditorData>
}

export const ThemeLayoutSection: React.FC<ThemeLayoutSectionProps> = ({ register, errors }) => {
  return (
    <div className="animate-in fade-in-50 space-y-6">
      <section className="bg-card rounded-lg border p-6 shadow-sm">
        <h3 className="mb-4 border-b pb-2 text-lg font-semibold">Bordes y Redondez</h3>

        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Radio de Borde Base (px)</label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                {...register('borderRadius', { valueAsNumber: true })}
                className="w-32"
              />
              <span className="text-muted-foreground text-sm">
                Recomendado: 20-50px para estilo &quot;Bubble&quot;
              </span>
            </div>
            {errors.borderRadius && (
              <span className="text-destructive text-xs">{errors.borderRadius.message}</span>
            )}
            <p className="text-muted-foreground text-xs">
              Define qué tan redondeadas se ven las tarjetas y botones principales.
            </p>
          </div>

          {/* Visualization */}
          <div className="mt-8">
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">
              Previsualización
            </p>
            <div className="flex gap-4">
              <div
                className="bg-primary/20 border-primary text-primary flex h-16 w-16 items-center justify-center border text-xs"
                style={{ borderRadius: 'var(--layout-border-radius)' }}
              >
                Auto
              </div>
              <div className="bg-muted border-border text-muted-foreground flex h-16 w-16 items-center justify-center rounded-lg border text-xs">
                Fijo (sm)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ThemeLayoutSection
