import React from 'react'
import { Control, Controller, Path } from 'react-hook-form'
import { FormLabel, FormMessage, ColorPicker } from '@/components/ui'
import { ThemeEditorData } from '@/lib/validations'

interface ThemeColorSectionProps {
  mode: 'light' | 'dark'
  control: Control<ThemeEditorData>
}

// Configuration for fields to reduce duplication
const COLOR_FIELDS = [
  {
    name: 'PrimaryColor',
    label: 'Color Primario',
    description: 'Botones principales, enlaces activos, bordes destacados.',
  },
  {
    name: 'SecondaryColor',
    label: 'Color Secundario',
    description: 'Fondos secundarios, elementos decorativos.',
  },
  {
    name: 'AccentColor',
    label: 'Color de Acento',
    description: 'Detalles sutiles, hovers, bordes suaves.',
  },
  { name: 'BackgroundColor', label: 'Color de Fondo', description: 'Fondo general de la página.' },
  {
    name: 'CardBgColor',
    label: 'Fondo de Tarjetas',
    description: 'Fondo para contenedores, sidebar y tarjetas.',
  },
  { name: 'TextColor', label: 'Color de Texto', description: 'Texto principal y títulos.' },
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
                <FormLabel className="text-sm font-medium">{field.label}</FormLabel>
                <p className="text-muted-foreground text-xs">{field.description}</p>
              </div>
              <Controller
                control={control}
                name={fieldKey as Path<ThemeEditorData>}
                render={({ field: { value, onChange } }) => (
                  <div>
                    <ColorPicker
                      color={(value as string) || '#000000'} // Fallback
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
