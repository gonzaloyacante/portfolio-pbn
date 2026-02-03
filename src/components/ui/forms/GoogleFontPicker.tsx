'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Check, ChevronsUpDown, Search, Loader2, AlertCircle } from 'lucide-react'
import {
  fetchGoogleFonts,
  getFontsByCategory,
  FONT_CATEGORIES,
  type GoogleFont,
} from '@/lib/google-fonts'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface GoogleFontPickerProps {
  value: string // Font name
  onValueChange: (fontName: string, fontUrl: string) => void
  label?: string
  description?: string
}

export function GoogleFontPicker({
  value,
  onValueChange,
  label,
  description,
}: GoogleFontPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [fonts, setFonts] = useState<GoogleFont[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch fonts on mount
  useEffect(() => {
    async function loadFonts() {
      setLoading(true)
      setError(null)
      try {
        const fetchedFonts = await fetchGoogleFonts()
        if (fetchedFonts.length === 0) {
          setError('No se pudieron cargar las fuentes. Verifica la configuración de la API key.')
        }
        setFonts(fetchedFonts)
      } catch (err) {
        console.error('Failed to load fonts:', err)
        setError('Error al cargar fuentes. Por favor recarga la página.')
      } finally {
        setLoading(false)
      }
    }
    loadFonts()
  }, [])

  // Filter fonts by search and category
  const filteredFonts = useMemo(() => {
    const byCategory = getFontsByCategory(fonts, category)
    if (!search) return byCategory

    const query = search.toLowerCase()
    return byCategory.filter((font) => font.name.toLowerCase().includes(query))
  }, [fonts, search, category])

  const handleSelect = (fontName: string, fontUrl: string) => {
    onValueChange(fontName, fontUrl)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          onClick={() => setOpen(!open)}
          disabled={loading}
        >
          <span className="truncate" style={{ fontFamily: value || 'inherit' }}>
            {loading
              ? 'Cargando fuentes...'
              : error
                ? 'Error al cargar'
                : value || 'Selecciona una fuente...'}
          </span>
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
          ) : error ? (
            <AlertCircle className="text-destructive ml-2 h-4 w-4 shrink-0" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>

        {open && !loading && (
          <div className="bg-popover text-popover-foreground absolute top-full z-50 mt-2 max-h-[400px] w-full overflow-auto rounded-md border shadow-md">
            {error ? (
              <div className="space-y-2 p-4">
                <div className="text-destructive flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Error de configuración</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  La Google Fonts API requiere una API key. Sigue estos pasos:
                </p>
                <ol className="text-muted-foreground ml-4 list-decimal space-y-1 text-xs">
                  <li>
                    Ve a{' '}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener"
                      className="text-primary hover:underline"
                    >
                      Google Cloud Console
                    </a>
                  </li>
                  <li>Crea un proyecto o selecciona uno existente</li>
                  <li>Habilita &quot;Web Fonts Developer API&quot;</li>
                  <li>Crea una API Key (es GRATIS)</li>
                  <li>
                    Agrega a .env.local:{' '}
                    <code className="bg-muted rounded px-1">GOOGLE_FONTS_API_KEY=tu_key_aqui</code>
                  </li>
                </ol>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="border-border sticky top-0 border-b bg-white p-2 dark:bg-gray-900">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar fuente..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-background border-input focus:ring-primary w-full rounded-md border py-2 pr-2 pl-8 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="border-border flex gap-1 overflow-x-auto border-b p-2">
                  {FONT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        'rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors',
                        category === cat.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Font List */}
                <div className="max-h-64 overflow-y-auto p-1">
                  {filteredFonts.length === 0 ? (
                    <div className="text-muted-foreground p-4 text-center text-sm">
                      No se encontraron fuentes
                    </div>
                  ) : (
                    filteredFonts.slice(0, 100).map((font) => (
                      <button
                        key={font.name}
                        type="button"
                        onClick={() => handleSelect(font.name, font.url)}
                        className={cn(
                          'hover:bg-accent flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm transition-colors',
                          value === font.name && 'bg-accent'
                        )}
                      >
                        <span className="truncate" style={{ fontFamily: font.name }}>
                          {font.name}
                        </span>
                        {value === font.name && <Check className="h-4 w-4 shrink-0" />}
                      </button>
                    ))
                  )}
                  {filteredFonts.length > 100 && (
                    <div className="text-muted-foreground p-2 text-center text-xs">
                      Mostrando 100 de {filteredFonts.length} fuentes. Usa la búsqueda para filtrar.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {description && <p className="text-muted-foreground text-xs">{description}</p>}
      {error && !open && (
        <p className="text-destructive flex items-center gap-1 text-xs">
          <AlertCircle className="h-3 w-3" />
          Configuración de API pendiente
        </p>
      )}
    </div>
  )
}
