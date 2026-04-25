'use client'

import { Search, Check, Loader2, AlertCircle, Type } from 'lucide-react'
import { FONT_CATEGORIES, type GoogleFont } from '@/lib/google-fonts'
import { Modal } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'

interface GoogleFontPickerModalProps {
  open: boolean
  onClose: () => void
  value: string
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  previewText: string
  onPreviewTextChange: (v: string) => void
  filteredFonts: GoogleFont[]
  visibleCount: number
  loadMoreRef: React.RefObject<HTMLDivElement | null>
  error: string | null
  onSelect: (fontName: string, fontUrl: string) => void
}

export function GoogleFontPickerModal({
  open,
  onClose,
  value,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  previewText,
  onPreviewTextChange,
  filteredFonts,
  visibleCount,
  loadMoreRef,
  error,
  onSelect,
}: GoogleFontPickerModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} title="Galería de Fuentes" size="xl">
      <div className="flex h-[70vh] flex-col space-y-6">
        {/* Header Controls */}
        <div className="shrink-0 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar familia (ej. Helvetica)..."
                value={search}
                autoFocus
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Buscar familia de fuente"
                className="bg-background border-input focus-visible:ring-primary h-10 w-full rounded-md border pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div className="relative">
              <Type className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <input
                type="text"
                placeholder="Escribe tu texto de prueba..."
                value={previewText}
                onChange={(e) => onPreviewTextChange(e.target.value)}
                aria-label="Texto de prueba para la fuente"
                className="bg-accent/30 border-input focus-visible:ring-primary h-10 w-full rounded-md border pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pb-2">
            {FONT_CATEGORIES.map((cat) => (
              <Badge
                key={cat.value}
                variant={category === cat.value ? 'default' : 'outline'}
                className={cn(
                  'hover:bg-primary/90 cursor-pointer px-4 py-1.5 text-xs transition-all',
                  category !== cat.value && 'hover:bg-accent text-muted-foreground'
                )}
                onClick={() => onCategoryChange(cat.value)}
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
                  onClick={() => onSelect(font.name, font.url)}
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

              {filteredFonts.length > visibleCount && (
                <div ref={loadMoreRef} className="col-span-full flex justify-center py-8">
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-muted-foreground shrink-0 border-t pt-4 text-center text-xs">
          Mostrando {Math.min(visibleCount, filteredFonts.length)} de {filteredFonts.length} fuentes
          disponibles
        </div>
      </div>
    </Modal>
  )
}
