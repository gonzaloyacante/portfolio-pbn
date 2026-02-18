'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

interface IconPickerProps {
  value: string
  onChange: (icon: string) => void
  label?: string
  description?: string
}

// Colección de emojis organizados por categoría
const EMOJI_CATEGORIES = {
  'Maquillaje y Belleza': [
    '💄',
    '💋',
    '👄',
    '💅',
    '✨',
    '🌟',
    '⭐',
    '💫',
    '🎀',
    '🎗️',
    '👁️',
    '👀',
    '🦋',
    '🌸',
    '🌺',
    '🌹',
    '🌷',
    '💐',
    '🌻',
    '🌼',
    '💎',
    '💍',
    '🩷',
    '💜',
    '💖',
    '💝',
    '💗',
    '💓',
    '💞',
    '💕',
  ],
  Profesional: [
    '📸',
    '🎬',
    '🎥',
    '📹',
    '🎭',
    '🎨',
    '🖌️',
    '✏️',
    '📝',
    '📋',
    '💼',
    '🏆',
    '🎯',
    '📊',
    '📈',
    '✅',
    '⚡',
    '🔥',
    '💡',
    '🎓',
    '🤝',
    '👋',
    '👍',
    '👏',
    '💪',
    '🙌',
    '✌️',
    '🤟',
    '🖐️',
    '👆',
  ],
  Comunicación: [
    '📧',
    '📩',
    '✉️',
    '📨',
    '📬',
    '📭',
    '📮',
    '📪',
    '📫',
    '💬',
    '💭',
    '🗨️',
    '🗯️',
    '📞',
    '📱',
    '📲',
    '☎️',
    '🌐',
    '🔗',
    '📍',
  ],
  Social: [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '😊',
    '😍',
    '🥰',
    '😘',
    '🤩',
    '😎',
    '🥳',
    '🎉',
    '🎊',
    '🎁',
    '🎈',
  ],
  Navegación: [
    '🏠',
    '🏡',
    '🏢',
    '📁',
    '📂',
    '📰',
    '📄',
    '📃',
    '📑',
    '🔖',
    '🔍',
    '🔎',
    '⚙️',
    '🔧',
    '🔨',
    '🛠️',
    '🔐',
    '🔒',
    '🔓',
    '🔑',
    '↗️',
    '↘️',
    '↙️',
    '↖️',
    '⬆️',
    '⬇️',
    '➡️',
    '⬅️',
    '↩️',
    '↪️',
  ],
  'Arte y Creatividad': [
    '🎨',
    '🖼️',
    '🖌️',
    '🎭',
    '🎪',
    '🎠',
    '🎡',
    '🎢',
    '🎯',
    '🎲',
    '🧵',
    '🧶',
    '👗',
    '👠',
    '👡',
    '👢',
    '👒',
    '🎩',
    '👑',
    '💐',
  ],
  'Tiempo y Calendario': [
    '📅',
    '📆',
    '🗓️',
    '⏰',
    '⏱️',
    '⏲️',
    '🕐',
    '🕑',
    '🕒',
    '🕓',
    '🌅',
    '🌄',
    '🌇',
    '🌆',
    '🌃',
    '🌙',
    '🌚',
    '🌝',
    '🌞',
    '☀️',
  ],
  Naturaleza: [
    '🌸',
    '🌺',
    '🌹',
    '🌷',
    '🌻',
    '🌼',
    '💐',
    '🍀',
    '🌿',
    '🍃',
    '🌱',
    '🌲',
    '🌳',
    '🌴',
    '🌵',
    '🍂',
    '🍁',
    '🍄',
    '🌾',
    '🪻',
  ],
}

export default function IconPicker({ value, onChange, label, description }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Cerrar picker al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtrar emojis
  const allEmojis = useMemo(() => {
    return Object.entries(EMOJI_CATEGORIES).flatMap(([category, emojis]) =>
      emojis.map((emoji) => ({ emoji, category }))
    )
  }, [])

  const filteredEmojis = useMemo(() => {
    if (!search && !activeCategory) return allEmojis

    return allEmojis.filter(({ emoji, category }) => {
      const matchesSearch = !search || emoji.includes(search)
      const matchesCategory = !activeCategory || category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory, allEmojis])

  return (
    <div className="space-y-2" ref={pickerRef}>
      {label && <label className="text-foreground block text-sm font-bold">{label}</label>}
      {description && <p className="text-muted-foreground text-xs">{description}</p>}

      {/* Input principal */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="border-input bg-background hover:bg-accent hover:border-accent-foreground flex w-full items-center gap-3 rounded-2xl border p-3 transition-colors"
        >
          <span className="text-3xl">{value || '📷'}</span>
          <span className="text-muted-foreground flex-1 text-left text-sm">
            {value ? 'Click para cambiar' : 'Seleccionar icono'}
          </span>
          <svg
            className={`text-muted-foreground h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="border-border bg-popover absolute top-full left-0 z-50 mt-2 w-80 rounded-2xl border p-4 shadow-xl backdrop-blur-md">
            {/* Búsqueda */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar o pegar emoji..."
              aria-label="Buscar emoji"
              className="border-input bg-input text-foreground placeholder:text-muted-foreground focus:border-ring mb-3 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
            />

            {/* Categorías */}
            <div className="mb-3 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
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
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
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

            {/* Grid de emojis */}
            <div className="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto">
              {filteredEmojis.map(({ emoji }, index) => (
                <button
                  key={`${emoji}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(emoji)
                    setIsOpen(false)
                  }}
                  className={`hover:bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all hover:scale-110 ${
                    value === emoji ? 'bg-primary/20 ring-primary ring-2' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {filteredEmojis.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No se encontraron iconos
              </p>
            )}

            {/* Input manual */}
            <div className="border-border mt-4 border-t pt-4">
              <p className="text-muted-foreground mb-2 text-xs">O pega cualquier emoji:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="🎨"
                  aria-label="Pegar emoji personalizado"
                  className="border-input bg-input text-foreground placeholder:text-muted-foreground focus:border-ring flex-1 rounded-xl border px-3 py-2 text-center text-2xl focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
