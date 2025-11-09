'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  StarOff,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnailUrl: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured: boolean
  categoryId: string
  category: { id: string; name: string; slug: string }
  images: Array<{ id: string; url: string; alt: string; order: number }>
  order: number
  createdAt: string
  updatedAt: string
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const projectsData = await apiClient.getAllProjectsAdmin()
      setProjects(projectsData)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleFeatured = async (projectId: string, currentFeatured: boolean) => {
    try {
      await apiClient.updateProject(projectId, { featured: !currentFeatured })
      loadData()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('¿Estás segura de eliminar este proyecto?')) return
    
    try {
      await apiClient.deleteProject(projectId)
      loadData()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Mis Proyectos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona todos tus trabajos y portfolio
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/30">
            <Plus className="h-5 w-5 mr-2" />
            Crear Proyecto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2 focus:border-rose-300 dark:focus:border-rose-700"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? 'bg-gradient-to-r from-rose-500 to-pink-600' : ''}
              >
                {status === 'all' ? 'Todos' : 
                 status === 'PUBLISHED' ? 'Publicados' :
                 status === 'DRAFT' ? 'Borradores' : 'Archivados'}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay proyectos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? 'No se encontraron proyectos con ese nombre' : 'Comienza creando tu primer proyecto'}
          </p>
          <Link href="/admin/projects/new">
            <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Mi Primer Proyecto
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                {project.thumbnailUrl ? (
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    className={`${
                      project.status === 'PUBLISHED'
                        ? 'bg-green-500'
                        : project.status === 'DRAFT'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    } text-white border-0 shadow-lg`}
                  >
                    {project.status === 'PUBLISHED' ? 'Publicado' :
                     project.status === 'DRAFT' ? 'Borrador' : 'Archivado'}
                  </Badge>
                </div>

                {/* Featured Star */}
                <button
                  onClick={() => toggleFeatured(project.id, project.featured)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:scale-110 transition-transform"
                >
                  {project.featured ? (
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project.category?.name || 'Sin categoría'}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {project.shortDescription || project.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/admin/projects/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-2 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-2 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
