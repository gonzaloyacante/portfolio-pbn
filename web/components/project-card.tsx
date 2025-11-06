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
  id,
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
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 h-full ${
        featured ? "col-span-1 md:col-span-2 row-span-2" : ""
      }`}
    >
      {/* Background Image with Fallback */}
      <div className={`relative w-full ${featured ? "h-96" : "h-64"} overflow-hidden bg-card`}>
        <ImageWithFallback
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full"
          objectFit="cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        {category && <p className="text-xs font-semibold text-white/80 mb-2 uppercase tracking-widest">{category}</p>}
        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-white/90 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </button>
  )
}
