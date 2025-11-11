"use client"

import { useState } from "react"
import { Card } from "./form-components"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const GOOGLE_FONTS = [
  {
    name: "Inter",
    family: "Inter, sans-serif",
    category: "Sans Serif",
    description: "Moderna y legible para interfaces",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  },
  {
    name: "Playfair Display",
    family: "Playfair Display, serif",
    category: "Serif",
    description: "Elegante y clásica",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
  },
  {
    name: "Montserrat",
    family: "Montserrat, sans-serif",
    category: "Sans Serif",
    description: "Geométrica y profesional",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
  },
  {
    name: "Lora",
    family: "Lora, serif",
    category: "Serif",
    description: "Perfecta para lectura larga",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap"
  },
  {
    name: "Raleway",
    family: "Raleway, sans-serif",
    category: "Sans Serif",
    description: "Refinada y distintiva",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap"
  },
  {
    name: "Merriweather",
    family: "Merriweather, serif",
    category: "Serif",
    description: "Ideal para blogs y artículos",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap"
  },
  {
    name: "Poppins",
    family: "Poppins, sans-serif",
    category: "Sans Serif",
    description: "Amigable y moderna",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
  },
  {
    name: "Roboto",
    family: "Roboto, sans-serif",
    category: "Sans Serif",
    description: "Versátil y neutral",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
  },
  {
    name: "Crimson Text",
    family: "Crimson Text, serif",
    category: "Serif",
    description: "Clásica para textos largos",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap"
  },
  {
    name: "Open Sans",
    family: "Open Sans, sans-serif",
    category: "Sans Serif",
    description: "Limpia y muy legible",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap"
  },
  {
    name: "Parisienne",
    family: "Parisienne, cursive",
    category: "Script",
    description: "Elegante y manuscrita",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Parisienne&display=swap"
  },
  {
    name: "Dancing Script",
    family: "Dancing Script, cursive",
    category: "Script",
    description: "Casual y amigable",
    preview: "Aa Bb Cc 123",
    googleUrl: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap"
  },
]

interface FontSelectorProps {
  value: string
  onChange: (font: string) => void
  label?: string
  type: "heading" | "body"
}

export function FontSelector({ value, onChange, label, type: _type }: FontSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredFonts = GOOGLE_FONTS.filter(font => {
    const matchesSearch = font.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || font.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...new Set(GOOGLE_FONTS.map(f => f.category))]

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>}
      
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar tipografía..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              {cat === "all" ? "Todas" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de fuentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {filteredFonts.map((font) => {
          const isSelected = value === font.family
          
          return (
            <Card
              key={font.name}
              padding="md"
              hover
              className={cn(
                "cursor-pointer transition-all relative",
                isSelected && "ring-2 ring-blue-500 shadow-lg"
              )}
              onClick={() => onChange(font.family)}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
              
              <div className="space-y-3">
                {/* Preview grande */}
                <div 
                  className="text-4xl font-medium text-center py-4 border-b border-gray-100 dark:border-gray-700"
                  style={{ fontFamily: font.family }}
                >
                  {font.preview}
                </div>
                
                {/* Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{font.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{font.description}</p>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {font.category}
                  </span>
                </div>

                {/* Sample text */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm" style={{ fontFamily: font.family }}>
                    El veloz murciélago hindú comía feliz cardillo y kiwi.
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredFonts.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No se encontraron tipografías con ese criterio
        </div>
      )}
    </div>
  )
}
