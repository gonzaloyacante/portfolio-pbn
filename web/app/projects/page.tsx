"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string
  thumbnailUrl: string
  featured: boolean
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await apiClient.getProjects()
        setProjects(data)
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header minimalista */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">PBN</Link>
          <div className="flex gap-6 items-center">
            <Link href="/projects" className="text-sm font-medium">Proyectos</Link>
            <Link href="/contact" className="text-sm hover:text-zinc-600 transition">Contacto</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">Proyectos</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-16 max-w-2xl">
            Una selección de mi trabajo más reciente en maquillaje audiovisual.
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3 animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-600 dark:text-zinc-400">No hay proyectos disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      {project.thumbnailUrl ? (
                        <Image
                          src={project.thumbnailUrl}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">🎨</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-zinc-600 transition">
                        {project.title}
                      </h3>
                      {project.shortDescription && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {project.shortDescription}
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
