'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import Modal from '@/components/ui/overlay/Modal'

// Map CSS variable key (as used in COLOR_FIELDS) → UI components that use it
const COLOR_USAGE_MAP: Record<string, { category: string; items: string[] }[]> = {
  primaryColor: [
    {
      category: 'Botones',
      items: ['Botón primario (CTA hero, formularios)', 'Botón "Reservar sesión"'],
    },
    { category: 'Navegación', items: ['Link activo en menú', 'Indicador de página actual'] },
    { category: 'Acentos', items: ['Íconos decorativos', 'Badges de estado activo', 'Scrollbar'] },
    { category: 'Admin', items: ['Barra lateral activa', 'Botones de acción principal'] },
  ],
  darkPrimaryColor: [
    {
      category: 'Botones (modo oscuro)',
      items: ['Botón primario', 'Links y CTAs en fondo oscuro'],
    },
    { category: 'Acentos (modo oscuro)', items: ['Íconos activos', 'Indicadores de selección'] },
  ],
  secondaryColor: [
    {
      category: 'Fondos destacados',
      items: ['Fondo de sección "Servicios"', 'Callouts informativos'],
    },
    { category: 'Chips', items: ['Etiquetas de categoría', 'Tags de filtro en galería'] },
  ],
  darkSecondaryColor: [
    { category: 'Fondos (modo oscuro)', items: ['Secciones destacadas en dark', 'Chips activos'] },
  ],
  accentColor: [
    { category: 'Interacción', items: ['Hover de enlaces', 'Borde de inputs enfocados'] },
    {
      category: 'Indicadores',
      items: ['Marcador de elemento seleccionado', 'Fondo de tooltip'],
    },
  ],
  darkAccentColor: [
    {
      category: 'Interacción (modo oscuro)',
      items: ['Hover en dark', 'Bordes de focus en dark'],
    },
  ],
  backgroundColor: [
    {
      category: 'Estructura',
      items: ['Fondo principal de la página', 'Fondo del hero', 'Fondo del footer'],
    },
    { category: 'Admin', items: ['Fondo del panel de administración'] },
  ],
  darkBackgroundColor: [
    { category: 'Estructura (modo oscuro)', items: ['Fondo principal en dark mode'] },
  ],
  cardBgColor: [
    {
      category: 'Tarjetas',
      items: [
        'Cards de servicios',
        'Cards de portfolio/galería',
        'Cards de testimonios',
        'Cards de contacto',
      ],
    },
    { category: 'Layout', items: ['Sidebar del admin', 'Panel lateral de navegación'] },
  ],
  darkCardBgColor: [
    {
      category: 'Tarjetas (modo oscuro)',
      items: ['Cards en dark mode', 'Paneles secundarios en dark'],
    },
  ],
  textColor: [
    {
      category: 'Tipografía',
      items: ['Títulos H1–H4', 'Párrafos de cuerpo de texto', 'Labels de formularios'],
    },
    { category: 'Navegación', items: ['Ítems del menú principal', 'Breadcrumbs'] },
  ],
  darkTextColor: [
    {
      category: 'Tipografía (modo oscuro)',
      items: ['Texto principal en dark', 'Subtítulos en dark'],
    },
  ],
}

interface ColorUsageModalProps {
  fieldKey: string
  label: string
  currentColor: string
}

export function ColorUsageModal({ fieldKey, label, currentColor }: ColorUsageModalProps) {
  const [open, setOpen] = useState(false)
  const usageGroups = COLOR_USAGE_MAP[fieldKey] ?? []

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Ver dónde se usa: ${label}`}
        className="text-muted-foreground hover:text-foreground ml-1 inline-flex items-center transition-colors"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`¿Dónde se usa "${label}"?`}>
        <div className="space-y-4">
          {/* Color preview */}
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div
              className="h-10 w-10 flex-shrink-0 rounded-md border shadow-inner"
              style={{ backgroundColor: currentColor }}
            />
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-muted-foreground font-mono text-xs">{currentColor}</p>
            </div>
          </div>

          {usageGroups.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay información de uso disponible.</p>
          ) : (
            <div className="space-y-3">
              {usageGroups.map((group) => (
                <div key={group.category}>
                  <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wide uppercase">
                    {group.category}
                  </h4>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <span
                          className="h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: currentColor }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <p className="text-muted-foreground border-t pt-3 text-xs">
            Al cambiar este color, todos los elementos listados se verán afectados en tiempo real.
          </p>
        </div>
      </Modal>
    </>
  )
}
