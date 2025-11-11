"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Filter, ArrowLeft } from "lucide-react"
import { Button } from "@/components/forms"
import { ProjectCardSkeleton } from "@/components/feedback/skeleton"
import { useProjects, useCategories } from "@/hooks/use-api"

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const { data: projects = [], isLoading: projectsLoading } = useProjects()
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  
  const loading = projectsLoading || categoriesLoading

  const filteredProjects = selectedCategory
    ? projects.filter((p: any) => p.category?.slug === selectedCategory)
    : projects

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-300 dark:bg-rose-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-500"></div>
      </div>

      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-rose-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            PBN
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/projects" className="text-sm font-medium text-rose-600">Proyectos</Link>
            <Link href="/contact" className="text-sm hover:text-rose-600 transition-colors">Contacto</Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-8 hover:bg-rose-100 dark:hover:bg-rose-950 animate-fade-in-left">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>

          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio
            </h1>
            <p className="text-xl text-slate-700 dark:text-zinc-300 max-w-2xl">
              Una selección de mi trabajo más reciente en maquillaje audiovisual y caracterización.
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-10 animate-fade-in-up animation-delay-100">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filtrar por categoría</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                      : "bg-white/80 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-950"
                  }`}
                >
                  Todos
                </button>
                {categories.map((category: any) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                      selectedCategory === category.slug
                        ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                        : "bg-white/80 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-950"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
                <span className="text-5xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                No hay proyectos disponibles
              </h3>
              <p className="text-slate-600 dark:text-zinc-400">
                {selectedCategory ? "Intenta con otra categoría" : "Próximamente habrá contenido nuevo"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project: any, index: number) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.slug}`}
                  className={`group animate-fade-in-up animation-delay-${Math.min(index * 100, 500)}`}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-zinc-800">
                    {/* Image */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      {project.thumbnailUrl ? (
                        <Image
                          src={project.thumbnailUrl}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20">
                          <span className="text-6xl">🎨</span>
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/40 transition-all duration-300" />
                      
                      {/* Category badge */}
                      {project.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg uppercase tracking-wider">
                            {project.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.shortDescription && (
                        <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">
                          {project.shortDescription}
                        </p>
                      )}
                      
                      {/* View more indicator */}
                      <div className="mt-4 flex items-center gap-2 text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xs font-semibold">Ver detalles</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
