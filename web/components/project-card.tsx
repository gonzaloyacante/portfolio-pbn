"use client"

import { ImageWithFallback } from "./image-with-fallback"

interface ProjectCardProps {
  id: string
  title: string
  description?: string
  image?: string
  category?: string
  onClick?: () => void
  featured?: boolean
}

export default function ProjectCard({
  title,
  description,
  image,
  category,
  onClick,
  featured = false,
}: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full hover:scale-[1.02] ${
        featured ? "col-span-1 md:col-span-2 row-span-2" : ""
      }`}
    >
      {/* Background Image with Fallback */}
      <div className={`relative w-full ${featured ? "h-96" : "h-64"} overflow-hidden bg-card`}>
        <ImageWithFallback
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full group-hover:scale-110 transition-transform duration-500"
          objectFit="cover"
        />

        {/* Gradient Overlay - Always visible, more prominent on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300" />
        
        {/* Animated shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>

      {/* Category Badge */}
      {category && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg uppercase tracking-wider group-hover:scale-110 transition-transform duration-300">
            {category}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300 drop-shadow-lg">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-white/95 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 line-clamp-2 drop-shadow">
            {description}
          </p>
        )}
        
        {/* View More indicator */}
        <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
          <span className="text-xs font-semibold text-white/90">Ver proyecto</span>
          <svg className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}
