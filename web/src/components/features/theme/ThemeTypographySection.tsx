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
            Roles globales visibles en toda la web: títulos, cuerpo y detalles decorativos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <FontField
            label="Títulos (Heading)"
            description="Encabezados H1-H6. Afecta jerarquía, no el texto de párrafo."
            fontKey="headingFont"
            urlKey="headingFontUrl"
            sizeKey="headingFontSize"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <FontField
            label="Cuerpo (Body)"
            description="Párrafos, formularios y lectura larga. Priorizar legibilidad."
            fontKey="bodyFont"
            urlKey="bodyFontUrl"
            sizeKey="bodyFontSize"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <FontField
            label="Script / Detalles"
            description="Firma, frases especiales y acentos. No debe usarse para párrafos."
            fontKey="scriptFont"
            urlKey="scriptFontUrl"
            sizeKey="scriptFontSize"
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
            Tipografías específicas para hero y marca. No cambian toda la web.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <FontField
            label="Marca Principal"
            description="Texto grande de marca, por ejemplo 'MAKE-UP'."
            fontKey="brandFont"
            urlKey="brandFontUrl"
            sizeKey="brandFontSize"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <FontField
            label="Subtítulo Portfolio"
            description="Subtítulo visual del hero, por ejemplo 'PORTFOLIO'."
            fontKey="portfolioFont"
            urlKey="portfolioFontUrl"
            sizeKey="portfolioFontSize"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <FontField
            label="Firma Personal"
            description="Nombre o firma decorativa en secciones de marca personal."
            fontKey="signatureFont"
            urlKey="signatureFontUrl"
            sizeKey="signatureFontSize"
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
