"use client"

import { ImageWithFallback } from "@/components/media/image-with-fallback"

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
      className={`group relative overflow-hidden h-full ${
        featured ? "col-span-1 md:col-span-2 row-span-2" : ""
      }`}
      style={{
        borderRadius: 'var(--cms-border-radius, 1rem)',
        boxShadow: 'var(--cms-box-shadow, 0 10px 15px rgba(0,0,0,0.1))',
        transition: `all var(--cms-transition-speed, 0.3s)`,
      }}
    >
      {/* Background Image with Fallback */}
      <div className={`relative w-full ${featured ? "h-96" : "h-64"} overflow-hidden`}
        style={{ backgroundColor: 'var(--cms-background-color, #f5f5f5)' }}
      >
        <ImageWithFallback
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full group-hover:scale-110 transition-transform duration-500"
          objectFit="cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/60"
          style={{ transition: `all var(--cms-transition-speed, 0.3s)` }}
        />
        
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{ transition: `opacity var(--cms-transition-speed, 0.3s)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>

      {/* Category Badge */}
      {category && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-white text-xs font-semibold uppercase tracking-wider group-hover:scale-110"
            style={{
              background: `linear-gradient(to right, var(--cms-primary-color, #E11D48), var(--cms-secondary-color, #8B5CF6))`,
              borderRadius: 'var(--cms-border-radius, 9999px)',
              boxShadow: 'var(--cms-box-shadow, 0 4px 6px rgba(0,0,0,0.1))',
              transition: `transform var(--cms-transition-speed, 0.3s)`,
              fontFamily: 'var(--cms-body-font, Inter, sans-serif)',
            }}
          >
            {category}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:translate-y-0 translate-y-2 drop-shadow-lg"
          style={{
            fontFamily: 'var(--cms-heading-font, Playfair Display, serif)',
            transition: `transform var(--cms-transition-speed, 0.3s)`,
          }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-white/95 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 line-clamp-2 drop-shadow"
            style={{
              fontFamily: 'var(--cms-body-font, Inter, sans-serif)',
              fontSize: 'var(--cms-body-size, 0.875rem)',
              lineHeight: 'var(--cms-line-height, 1.6)',
              transition: `all var(--cms-transition-speed, 0.3s)`,
            }}
          >
            {description}
          </p>
        )}
        
        {/* View More indicator */}
        <div className="mt-3 flex items-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 delay-75"
          style={{ 
            gap: 'var(--cms-element-spacing, 0.5rem)',
            transition: `all var(--cms-transition-speed, 0.3s)`,
          }}
        >
          <span className="text-xs font-semibold text-white/90"
            style={{ fontFamily: 'var(--cms-body-font, Inter, sans-serif)' }}
          >
            Ver proyecto
          </span>
          <svg className="w-4 h-4 text-white/90 group-hover:translate-x-1"
            style={{ transition: `transform var(--cms-transition-speed, 0.3s)` }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}
