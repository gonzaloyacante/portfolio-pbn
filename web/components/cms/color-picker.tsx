"use client"

import { useState } from "react"
import { Check, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./form-components"

const PRESET_COLORS = [
  // Neutros
  { name: "Blanco", value: "#FFFFFF" },
  { name: "Negro", value: "#000000" },
  { name: "Gris Claro", value: "#F3F4F6" },
  { name: "Gris", value: "#9CA3AF" },
  { name: "Gris Oscuro", value: "#374151" },
  
  // Primarios
  { name: "Azul", value: "#3B82F6" },
  { name: "Rojo", value: "#EF4444" },
  { name: "Amarillo", value: "#F59E0B" },
  
  // Secundarios
  { name: "Verde", value: "#10B981" },
  { name: "Morado", value: "#8B5CF6" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Naranja", value: "#F97316" },
  { name: "Turquesa", value: "#06B6D4" },
  { name: "Lima", value: "#84CC16" },
  
  // Paletas profesionales
  { name: "Índigo", value: "#6366F1" },
  { name: "Fucsia", value: "#D946EF" },
  { name: "Esmeralda", value: "#059669" },
  { name: "Ámbar", value: "#D97706" },
]

const COLOR_PALETTES = [
  {
    name: "Elegante",
    colors: ["#1E293B", "#475569", "#94A3B8", "#E2E8F0", "#F8FAFC"]
  },
  {
    name: "Primavera",
    colors: ["#FDF4FF", "#FAE8FF", "#F0ABFC", "#E879F9", "#C026D3"]
  },
  {
    name: "Océano",
    colors: ["#F0F9FF", "#BAE6FD", "#38BDF8", "#0284C7", "#075985"]
  },
  {
    name: "Bosque",
    colors: ["#F0FDF4", "#BBF7D0", "#4ADE80", "#16A34A", "#15803D"]
  },
  {
    name: "Atardecer",
    colors: ["#FFF7ED", "#FFEDD5", "#FB923C", "#EA580C", "#C2410C"]
  },
  {
    name: "Noche",
    colors: ["#F5F3FF", "#DDD6FE", "#A78BFA", "#7C3AED", "#5B21B6"]
  },
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  showPalettes?: boolean
}

export function ColorPicker({ value, onChange, label, showPalettes = true }: ColorPickerProps) {
  const [showPresets, setShowPresets] = useState(false)

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <div className="flex gap-3">
        {/* Color picker nativo */}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 w-20 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
          />
        </div>

        {/* Input de texto */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />

        {/* Botón de presets */}
        <button
          onClick={() => setShowPresets(!showPresets)}
          className={cn(
            "px-4 py-2 rounded-lg border-2 transition-colors",
            showPresets
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
              : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
        >
          <Palette className="h-5 w-5" />
        </button>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Vista Previa</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{value}</p>
        </div>
      </div>

      {/* Colores Predefinidos */}
      {showPresets && (
        <div className="space-y-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Colores Básicos</h4>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((preset) => {
                const isSelected = value.toUpperCase() === preset.value.toUpperCase()
                return (
                  <button
                    key={preset.value}
                    onClick={() => onChange(preset.value)}
                    className={cn(
                      "relative h-12 rounded-lg border-2 transition-all",
                      isSelected
                        ? "border-blue-500 scale-110 shadow-lg"
                        : "border-gray-300 dark:border-gray-600 hover:scale-105"
                    )}
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white drop-shadow-lg" style={{
                          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                        }} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {showPalettes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Paletas Temáticas</h4>
              <div className="space-y-3">
                {COLOR_PALETTES.map((palette) => (
                  <div key={palette.name} className="space-y-1.5">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{palette.name}</p>
                    <div className="flex gap-2">
                      {palette.colors.map((color, idx) => {
                        const isSelected = value.toUpperCase() === color.toUpperCase()
                        return (
                          <button
                            key={idx}
                            onClick={() => onChange(color)}
                            className={cn(
                              "relative flex-1 h-10 rounded-lg border-2 transition-all",
                              isSelected
                                ? "border-blue-500 scale-105 shadow-lg"
                                : "border-gray-300 dark:border-gray-600 hover:scale-105"
                            )}
                            style={{ backgroundColor: color }}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white drop-shadow-lg" style={{
                                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                                }} />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
