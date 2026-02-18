'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Check, ChevronsUpDown, Search, Loader2, AlertCircle, Type } from 'lucide-react'
import {
  fetchGoogleFonts,
  getFontsByCategory,
  FONT_CATEGORIES,
  type GoogleFont,
} from '@/lib/google-fonts'
import { Button } from '@/components/ui'
import { Modal } from '@/components/ui'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/data-display/Badge'
import { logger } from '@/lib/logger'

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

  // Track which fonts have been loaded into the document head
  const loadedFontsRef = useRef<Set<string>>(new Set())
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 1. Fetch fonts on mount
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
        logger.error('Failed to load fonts', { error: err })
        setError('Error loading fonts.')
      } finally {
        setLoading(false)
      }
    }
    loadFonts()
  }, [])

  // 2. Filter fonts logic
  const filteredFonts = useMemo(() => {
    const byCategory = getFontsByCategory(fonts, category)
    if (!search) return byCategory
    const query = search.toLowerCase()
    return byCategory.filter((font) => font.name.toLowerCase().includes(query))
  }, [fonts, search, category])

  // 3. Infinite Scroll Observer
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
  }, [open, visibleCount, filteredFonts])

  // Reset count when filters change
  useEffect(() => {
    setVisibleCount(20)
  }, [search, category, open])

  // 4. Dynamic Font Loading (Fix for "Preview not working")
  useEffect(() => {
    if (!open) return

    const visibleFontNames = filteredFonts
      .slice(0, visibleCount)
      .map((f) => f.name)
      .filter((name) => !loadedFontsRef.current.has(name))

    if (visibleFontNames.length === 0) return

    // Mark as loaded immediately
    visibleFontNames.forEach((name) => loadedFontsRef.current.add(name))

    // Construct Google Fonts URL
    // Format: https://fonts.googleapis.com/css2?family=Font1&family=Font2&display=swap
    const families = visibleFontNames.map((f) => f.replace(/ /g, '+')).join('&family=')

    if (!families) return

    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Cleanup is not really needed as we want fonts to persist for the session
  }, [open, filteredFonts, visibleCount])

  const handleSelect = (fontName: string, fontUrl: string) => {
    onValueChange(fontName, fontUrl)
    setOpen(false)
    setSearch('')
  }

  return (
    <>
      <div className="space-y-3">
        {label && (
          <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}

        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="border-input hover:bg-accent/50 h-14 w-full justify-between px-4 text-left font-normal transition-all"
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <div className="flex flex-col items-start gap-1 overflow-hidden">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Fuente seleccionada
            </span>
            <span className="truncate text-lg" style={{ fontFamily: value || 'inherit' }}>
              {loading
                ? 'Cargando biblioteca...'
                : error
                  ? 'Error al cargar'
                  : value || 'Seleccionar fuente'}
            </span>
          </div>

          {loading ? (
            <Loader2 className="ml-2 h-5 w-5 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
          )}
        </Button>

        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>

      {/* BIG MODAL IMPLEMENTATION */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Galería de Fuentes" size="xl">
        <div className="flex h-[70vh] flex-col space-y-6">
          {/* Header Controls */}
          <div className="flex-shrink-0 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Search */}
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar familia (ej. Helvetica)..."
                  value={search}
                  autoFocus
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Buscar familia de fuente"
                  className="bg-background border-input focus-visible:ring-primary h-10 w-full rounded-md border pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>
              {/* Preview Text */}
              <div className="relative">
                <Type className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Escribe tu texto de prueba..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  aria-label="Texto de prueba para la fuente"
                  className="bg-accent/30 border-input focus-visible:ring-primary h-10 w-full rounded-md border pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 pb-2">
              {FONT_CATEGORIES.map((cat) => (
                <Badge
                  key={cat.value}
                  variant={category === cat.value ? 'default' : 'outline'}
                  className={cn(
                    'hover:bg-primary/90 cursor-pointer px-4 py-1.5 text-xs transition-all',
                    category !== cat.value && 'hover:bg-accent text-muted-foreground'
                  )}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="scrollbar-thin scrollbar-thumb-border min-h-0 flex-1 overflow-y-auto pr-2">
            {error ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                <div className="bg-destructive/10 text-destructive flex h-16 w-16 items-center justify-center rounded-full">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div className="max-w-md space-y-2">
                  <h4 className="text-lg font-semibold">Error de API Key</h4>
                  <p className="text-muted-foreground text-sm">
                    No se pudieron cargar las fuentes. Verifica que GOOGLE_FONTS_API_KEY esté
                    configurada en tu .env.local
                  </p>
                </div>
              </div>
            ) : filteredFonts.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 text-center opacity-50">
                <Search className="h-12 w-12" />
                <p>No se encontraron fuentes con estos filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredFonts.slice(0, visibleCount).map((font) => (
                  <button
                    key={font.name}
                    onClick={() => handleSelect(font.name, font.url)}
                    className={cn(
                      'group hover:border-primary/50 relative flex flex-col items-start justify-between gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-md',
                      value === font.name
                        ? 'border-primary bg-primary/5 ring-primary ring-1'
                        : 'bg-card'
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                        {font.name}
                      </span>
                      {value === font.name && <Check className="text-primary h-4 w-4" />}
                    </div>

                    {/* The Preview */}
                    <div className="w-full overflow-hidden">
                      <p className="text-2xl whitespace-nowrap" style={{ fontFamily: font.name }}>
                        {previewText || font.name}
                      </p>
                    </div>

                    <div className="w-full text-right">
                      <span className="text-muted-foreground/50 group-hover:text-muted-foreground text-[10px] transition-colors">
                        {font.category}
                      </span>
                    </div>
                  </button>
                ))}

                {/* Loading trigger */}
                {filteredFonts.length > visibleCount && (
                  <div ref={loadMoreRef} className="col-span-full flex justify-center py-8">
                    <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-muted-foreground flex-shrink-0 border-t pt-4 text-center text-xs">
            Mostrando {Math.min(visibleCount, filteredFonts.length)} de {filteredFonts.length}{' '}
            fuentes disponibles
          </div>
        </div>
      </Modal>
    </>
  )
}
