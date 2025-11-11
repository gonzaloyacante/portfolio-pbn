"use client"

import { useState } from "react"
import { Check, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export const ANIMATIONS = [
  {
    id: "fade-in",
    name: "Aparecer Suave",
    description: "El elemento aparece gradualmente",
    class: "animate-fade-in"
  },
  {
    id: "slide-up",
    name: "Deslizar Arriba",
    description: "Sube desde abajo",
    class: "animate-slide-up"
  },
  {
    id: "slide-down",
    name: "Deslizar Abajo",
    description: "Baja desde arriba",
    class: "animate-slide-down"
  },
  {
    id: "slide-left",
    name: "Deslizar Izquierda",
    description: "Viene desde la derecha",
    class: "animate-slide-left"
  },
  {
    id: "slide-right",
    name: "Deslizar Derecha",
    description: "Viene desde la izquierda",
    class: "animate-slide-right"
  },
  {
    id: "zoom-in",
    name: "Acercar",
    description: "Crece desde el centro",
    class: "animate-zoom-in"
  },
  {
    id: "zoom-out",
    name: "Alejar",
    description: "Encoge hacia el centro",
    class: "animate-zoom-out"
  },
  {
    id: "bounce-in",
    name: "Rebotar",
    description: "Entrada con rebote",
    class: "animate-bounce-in"
  },
  {
    id: "flip-in-x",
    name: "Voltear Horizontal",
    description: "Giro en eje X",
    class: "animate-flip-in-x"
  },
  {
    id: "flip-in-y",
    name: "Voltear Vertical",
    description: "Giro en eje Y",
    class: "animate-flip-in-y"
  },
  {
    id: "rotate-in",
    name: "Rotar",
    description: "Giro completo",
    class: "animate-rotate-in"
  },
  {
    id: "blur-in",
    name: "Enfocar",
    description: "De desenfocado a nítido",
    class: "animate-blur-in"
  },
  {
    id: "shake",
    name: "Sacudir",
    description: "Movimiento de lado a lado",
    class: "animate-shake"
  },
  {
    id: "pulse",
    name: "Pulsar",
    description: "Efecto de latido",
    class: "animate-pulse"
  },
  {
    id: "none",
    name: "Sin Animación",
    description: "Aparición instantánea",
    class: "animate-none"
  },
]

interface AnimationSelectorProps {
  value: string
  onChange: (animation: string) => void
  label?: string
}

export function AnimationSelector({ value, onChange, label }: AnimationSelectorProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAnimations = ANIMATIONS.filter(anim =>
    anim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anim.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const playAnimation = (id: string) => {
    setPlayingId(id)
    setTimeout(() => setPlayingId(null), 1000)
  }

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>}
      
      {/* Búsqueda */}
      <input
        type="text"
        placeholder="Buscar animación..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Grid de animaciones - Mejorado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
        {filteredAnimations.map((animation) => {
          const isSelected = value === animation.id
          const isPlaying = playingId === animation.id
          
          return (
            <button
              key={animation.id}
              onClick={() => onChange(animation.id)}
              className={cn(
                "group relative p-3 rounded-xl border-2 transition-all duration-200",
                "hover:scale-[1.02] hover:shadow-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isSelected 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md" 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300"
              )}
            >
              {/* Check badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-lg z-10">
                  <Check className="h-3 w-3" />
                </div>
              )}
              
              {/* Preview area - Más grande */}
              <div className="h-28 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg relative overflow-hidden mb-3">
                {/* Preview box */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-lg shadow-xl transition-all",
                    isPlaying 
                      ? animation.class 
                      : "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500",
                    !isPlaying && "opacity-70 group-hover:opacity-100 group-hover:scale-110"
                  )}
                />
                
                {/* Play button overlay - NO button, solo div clickeable */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    playAnimation(animation.id)
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      playAnimation(animation.id)
                    }
                  }}
                  className={cn(
                    "absolute inset-0 flex items-center justify-center cursor-pointer",
                    "bg-black/0 hover:bg-black/10 dark:hover:bg-black/30",
                    "transition-all duration-200"
                  )}
                  title="Reproducir animación"
                >
                  <div className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg backdrop-blur-sm transform group-hover:scale-110 transition-transform pointer-events-none">
                    <Play className="h-5 w-5 text-blue-600 dark:text-blue-400 fill-current" />
                  </div>
                </div>
              </div>
              
              {/* Info - Más compacta */}
              <div className="text-left">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5 line-clamp-1">
                  {animation.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {animation.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {filteredAnimations.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No se encontraron animaciones
        </div>
      )}
    </div>
  )
}
