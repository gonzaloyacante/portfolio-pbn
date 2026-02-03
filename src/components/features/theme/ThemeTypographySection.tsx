'use client'

import React from 'react'
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import { ThemeEditorData } from '@/lib/validations'
import { FontField } from './FontField'

interface ThemeTypographySectionProps {
  register: UseFormRegister<ThemeEditorData>
  errors: FieldErrors<ThemeEditorData>
  setValue: UseFormSetValue<ThemeEditorData>
  watch: UseFormWatch<ThemeEditorData>
}

export const ThemeTypographySection: React.FC<ThemeTypographySectionProps> = ({
  register,
  errors,
  setValue,
  watch,
}) => {
  return (
    <div className="animate-in fade-in-50 space-y-8">
      {/* Base Fonts */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Fuentes Base</h3>
          <p className="text-muted-foreground text-sm">
            Configuración global de tipografía del sitio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <FontField
            label="Títulos (Heading)"
            description="Utilizada en encabezados H1-H6. Debe ser legible y con carácter."
            fontKey="headingFont"
            urlKey="headingFontUrl"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <FontField
            label="Cuerpo (Body)"
            description="Texto principal. Prioriza la legibilidad (ej. Open Sans, Inter)."
            fontKey="bodyFont"
            urlKey="bodyFontUrl"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <FontField
            label="Script / Detalles"
            description="Para acentos decorativos y frases especiales."
            fontKey="scriptFont"
            urlKey="scriptFontUrl"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        </div>
      </section>

      {/* Brand Fonts */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Identidad de Marca</h3>
          <p className="text-muted-foreground text-sm">
            Tipografías específicas para logotipos y heros
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <FontField
            label="Marca Principal"
            description="Para el texto grande 'MAKE-UP' o similar."
            fontKey="brandFont"
            urlKey="brandFontUrl"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <FontField
            label="Subtítulo Portfolio"
            description="Para la palabra 'PORTFOLIO' bajo la marca."
            fontKey="portfolioFont"
            urlKey="portfolioFontUrl"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <FontField
            label="Firma Personal"
            description="Tu nombre o firma en secciones 'Sobre Mí'."
            fontKey="signatureFont"
            urlKey="signatureFontUrl"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        </div>
      </section>
    </div>
  )
}

export default ThemeTypographySection
