'use client'

import { useState, useRef, useEffect } from 'react'

interface FontPickerProps {
  value: string
  onChange: (font: string) => void
  label?: string
  description?: string
}

// Fuentes disponibles con Google Fonts
const AVAILABLE_FONTS = [
  { name: 'Amsterdam Four', category: 'Script' },
  { name: 'Pacifico', category: 'Script' },
  { name: 'Dancing Script', category: 'Script' },
  { name: 'Great Vibes', category: 'Script' },
  { name: 'Satisfy', category: 'Script' },
  { name: 'Sacramento', category: 'Script' },
  { name: 'Allura', category: 'Script' },
  { name: 'Aileron', category: 'Sans Serif' },
  { name: 'Raleway', category: 'Sans Serif' },
  { name: 'Montserrat', category: 'Sans Serif' },
  { name: 'Poppins', category: 'Sans Serif' },
  { name: 'Inter', category: 'Sans Serif' },
  { name: 'Roboto', category: 'Sans Serif' },
  { name: 'Open Sans', category: 'Sans Serif' },
  { name: 'Lato', category: 'Sans Serif' },
  { name: 'Nunito', category: 'Sans Serif' },
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Lora', category: 'Serif' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Crimson Text', category: 'Serif' },
  { name: 'Libre Baskerville', category: 'Serif' },
]

const CATEGORIES = ['All', 'Script', 'Sans Serif', 'Serif']

export default function FontPicker({ value, onChange, label, description }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const pickerRef = useRef<HTMLDivElement>(null)

  // Cerrar picker al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredFonts = AVAILABLE_FONTS.filter((font) => {
    const matchesSearch = font.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || font.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-2" ref={pickerRef}>
      {label && <label className="text-foreground block text-sm font-medium">{label}</label>}
      {description && <p className="text-muted-foreground text-xs">{description}</p>}

      {/* Input principal */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="border-input bg-card hover:border-accent flex w-full items-center gap-3 rounded-lg border p-3"
        >
          <span className="flex-1 text-left text-lg" style={{ fontFamily: value }}>
            {value}
          </span>
          <svg
            className={`text-muted-foreground h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="border-border bg-popover absolute top-full left-0 z-50 mt-2 w-full rounded-lg border p-4 shadow-xl">
            {/* Búsqueda */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar fuente..."
              aria-label="Buscar fuente"
              className="focus:border-primary focus:ring-primary/20 border-border bg-background mb-3 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />

            {/* Categorías */}
            <div className="mb-3 flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    category === cat
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat === 'All' ? 'Todas' : cat}
                </button>
              ))}
            </div>

            {/* Lista de fuentes */}
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {filteredFonts.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => {
                    onChange(font.name)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                    value === font.name ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <span className="text-lg" style={{ fontFamily: font.name }}>
                    {font.name}
                  </span>
                  <span className="text-muted-foreground text-xs">{font.category}</span>
                </button>
              ))}
              {filteredFonts.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No se encontraron fuentes
                </p>
              )}
            </div>

            {/* Preview actual */}
            <div className="bg-muted/50 mt-4 rounded-lg p-4">
              <p className="text-muted-foreground mb-1 text-xs">Vista previa:</p>
              <p className="text-2xl" style={{ fontFamily: value }}>
                Paola Bolívar Nievas
              </p>
              <p className="mt-2 text-sm" style={{ fontFamily: value }}>
                El arte del maquillaje profesional en cada detalle
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview inline */}
      <p className="text-muted-foreground text-sm" style={{ fontFamily: value }}>
        Texto de ejemplo con {value}
      </p>
    </div>
  )
}
