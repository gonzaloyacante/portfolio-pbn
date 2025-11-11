"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface SpacingSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: "padding" | "margin" | "gap"
}

const SPACING_OPTIONS = [
  { value: "0.5rem", label: "Muy Pequeño", pixels: "8px", visual: "h-2" },
  { value: "1rem", label: "Pequeño", pixels: "16px", visual: "h-4" },
  { value: "1.5rem", label: "Mediano", pixels: "24px", visual: "h-6" },
  { value: "2rem", label: "Normal", pixels: "32px", visual: "h-8" },
  { value: "3rem", label: "Grande", pixels: "48px", visual: "h-12" },
  { value: "4rem", label: "Muy Grande", pixels: "64px", visual: "h-16" },
  { value: "6rem", label: "Extra Grande", pixels: "96px", visual: "h-24" },
]

export function SpacingSelector({ label, value, onChange, type = "padding" }: SpacingSelectorProps) {
  const [showCustom, setShowCustom] = useState(false)

  const icons = {
    padding: "📏",
    margin: "↔️",
    gap: "⬌"
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {icons[type]} {label}
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {SPACING_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative p-4 rounded-lg border-2 transition-all text-left
              ${value === option.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
              }
            `}
          >
            {value === option.value && (
              <div className="absolute top-2 right-2">
                <Check size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {option.label}
              </div>
              <div className={`bg-blue-500 dark:bg-blue-400 rounded ${option.visual}`} />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {option.pixels}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Opción personalizada */}
      <button
        type="button"
        onClick={() => setShowCustom(!showCustom)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        {showCustom ? "Ocultar" : "Usar"} valor personalizado
      </button>

      {showCustom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej: 2.5rem, 40px"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      )}
    </div>
  )
}

interface ShadowSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const SHADOW_OPTIONS = [
  { value: "none", label: "Sin Sombra", description: "Completamente plano" },
  { value: "0 1px 2px rgba(0,0,0,0.05)", label: "Sutil", description: "Apenas visible" },
  { value: "0 2px 4px rgba(0,0,0,0.1)", label: "Pequeña", description: "Ligeramente elevado" },
  { value: "0 4px 6px rgba(0,0,0,0.1)", label: "Normal", description: "Claramente elevado" },
  { value: "0 8px 16px rgba(0,0,0,0.15)", label: "Grande", description: "Muy elevado" },
  { value: "0 12px 24px rgba(0,0,0,0.2)", label: "Muy Grande", description: "Flotando" },
  { value: "0 20px 40px rgba(0,0,0,0.25)", label: "Dramática", description: "Máxima profundidad" },
]

export function ShadowSelector({ label, value, onChange }: ShadowSelectorProps) {
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        ✨ {label}
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SHADOW_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative p-4 rounded-lg border-2 transition-all text-left
              ${value === option.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
              }
            `}
          >
            {value === option.value && (
              <div className="absolute top-2 right-2">
                <Check size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </div>
              </div>
              
              {/* Preview de la sombra */}
              <div className="flex justify-center py-4">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"
                  style={{ boxShadow: option.value === "none" ? "none" : option.value }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowCustom(!showCustom)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        {showCustom ? "Ocultar" : "Usar"} valor personalizado
      </button>

      {showCustom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej: 0 4px 6px rgba(0,0,0,0.1)"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      )}
    </div>
  )
}

interface BorderRadiusSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const RADIUS_OPTIONS = [
  { value: "0", label: "Cuadrado", description: "Sin redondeo" },
  { value: "0.25rem", label: "Poco Redondeado", description: "Bordes suaves" },
  { value: "0.5rem", label: "Redondeado", description: "Ligeramente curvo" },
  { value: "0.75rem", label: "Muy Redondeado", description: "Curvas marcadas" },
  { value: "1rem", label: "Extra Redondeado", description: "Muy curvo" },
  { value: "9999px", label: "Circular", description: "Completamente redondo" },
]

export function BorderRadiusSelector({ label, value, onChange }: BorderRadiusSelectorProps) {
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        🔲 {label}
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {RADIUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative p-4 rounded-lg border-2 transition-all text-left
              ${value === option.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
              }
            `}
          >
            {value === option.value && (
              <div className="absolute top-2 right-2">
                <Check size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </div>
              </div>
              
              {/* Preview del border radius */}
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500"
                  style={{ borderRadius: option.value }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowCustom(!showCustom)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        {showCustom ? "Ocultar" : "Usar"} valor personalizado
      </button>

      {showCustom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej: 0.75rem, 12px"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      )}
    </div>
  )
}
