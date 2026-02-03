'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Check, ChevronsUpDown, Search, Loader2, AlertCircle, Type } from 'lucide-react'
import {
  fetchGoogleFonts,
  getFontsByCategory,
  FONT_CATEGORIES,
  type GoogleFont,
} from '@/lib/google-fonts'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/data-display/Badge'

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
  const [previewText, setPreviewText] = useState('The quick brown fox')
  const [visibleCount, setVisibleCount] = useState(20)

  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Custom hook for infinite scroll intersection observer
  useEffect(() => {
    if (!open) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 20)
        }
      },
      { threshold: 0.5 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [open, visibleCount])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20)
  }, [search, category, open])

  // Fetch fonts on mount
  useEffect(() => {
    async function loadFonts() {
      setLoading(true)
      setError(null)
      try {
        const fetchedFonts = await fetchGoogleFonts()
        if (fetchedFonts.length === 0) {
          setError('No fonts loaded. Check API Key.')
        }
        setFonts(fetchedFonts)
      } catch (err) {
        console.error('Failed to load fonts:', err)
        setError('Error loading fonts.')
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

  // Dynamic font loading for preview (only load visible ones ideally, but for now we rely on browser)
  // Note: In a real app with 1400 fonts, we shouldn't inject ALL links.
  // But the browser usually handles lazy loading of fonts well enough for dropdowns if we don't request too many variants.

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-12 w-full justify-between px-4 text-left font-normal"
          onClick={() => setOpen(!open)}
          disabled={loading}
        >
          <div className="flex flex-col items-start gap-1 overflow-hidden">
            <span className="text-muted-foreground text-xs">Fuente seleccionada</span>
            <span
              className="truncate text-base font-medium"
              style={{ fontFamily: value || 'inherit' }}
            >
              {loading
                ? 'Cargando biblioteca...'
                : error
                  ? 'Error al cargar'
                  : value || 'Seleccionar fuente'}
            </span>
          </div>

          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : error ? (
            <AlertCircle className="text-destructive ml-2 h-4 w-4 shrink-0" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>

        {open && !loading && (
          <div className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 fixed right-0 left-0 z-50 mt-2 flex flex-col overflow-hidden rounded-xl border shadow-2xl duration-200 md:absolute md:top-full md:left-auto md:w-[400px]">
            {error ? (
              <div className="space-y-4 p-6 text-center">
                <div className="bg-destructive/10 text-destructive mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-destructive font-semibold">Error de Configuración</h4>
                  <p className="text-muted-foreground text-sm text-balance">
                    Falta la API Key de Google Fonts.
                  </p>
                </div>
                <div className="bg-muted rounded-md p-3 text-left font-mono text-xs break-all">
                  GOOGLE_FONTS_API_KEY=...
                </div>
              </div>
            ) : (
              <>
                {/* Header: Search & Preview */}
                <div className="bg-muted/30 space-y-3 border-b p-3">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar familia tipográfica..."
                      value={search}
                      autoFocus
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-background border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full rounded-md border pr-3 pl-9 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Type className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Texto de prueba..."
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      className="bg-background/50 border-input/50 placeholder:text-muted-foreground focus-visible:ring-ring hover:bg-background h-9 w-full rounded-md border pr-3 pl-9 text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                    />
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-background border-b px-2 py-2">
                  <div className="scrollbar-none mask-fade-right flex gap-2 overflow-x-auto pb-1">
                    {FONT_CATEGORIES.map((cat) => (
                      <Badge
                        key={cat.value}
                        variant={category === cat.value ? 'default' : 'outline'}
                        className={cn(
                          'hover:bg-primary/90 cursor-pointer px-3 py-1 text-xs font-normal transition-all',
                          category !== cat.value && 'hover:bg-accent text-muted-foreground'
                        )}
                        onClick={() => setCategory(cat.value)}
                      >
                        {cat.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Scrollable List */}
                <div className="scrollbar-thin scrollbar-thumb-muted-foreground/20 h-[300px] overflow-y-auto">
                  {filteredFonts.length === 0 ? (
                    <div className="text-muted-foreground flex h-full flex-col items-center justify-center space-y-2 p-8 text-center">
                      <Search className="h-8 w-8 opacity-20" />
                      <p className="text-sm">No se encontraron fuentes</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-1">
                      {filteredFonts.slice(0, visibleCount).map((font) => (
                        <button
                          key={font.name}
                          type="button"
                          onClick={() => handleSelect(font.name, font.url)}
                          className={cn(
                            'group hover:bg-accent/50 relative flex w-full flex-col items-start gap-1 overflow-hidden rounded-lg px-4 py-3 text-left transition-all',
                            value === font.name ? 'bg-accent ring-border shadow-sm ring-1' : ''
                          )}
                        >
                          {/* Font Name Tag */}
                          <div className="flex w-full items-center justify-between">
                            <span
                              className={cn(
                                'text-muted-foreground group-hover:text-foreground text-[10px] font-semibold tracking-wider uppercase transition-colors',
                                value === font.name && 'text-primary'
                              )}
                            >
                              {font.name} · {font.category}
                            </span>
                            {value === font.name && (
                              <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                            )}
                          </div>

                          {/* Live Preview */}
                          <span
                            className="w-full truncate pr-8 text-xl leading-none"
                            style={{ fontFamily: font.name }}
                          >
                            {previewText || font.name}
                          </span>

                          {/* Selected Check */}
                          {value === font.name && (
                            <Check className="text-primary absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                          )}
                        </button>
                      ))}

                      {/* Interactive Scroll Trigger */}
                      {filteredFonts.length > visibleCount && (
                        <div ref={loadMoreRef} className="py-4 text-center">
                          <Loader2 className="text-muted-foreground/50 mx-auto h-5 w-5 animate-spin" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Count */}
                <div className="bg-muted/10 text-muted-foreground border-t p-2 text-center text-[10px]">
                  Mostrando {Math.min(visibleCount, filteredFonts.length)} de {filteredFonts.length}{' '}
                  fuentes
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {description && <p className="text-muted-foreground text-xs">{description}</p>}
    </div>
  )
}
