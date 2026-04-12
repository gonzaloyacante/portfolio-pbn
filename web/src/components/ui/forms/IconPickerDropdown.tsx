'use client'

import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { IconPickerEmojiTab } from './IconPickerEmojiTab'
import { IconPickerLucideTab } from './IconPickerLucideTab'

type Tab = 'emoji' | 'lucide'

interface IconPickerDropdownProps {
  value: string
  onSelect: (val: string) => void
  onClose: () => void
}

export function IconPickerDropdown({ value, onSelect, onClose }: IconPickerDropdownProps) {
  const [tab, setTab] = useState<Tab>('emoji')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleTabChange = (t: Tab) => {
    setTab(t)
    setSearch('')
    setActiveCategory(null)
  }

  return (
    <div
      ref={ref}
      className="bg-popover border-border absolute z-50 mt-1 w-80 rounded-xl border shadow-xl"
    >
      {/* Tabs */}
      <div className="flex border-b">
        {(['emoji', 'lucide'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              tab === t
                ? 'border-primary text-primary border-b-2'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'emoji' ? '😊 Emojis' : '✦ Íconos'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="border-border border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder={tab === 'emoji' ? 'Buscar emoji...' : 'Buscar ícono...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent placeholder:text-muted-foreground w-full text-sm outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {tab === 'emoji' ? (
          <IconPickerEmojiTab
            value={value}
            search={search}
            activeCategory={activeCategory}
            onSelect={onSelect}
            onCategoryChange={setActiveCategory}
          />
        ) : (
          <IconPickerLucideTab
            value={value}
            search={search}
            activeCategory={activeCategory}
            onSelect={onSelect}
            onCategoryChange={setActiveCategory}
          />
        )}
      </div>

      {/* Manual input */}
      <div className="border-border border-t px-3 py-2">
        <input
          type="text"
          placeholder="O pegá un emoji directamente..."
          defaultValue=""
          onBlur={(e) => {
            const v = e.target.value.trim()
            if (v) onSelect(v)
          }}
          className="text-muted-foreground placeholder:text-muted-foreground/50 w-full bg-transparent text-xs outline-none"
        />
      </div>
    </div>
  )
}
