'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Category, Project, ProjectImage } from '@prisma/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Eye } from 'lucide-react'

import { Button, Card, Badge } from '@/components/ui'
import { reorderProjects, deleteProjectAction } from '@/actions/project.actions'
import FilterBar from '@/components/admin/shared/FilterBar'
import SortableGrid from '@/components/admin/shared/SortableGrid'
import ViewToggle from '@/components/admin/shared/ViewToggle'
import { useToast } from '@/components/ui'

type ProjectWithRelations = Project & {
  category: Category
  images: ProjectImage[]
}

interface ProjectsContentProps {
  projects: ProjectWithRelations[]
  categories: { id: string; name: string }[]
}

export default function ProjectsContent({ projects, categories }: ProjectsContentProps) {
  const router = useRouter()
  const { show } = useToast()

  // State
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [searchTerm, setSearchTerm] = useState('')
  const [showActive, setShowActive] = useState<boolean>()

  // Filter Logic (Memoized)
  const filteredProjects = useMemo(() => {
    let result = [...projects] // Clone to sort safely

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(term))
    }

    if (showActive !== undefined) {
      result = result.filter((p) => p.isActive === showActive)
    }

    // Always sort by sortOrder locally to reflect current state
    result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

    return result
  }, [projects, selectedCategory, searchTerm, showActive])

  // Local state for optimistic reordering
  const [optimisticProjects, setOptimisticProjects] = useState<ProjectWithRelations[]>([])

  // Sync optimistic state with filtered results when filters change
  useEffect(() => {
    setOptimisticProjects(filteredProjects)
  }, [filteredProjects])

  // Handlers
  const handleReorder = async (reorderedItems: ProjectWithRelations[]) => {
    // Optimistic update
    setOptimisticProjects(reorderedItems)

    try {
      await reorderProjects(reorderedItems.map((p) => p.id))
      show({ type: 'success', message: 'Orden actualizado' })
    } catch {
      show({ type: 'error', message: 'Error al reordenar' })
      // Revert on error
      setOptimisticProjects(filteredProjects)
      router.refresh()
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return

    try {
      await deleteProjectAction(projectId)
      show({ type: 'success', message: 'Proyecto eliminado' })
      // Optimistic remove
      setOptimisticProjects((prev) => prev.filter((p) => p.id !== projectId))
      router.refresh()
    } catch {
      show({ type: 'error', message: 'Error al eliminar' })
    }
  }

  // Render Item (Card or List Row)
  const renderProjectItem = (project: ProjectWithRelations, isDragging: boolean) => {
    if (view === 'grid') {
      return (
        <Card
          className={`group hover:border-primary relative h-full overflow-hidden border-2 transition-all hover:shadow-lg ${isDragging ? 'scale-105 shadow-xl' : ''}`}
        >
          {/* Thumbnail */}
          <div className="bg-muted relative aspect-video w-full overflow-hidden">
            {project.thumbnailUrl ? (
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                <span className="text-4xl">📷</span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant={project.isActive ? 'success' : 'outline'} className="shadow-sm">
                {project.isActive ? 'Activo' : 'Oculto'}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 p-4">
            <div>
              <h3 className="text-foreground truncate font-bold">{project.title}</h3>
              <p className="text-primary text-xs font-medium tracking-wider uppercase">
                {project.category.name}
              </p>
            </div>

            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>🖼️ {project.images.length}</span>
              <span>•</span>
              <span>📅 {new Date(project.date).toLocaleDateString('es-ES')}</span>
            </p>

            {/* Actions */}
            <div className="border-border mt-2 flex gap-2 border-t pt-3">
              <Link href={`/admin/proyectos/${project.id}/editar`} className="flex-1">
                <Button size="sm" variant="primary" className="w-full">
                  <Pencil size={14} className="mr-1.5" /> Editar
                </Button>
              </Link>
              <Link href={`/proyectos/${project.category.slug}/${project.slug}`} target="_blank">
                <Button size="sm" variant="ghost">
                  <Eye size={14} />
                </Button>
              </Link>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </Card>
      )
    }

    // List View
    return (
      <div
        className={`group border-border bg-card hover:border-primary flex items-center gap-4 rounded-lg border p-3 transition-colors ${isDragging ? 'bg-accent/10 shadow-lg' : ''}`}
      >
        {/* Drag Handle (managed by SortableGrid, visual only here as placeholder alignment) */}
        <div className="w-6" />

        {/* Thumbnail */}
        <div className="bg-muted relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">📷</div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="text-foreground truncate font-semibold">{project.title}</h4>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span className="text-primary font-medium">{project.category.name}</span>
            <span>•</span>
            <span>{new Date(project.date).toLocaleDateString('es-ES')}</span>
            <span>•</span>
            <span>{project.images.length} fotos</span>
          </div>
        </div>

        {/* Status */}
        <div className="hidden sm:block">
          <Badge variant={project.isActive ? 'success' : 'outline'}>
            {project.isActive ? 'Activo' : 'Oculto'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/admin/proyectos/${project.id}/editar`}>
            <Button size="sm" variant="ghost" title="Editar">
              <Pencil size={16} />
            </Button>
          </Link>
          <Link href={`/proyectos/${project.category.slug}/${project.slug}`} target="_blank">
            <Button size="sm" variant="ghost" title="Ver público">
              <Eye size={16} />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(project.id)}
            title="Eliminar"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showActive={showActive}
            onActiveChange={setShowActive}
            onClearFilters={() => {
              setSelectedCategory(undefined)
              setSearchTerm('')
              setShowActive(undefined)
            }}
            totalCount={projects.length}
            filteredCount={optimisticProjects.length}
          />
        </div>
        <ViewToggle
          defaultView={view}
          onViewChange={(v) => {
            setView(v as 'grid' | 'list')
            // Save to localStorage if needed
            localStorage.setItem('projects-view-mode', v)
          }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {optimisticProjects.length > 0 ? (
            <SortableGrid
              items={optimisticProjects}
              getItemId={(p) => p.id}
              onReorder={handleReorder}
              renderItem={renderProjectItem}
              strategy={view === 'grid' ? 'grid' : 'vertical'}
              columns={3}
              gap="gap-6"
            />
          ) : (
            <Card className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <span className="mb-4 text-4xl">🔍</span>
              <p className="font-medium">No se encontraron proyectos</p>
              <p className="text-sm">Intenta ajustar los filtros</p>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
