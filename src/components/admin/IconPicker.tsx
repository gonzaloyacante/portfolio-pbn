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
      {label && (
        <label className="text-wine dark:text-pink-light block text-sm font-bold">{label}</label>
      )}
      {description && <p className="text-wine/50 dark:text-pink-light/50 text-xs">{description}</p>}

      {/* Input principal */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="border-wine/20 bg-pink-light/30 hover:border-wine/40 dark:border-pink-light/20 dark:bg-purple-dark/20 dark:hover:border-pink-hot/40 flex w-full items-center gap-3 rounded-2xl border-2 p-3 transition-colors"
        >
          <span className="text-3xl">{value || '📷'}</span>
          <span className="text-wine/60 dark:text-pink-light/60 flex-1 text-left text-sm">
            {value ? 'Click para cambiar' : 'Seleccionar icono'}
          </span>
          <svg
            className={`text-wine/40 dark:text-pink-light/40 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="border-wine/10 dark:border-pink-light/10 dark:bg-purple-dark/95 absolute top-full left-0 z-50 mt-2 w-80 rounded-2xl border bg-white/90 p-4 shadow-xl backdrop-blur-md">
            {/* Búsqueda */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar o pegar emoji..."
              className="border-wine/10 bg-pink-light/30 text-wine placeholder:text-wine/40 focus:border-wine/40 dark:border-pink-light/10 dark:bg-purple-dark/50 dark:text-pink-light dark:placeholder:text-pink-light/40 dark:focus:border-pink-hot/40 mb-3 w-full rounded-xl border-2 px-3 py-2 text-sm focus:outline-none"
            />

            {/* Categorías */}
            <div className="mb-3 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`rounded-full px-2 py-1 text-xs font-bold transition-colors ${
                  !activeCategory
                    ? 'bg-pink-hot text-white'
                    : 'bg-wine/5 text-wine/60 hover:bg-wine/10 dark:bg-pink-light/5 dark:text-pink-light/60 dark:hover:bg-pink-light/10'
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
                      ? 'bg-pink-hot text-white'
                      : 'bg-wine/5 text-wine/60 hover:bg-wine/10 dark:bg-pink-light/5 dark:text-pink-light/60 dark:hover:bg-pink-light/10'
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
                  className={`hover:bg-wine/10 dark:hover:bg-pink-light/10 flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all hover:scale-110 ${
                    value === emoji ? 'bg-pink-hot/20 ring-pink-hot ring-2' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {filteredEmojis.length === 0 && (
              <p className="text-wine/40 dark:text-pink-light/40 py-8 text-center text-sm">
                No se encontraron iconos
              </p>
            )}

            {/* Input manual */}
            <div className="border-wine/10 dark:border-pink-light/10 mt-4 border-t pt-4">
              <p className="text-wine/50 dark:text-pink-light/50 mb-2 text-xs">
                O pega cualquier emoji:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="🎨"
                  className="border-wine/10 bg-pink-light/30 text-wine placeholder:text-wine/20 focus:border-wine/40 dark:border-pink-light/10 dark:bg-purple-dark/50 dark:text-pink-light dark:focus:border-pink-hot/40 flex-1 rounded-xl border-2 px-3 py-2 text-center text-2xl focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
