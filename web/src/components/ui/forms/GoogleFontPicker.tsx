'use client'

import { useState } from 'react'
import { ChevronsUpDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useGoogleFontPicker } from './useGoogleFontPicker'
import { GoogleFontPickerModal } from './GoogleFontPickerModal'

interface GoogleFontPickerProps {
  value: string
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

  const {
    search, setSearch,
    category, setCategory,
    loading, error,
    previewText, setPreviewText,
    filteredFonts, visibleCount, loadMoreRef,
  } = useGoogleFontPicker({ value, open })

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
              {loading ? 'Cargando biblioteca...' : error ? 'Error al cargar' : value || 'Seleccionar fuente'}
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

      <GoogleFontPickerModal
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        filteredFonts={filteredFonts}
        visibleCount={visibleCount}
        loadMoreRef={loadMoreRef}
        error={error}
        onSelect={handleSelect}
      />
    </>
  )
}

