'use client'

import { useMemo } from 'react'
import * as LucideIcons from 'lucide-react'
import { LUCIDE_ICON_LIST } from './iconPickerData'

interface IconPickerLucideTabProps {
  value: string
  search: string
  activeCategory: string | null
  onSelect: (iconValue: string) => void
  onCategoryChange: (cat: string | null) => void
}

const LUCIDE_CATEGORIES = Array.from(new Set(LUCIDE_ICON_LIST.map(([, cat]) => cat)))

export function renderLucideIcon(iconValue: string, className?: string): React.ReactNode {
  if (!iconValue.startsWith('lucide:')) return null
  const name = iconValue.slice(7) as keyof typeof LucideIcons
  const Icon = LucideIcons[name] as React.FC<{ className?: string }> | undefined
  if (!Icon) return null
  return <Icon className={className ?? 'h-5 w-5'} />
}

export function IconPickerLucideTab({
  value,
  search,
  activeCategory,
  onSelect,
  onCategoryChange,
}: IconPickerLucideTabProps) {
  const filteredIcons = useMemo(() => {
    return LUCIDE_ICON_LIST.filter(([name, cat]) => {
      const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !activeCategory || cat === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  return (
    <div className="space-y-3">
      {/* Category filters */}
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={`rounded-full px-2 py-1 text-xs font-bold transition-colors ${
            !activeCategory
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          Todos
        </button>
        {LUCIDE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
            className={`rounded-full px-2 py-1 text-xs font-bold transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lucide icon grid */}
      <div className="grid max-h-52 grid-cols-8 gap-1 overflow-y-auto">
        {filteredIcons.map(([name]) => {
          const iconValue = `lucide:${name}`
          const Icon = LucideIcons[name as keyof typeof LucideIcons] as
            | React.FC<{ className?: string }>
            | undefined
          if (!Icon) return null
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onSelect(iconValue)}
              className={`hover:bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:scale-110 ${
                value === iconValue ? 'bg-primary/20 ring-primary ring-2' : ''
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </div>

      {filteredIcons.length === 0 && (
        <p className="text-muted-foreground py-6 text-center text-sm">No se encontraron íconos</p>
      )}
    </div>
  )
}
