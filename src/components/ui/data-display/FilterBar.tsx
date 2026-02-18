'use client'

import { useState, useMemo } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Button, Badge } from '@/components/ui'

interface FilterBarProps {
  categories: { id: string; name: string }[]
  selectedCategory?: string
  onCategoryChange: (categoryId?: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  showActive?: boolean
  onActiveChange: (show?: boolean) => void
  onClearFilters: () => void
  totalCount: number
  filteredCount: number
}

export default function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  showActive,
  onActiveChange,
  onClearFilters,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters = useMemo(() => {
    return selectedCategory !== undefined || searchTerm !== '' || showActive !== undefined
  }, [selectedCategory, searchTerm, showActive])

  return (
    <div className="space-y-4">
      {/* Mobile Toggle */}
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="gap-2">
          <Filter size={16} />
          Filtros
          {hasActiveFilters && (
            <Badge variant="info" className="ml-1 h-5 px-1.5 text-xs">
              {filteredCount}/{totalCount}
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-2">
            <X size={16} />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className={`flex flex-wrap items-center gap-3 ${isOpen ? 'flex' : 'hidden lg:flex'}`}>
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar proyectos..."
            aria-label="Buscar proyectos"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          className="border-border bg-background text-foreground focus:ring-primary rounded-md border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Active Status Filter */}
        <div className="flex gap-2">
          <Button
            variant={showActive === true ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onActiveChange(showActive === true ? undefined : true)}
          >
            Activos
          </Button>
          <Button
            variant={showActive === false ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onActiveChange(showActive === false ? undefined : false)}
          >
            Ocultos
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-2">
            <X size={16} />
            Limpiar
            <Badge variant="info" className="ml-1">
              {filteredCount}
            </Badge>
          </Button>
        )}

        {/* Count Badge (desktop) */}
        {!hasActiveFilters && (
          <Badge variant="outline" className="hidden lg:flex">
            {totalCount} proyectos
          </Badge>
        )}
      </div>
    </div>
  )
}
