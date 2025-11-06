"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import ProjectCard from "./project-card"
import { Button } from "./button"
import { ImageWithFallback } from "./image-with-fallback"
import { ImageModal } from "./image-modal"

interface ProjectsGridProps {
  onNavigate: (page: string) => void
  selectedProject?: string | null
  onSelectProject?: (projectId: string | null) => void
}

const projectCategories = [
  {
    id: "sesiones",
    title: "Sesiones de fotos",
    description: "Sesiones fotográficas profesionales de maquillaje",
    category: "Fotografía",
    image: "/professional-makeup-photography-session.jpg",
    images: Array(8).fill("/professional-makeup-photography-session.jpg"),
  },
  {
    id: "fx",
    title: "FX",
    description: "Efectos especiales y maquillaje artístico",
    category: "Efectos",
    image: "/special-effects-makeup-art.jpg",
    images: Array(8).fill("/special-effects-makeup-art.jpg"),
  },
  {
    id: "teatro",
    title: "Teatro",
    description: "Maquillaje para producciones teatrales",
    category: "Teatro",
    image: "/theatrical-makeup-production.jpg",
    images: Array(8).fill("/theatrical-makeup-production.jpg"),
  },
  {
    id: "fantasia",
    title: "Maquillaje fantasía",
    description: "Diseños creativos y fantásticos",
    category: "Fantasía",
    image: "/fantasy-creative-makeup-design.jpg",
    images: Array(8).fill("/fantasy-creative-makeup-design.jpg"),
  },
  {
    id: "rodajes",
    title: "Rodajes",
    description: "Maquillaje para cine y televisión",
    category: "Cine",
    image: "/film-television-makeup-production.jpg",
    images: Array(8).fill("/film-television-makeup-production.jpg"),
  },
  {
    id: "social",
    title: "Maquillaje social",
    description: "Maquillaje para eventos y ocasiones especiales",
    category: "Social",
    image: "/social-event-makeup-special-occasion.jpg",
    images: Array(8).fill("/social-event-makeup-special-occasion.jpg"),
  },
]

export default function ProjectsGrid({ onNavigate, selectedProject, onSelectProject }: ProjectsGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const project = projectCategories.find((p) => p.id === selectedProject)

  if (selectedProject) {
    return (
      <section className="py-8 md:py-24 px-4 md:px-8 min-h-screen animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => onSelectProject?.(null)}
            variant="primary"
            size="md"
            className="mb-8 md:mb-12 animate-slide-up"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver a proyectos
          </Button>

          {/* Section Title */}
          <div className="mb-8 md:mb-12 animate-slide-up" style={{ animationDelay: "50ms" }}>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">{project?.title}</h3>
            <p className="text-base md:text-lg text-muted">{project?.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {project?.images.map((image, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className="aspect-square rounded-lg overflow-hidden animate-slide-up hover:shadow-lg transition-all duration-300 group cursor-pointer"
                style={{ animationDelay: `${i * 30}ms` }}
                aria-label={`Abrir imagen ${i + 1}`}
              >
                <ImageWithFallback
                  src={image || "/placeholder.svg"}
                  alt={`${project?.title} - Imagen ${i + 1}`}
                  width={300}
                  height={300}
                  className="group-hover:scale-110"
                  objectFit="cover"
                />
              </button>
            ))}
          </div>
        </div>

        <ImageModal
          isOpen={selectedImageIndex !== null}
          images={project?.images || []}
          initialIndex={selectedImageIndex || 0}
          title={project?.title}
          onClose={() => setSelectedImageIndex(null)}
        />
      </section>
    )
  }

  return (
    <section className="py-8 md:py-24 px-4 md:px-8 min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-card mb-3 md:mb-4">Make-up Portfolio</h2>
          <p className="text-base md:text-lg text-muted max-w-2xl">
            Explora mis trabajos en diferentes categorías de maquillaje profesional
          </p>
        </div>

        {/* Featured Image */}
        <button
          onClick={() => {
            onSelectProject?.("sesiones")
            setSelectedImageIndex(0)
          }}
          className="mb-12 md:mb-16 rounded-xl md:rounded-2xl overflow-hidden h-48 md:h-96 animate-slide-up group cursor-pointer w-full"
          style={{ animationDelay: "50ms" }}
          aria-label="Ver galería destacada"
        >
          <ImageWithFallback
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/makeup-photography-session-ZYS4gvyxpq5VhSuQhUnCOfntUBOIKF.jpg"
            alt="Portfolio Featured"
            className="group-hover:scale-110 w-full h-full"
            objectFit="cover"
          />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {projectCategories.map((cat, index) => (
            <div key={cat.id} className="animate-slide-up" style={{ animationDelay: `${(index + 2) * 50}ms` }}>
              <ProjectCard
                id={cat.id}
                title={cat.title}
                description={cat.description}
                category={cat.category}
                image={cat.image}
                onClick={() => onSelectProject?.(cat.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
