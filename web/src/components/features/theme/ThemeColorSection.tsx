import React from 'react'
import { Control, Controller, Path } from 'react-hook-form'
import { FormLabel, FormMessage, ColorPicker } from '@/components/ui'
import { ThemeEditorData } from '@/lib/validations'
import { BRAND } from '@/lib/design-tokens'
import { ColorUsageModal } from './ColorUsageModal'

interface ThemeColorSectionProps {
  mode: 'light' | 'dark'
  control: Control<ThemeEditorData>
}

// Configuration for fields to reduce duplication
const COLOR_FIELDS = [
  {
    name: 'PrimaryColor',
    label: 'Acento / CTA',
    description: 'Botones principales, links y navegación activa. No es color de texto general.',
  },
  {
    name: 'SecondaryColor',
    label: 'Superficie suave',
    description: 'Fondos secundarios, chips y zonas de apoyo.',
  },
  {
    name: 'AccentColor',
    label: 'Acento suave',
    description: 'Hover, fondos decorativos y énfasis liviano.',
  },
  {
    name: 'BackgroundColor',
    label: 'Canvas de página',
    description: 'Fondo general del sitio público.',
  },
  {
    name: 'CardBgColor',
    label: 'Superficie / tarjetas',
    description: 'Cards, paneles, contenedores y superficies elevadas.',
  },
  {
    name: 'TextColor',
    label: 'Texto principal',
    description: 'Párrafos, títulos normales y contenido legible.',
  },
]

export const ThemeColorSection: React.FC<ThemeColorSectionProps> = ({ mode, control }) => {
  const isDark = mode === 'dark'

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 rounded-lg border px-4 py-2">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          {isDark ? '🎨 Modo Oscuro' : '☀️ Modo Claro'}
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {COLOR_FIELDS.map((field) => {
          // Construct field name: primaryColor -> primaryColor OR darkPrimaryColor
          // Note: The schema fields are CamelCase in the configuration array but the actual field keys are:
          // Light: primaryColor, secondaryColor...
          // Dark: darkPrimaryColor, darkSecondaryColor...
          // So we need to carefully construct the key.

          const fieldKey = isDark
            ? `dark${field.name}`
            : `${field.name.charAt(0).toLowerCase()}${field.name.slice(1)}`

          return (
            <div key={fieldKey} className="flex flex-col gap-2 rounded-lg border p-3 shadow-sm">
              <div className="mb-1">
                <div className="flex items-center gap-1">
                  <FormLabel className="text-sm font-medium">{field.label}</FormLabel>
                  <Controller
                    control={control}
                    name={fieldKey as Path<ThemeEditorData>}
                    render={({ field: { value } }) => (
                      <ColorUsageModal
                        fieldKey={fieldKey}
                        label={field.label}
                        currentColor={(value as string) || BRAND.foreground}
                      />
                    )}
                  />
                </div>
                <p className="text-muted-foreground text-xs">{field.description}</p>
              </div>
              <Controller
                control={control}
                name={fieldKey as Path<ThemeEditorData>}
                render={({ field: { value, onChange } }) => (
                  <div>
                    <ColorPicker
                      color={(value as string) || BRAND.foreground}
                      onChange={onChange}
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeColorSection
