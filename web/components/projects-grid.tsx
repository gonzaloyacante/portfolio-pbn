"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import ProjectCard from "./project-card"
import { Button } from "./button"
import { ImageWithFallback } from "./image-with-fallback"
import { ImageModal } from "./image-modal"
import { apiClient } from "@/lib/api-client"

interface ProjectsGridProps {
  selectedProject?: string | null
  onSelectProject?: (projectId: string | null) => void
}

interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: { name: string; slug: string }
  coverImage: string
  images: Array<{ url: string; alt: string }>
}

export default function ProjectsGrid({ selectedProject, onSelectProject }: ProjectsGridProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const data = await apiClient.getProjects()
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProjects()
  }, [])

  const project = projects.find((p) => p.slug === selectedProject)

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
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt || `${project?.title} - Imagen ${i + 1}`}
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
          images={project?.images.map(img => img.url) || []}
          initialIndex={selectedImageIndex || 0}
          title={project?.title}
          onClose={() => setSelectedImageIndex(null)}
        />
      </section>
    )
  }

  // Loading state
  if (loading) {
    return (
      <section className="py-8 md:py-24 px-4 md:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12 space-y-4">
            <div className="h-12 md:h-16 bg-muted/20 rounded animate-pulse" />
            <div className="h-6 bg-muted/20 rounded w-2/3 animate-pulse" />
          </div>
          
          <div className="mb-12 md:mb-16 h-48 md:h-96 bg-muted/20 rounded-xl md:rounded-2xl animate-pulse" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/3] bg-muted/20 rounded-lg animate-pulse" />
                <div className="h-6 bg-muted/20 rounded animate-pulse" />
                <div className="h-4 bg-muted/20 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
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

        {/* Featured Project */}
        {projects[0] && (
          <button
            onClick={() => {
              onSelectProject?.(projects[0]!.slug)
              setSelectedImageIndex(0)
            }}
            className="mb-12 md:mb-16 rounded-xl md:rounded-2xl overflow-hidden h-48 md:h-96 animate-slide-up group cursor-pointer w-full"
            style={{ animationDelay: "50ms" }}
            aria-label="Ver galería destacada"
          >
            <ImageWithFallback
              src={projects[0]!.coverImage || "/placeholder.svg"}
              alt={projects[0]!.title}
              className="group-hover:scale-110 w-full h-full"
              objectFit="cover"
            />
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {projects.map((proj, index) => (
            <div key={proj.id} className="animate-slide-up" style={{ animationDelay: `${(index + 2) * 50}ms` }}>
              <ProjectCard
                id={proj.slug}
                title={proj.title}
                description={proj.description}
                category={proj.category.name}
                image={proj.coverImage}
                onClick={() => onSelectProject?.(proj.slug)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
