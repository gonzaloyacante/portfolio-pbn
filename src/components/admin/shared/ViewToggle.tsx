'use client'

import { LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'

export type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  defaultView?: ViewMode
  onViewChange?: (view: ViewMode) => void
  storageKey?: string // For localStorage persistence
}

export default function ViewToggle({
  defaultView = 'grid',
  onViewChange,
  storageKey = 'admin-view-mode',
}: ViewToggleProps) {
  // Initialize from localStorage or defaultView
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey) as ViewMode | null
      if (saved && (saved === 'grid' || saved === 'list')) {
        return saved
      }
    }
    return defaultView
  })

  const handleToggle = (newView: ViewMode) => {
    setView(newView)
    onViewChange?.(newView)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newView)
    }
  }

  return (
    <div className="border-border bg-card flex gap-1 rounded-lg border p-1">
      <Button
        variant={view === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleToggle('grid')}
        className="gap-2"
      >
        <LayoutGrid size={16} />
        Grid
      </Button>
      <Button
        variant={view === 'list' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleToggle('list')}
        className="gap-2"
      >
        <List size={16} />
        Lista
      </Button>
    </div>
  )
}
