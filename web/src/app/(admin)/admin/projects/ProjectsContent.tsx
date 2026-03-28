'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Category, Project, ProjectImage } from '@/generated/prisma/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Eye } from 'lucide-react'

import { Button, Card, Badge, useConfirmDialog } from '@/components/ui'
import { deleteProjectAction, reorderProjects } from '@/actions/cms/project'
import FilterBar from '@/components/ui/data-display/FilterBar'
import SortableGrid from '@/components/layout/SortableGrid'
import ViewToggle from '@/components/layout/ViewToggle'
import { useOptimisticReorder } from '@/hooks/useOptimisticReorder'
import { useFilteredItems } from '@/hooks/useFilteredItems'
import { TOAST_MESSAGES } from '@/lib/toast-messages'
import { ADMIN_GRID_COLUMNS } from '@/lib/admin-constants'
import { showToast } from '@/lib/toast'

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

  // State
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [searchTerm, setSearchTerm] = useState('')
  const [showActive, setShowActive] = useState<boolean>()

  // Filter and sort using custom hook
  const filteredProjects = useFilteredItems({
    items: projects,
    filters: {
      category: selectedCategory ? (p) => p.categoryId === selectedCategory : undefined,
      search: searchTerm
        ? (p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())
        : undefined,
      active: showActive !== undefined ? (p) => p.isActive === showActive : undefined,
    },
    sortBy: (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  })

  // Optimistic reordering using custom hook
  const {
    items: optimisticProjects,
    handleReorder,
    isReordering,
  } = useOptimisticReorder<ProjectWithRelations>({
    initialItems: filteredProjects,
    reorderAction: reorderProjects,
    getId: (p) => p.id,
    successMessage: TOAST_MESSAGES.projects.reorder.success,
    errorMessage: TOAST_MESSAGES.projects.reorder.error,
  })

  // Confirmation Dialog
  const { confirm, Dialog } = useConfirmDialog()

  // Delete handler
  const handleDelete = async (projectId: string) => {
    const isConfirmed = await confirm({
      title: '¿Eliminar proyecto?',
      message: 'Esta acción no se puede deshacer. Se eliminarán todas las imágenes asociadas.',
      confirmText: 'Eliminar',
      variant: 'danger',
    })

    if (!isConfirmed) return

    try {
      await deleteProjectAction(projectId)
      showToast.success(TOAST_MESSAGES.projects.delete.success)
      router.refresh()
    } catch {
      showToast.error(TOAST_MESSAGES.projects.delete.error)
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
              <Button asChild size="sm" variant="primary" className="flex-1">
                <Link href={`/admin/projects/${project.id}/edit`}>
                  <Pencil size={14} className="mr-1.5" /> Editar
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="ghost"
                aria-label={`Ver proyecto ${project.title} en público`}
              >
                <Link
                  href={`/proyectos/${project.category.slug}/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye size={14} />
                </Link>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                aria-label={`Eliminar proyecto ${project.title}`}
                onClick={() => handleDelete(project.id)}
              >
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
        <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded">
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
          <Button
            asChild
            size="sm"
            variant="ghost"
            aria-label={`Editar proyecto ${project.title}`}
            title="Editar"
          >
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Pencil size={16} />
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="ghost"
            aria-label={`Ver proyecto ${project.title} en público`}
            title="Ver público"
          >
            <Link
              href={`/proyectos/${project.category.slug}/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye size={16} />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(project.id)}
            aria-label={`Eliminar proyecto ${project.title}`}
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
              columns={ADMIN_GRID_COLUMNS}
              gap="gap-6"
              disabled={isReordering}
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
      <Dialog />
    </div>
  )
}
