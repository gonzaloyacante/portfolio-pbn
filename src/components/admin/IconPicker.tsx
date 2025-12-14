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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}

      {/* Input principal */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white p-3 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800"
        >
          <span className="text-3xl">{value || '📷'}</span>
          <span className="flex-1 text-left text-sm text-gray-500">
            {value ? 'Click para cambiar' : 'Seleccionar icono'}
          </span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            {/* Búsqueda */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar o pegar emoji..."
              className="focus:border-primary focus:ring-primary/20 mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
            />

            {/* Categorías */}
            <div className="mb-3 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                  !activeCategory
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Todos
              </button>
              {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
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
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === emoji ? 'bg-primary/20 ring-primary ring-2' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {filteredEmojis.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No se encontraron iconos</p>
            )}

            {/* Input manual */}
            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="mb-2 text-xs text-gray-500">O pega cualquier emoji:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="🎨"
                  className="focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-2xl focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
