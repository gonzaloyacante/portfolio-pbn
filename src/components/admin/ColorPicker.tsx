'use client'

import { useState, useRef, useEffect } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  description?: string
}

// Paleta de colores predefinidos basada en el diseño de Canva
const PRESET_COLORS = [
  // Rosa y magenta
  '#fff1f9',
  '#ffd6ed',
  '#ffaadd',
  '#ff80bf',
  '#ff66b2',
  '#ffa1da',
  '#ff4db2',
  '#ff1a8c',
  // Rojo vino
  '#6c0a0a',
  '#7a2556',
  '#581c3c',
  '#511a3a',
  '#4a1535',
  '#3d1029',
  '#2d0a1e',
  '#1f0614',
  // Neutros
  '#ffffff',
  '#f9fafb',
  '#e5e7eb',
  '#9ca3af',
  '#6b7280',
  '#374151',
  '#1f2937',
  '#000000',
  // Pastel
  '#fef3c7',
  '#ddd6fe',
  '#bfdbfe',
  '#a7f3d0',
  '#fecaca',
  '#fbcfe8',
  '#e9d5ff',
  '#c7d2fe',
]

export default function ColorPicker({ value, onChange, label, description }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localValue, setLocalValue] = useState(value)
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

  // Sincronizar valor externo
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleColorChange = (color: string) => {
    setLocalValue(color)
    onChange(color)
  }

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
          className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white p-2 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800"
        >
          <div
            className="h-8 w-8 rounded-md border border-gray-300 shadow-inner dark:border-gray-600"
            style={{ backgroundColor: localValue }}
          />
          <span className="flex-1 text-left font-mono text-sm">{localValue}</span>
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
          <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            {/* Color picker nativo */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="color"
                value={localValue}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-12 w-16 cursor-pointer rounded border-0 bg-transparent"
              />
              <input
                type="text"
                value={localValue}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#000000"
                className="focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            {/* Preview */}
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <div
                className="h-10 w-10 rounded-lg shadow-md"
                style={{ backgroundColor: localValue }}
              />
              <div className="text-sm">
                <p className="font-medium">Vista previa</p>
                <p className="text-gray-500 dark:text-gray-400">{localValue}</p>
              </div>
            </div>

            {/* Paleta de colores */}
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Colores sugeridos
            </p>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    handleColorChange(color)
                    setIsOpen(false)
                  }}
                  className={`h-8 w-full rounded-md border-2 transition-transform hover:scale-110 ${
                    localValue === color
                      ? 'border-primary ring-primary ring-2 ring-offset-2'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
