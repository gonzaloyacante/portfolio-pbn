'use client'

import { useMemo } from 'react'
import { EMOJI_CATEGORIES } from './iconPickerData'

interface IconPickerEmojiTabProps {
  value: string
  search: string
  activeCategory: string | null
  onSelect: (emoji: string) => void
  onCategoryChange: (cat: string | null) => void
}

export function IconPickerEmojiTab({
  value,
  search,
  activeCategory,
  onSelect,
  onCategoryChange,
}: IconPickerEmojiTabProps) {
  const allEmojis = useMemo(
    () =>
      Object.entries(EMOJI_CATEGORIES).flatMap(([category, emojis]) =>
        emojis.map((emoji) => ({ emoji, category }))
      ),
    []
  )

  const filteredEmojis = useMemo(() => {
    if (!search && !activeCategory) return allEmojis
    return allEmojis.filter(({ emoji, category }) => {
      const matchesSearch = !search || emoji.includes(search)
      const matchesCategory = !activeCategory || category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory, allEmojis])

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
        {Object.keys(EMOJI_CATEGORIES).map((cat) => (
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

      {/* Emoji grid */}
      <div className="grid max-h-52 grid-cols-8 gap-1 overflow-y-auto">
        {filteredEmojis.map(({ emoji }, index) => (
          <button
            key={`${emoji}-${index}`}
            type="button"
            onClick={() => onSelect(emoji)}
            className={`hover:bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all hover:scale-110 ${
              value === emoji ? 'bg-primary/20 ring-primary ring-2' : ''
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {filteredEmojis.length === 0 && (
        <p className="text-muted-foreground py-6 text-center text-sm">
          No se encontraron emojis
        </p>
      )}
    </div>
  )
}
