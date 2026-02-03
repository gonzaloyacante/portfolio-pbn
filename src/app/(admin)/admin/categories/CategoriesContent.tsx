'use client'

import { useState } from 'react'
import { deleteCategoryAction, reorderCategories } from '@/actions/category.actions'
import { Button, Card, Badge } from '@/components/ui'
import { useToast } from '@/components/ui'
import ViewToggle, { type ViewMode } from '@/components/admin/shared/ViewToggle'
import SortableGrid from '@/components/admin/shared/SortableGrid'
import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/config/routes'
import { Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import type { Category } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type CategoryWithCount = Category & {
  _count: { projects: number }
  projects: { thumbnailUrl: string | null }[]
}

interface CategoriesContentProps {
  categories: CategoryWithCount[]
}

export default function CategoriesContent({
  categories: initialCategories,
}: CategoriesContentProps) {
  const router = useRouter()
  const { show } = useToast()

  // State
  const [view, setView] = useState<ViewMode>('grid')
  const [categories, setCategories] = useState(initialCategories)

  // Handlers
  const handleReorder = async (reorderedItems: CategoryWithCount[]) => {
    // Optimistic update
    setCategories(reorderedItems)

    try {
      await reorderCategories(reorderedItems.map((c) => c.id))
      show({ type: 'success', message: 'Orden actualizado' })
    } catch {
      show({ type: 'error', message: 'Error al reordenar categorías' })
      // Revert on error
      setCategories(initialCategories)
      router.refresh()
    }
  }

  const renderCategoryItem = (category: CategoryWithCount, isDragging: boolean) => {
    const thumbnailUrl = category.projects[0]?.thumbnailUrl

    if (view === 'grid') {
      return (
        <Card
          className={`group hover:border-primary h-full overflow-hidden transition-all hover:shadow-lg ${
            isDragging ? 'ring-primary/20 scale-105 shadow-xl ring-2' : ''
          }`}
        >
          {/* Thumbnail */}
          <div className="bg-muted relative aspect-video overflow-hidden">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center opacity-20">
                <span className="text-4xl">📁</span>
              </div>
            )}
            <Badge className="absolute top-2 right-2 shadow-sm">#{category.sortOrder ?? 0}</Badge>
          </div>

          {/* Info */}
          <div className="space-y-3 p-5">
            <div>
              <h3 className="text-foreground truncate text-lg font-bold">{category.name}</h3>
              <p className="text-muted-foreground truncate font-mono text-xs">/{category.slug}</p>
            </div>

            {category.description && (
              <p className="text-muted-foreground line-clamp-2 min-h-[40px] text-sm">
                {category.description}
              </p>
            )}

            <div className="text-muted-foreground flex gap-3 text-xs">
              <span>🖼️ {category._count.projects} proyectos</span>
            </div>

            {/* Actions */}
            <div className="border-border mt-auto flex gap-2 border-t pt-4">
              <Link href={`/proyectos/${category.slug}`} target="_blank" className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ExternalLink size={14} />
                  Ver
                </Button>
              </Link>
              <Link href={`${ROUTES.admin.categories}/${category.id}/edit`} className="flex-1">
                <Button size="sm" className="w-full gap-2">
                  <Pencil size={14} />
                  Editar
                </Button>
              </Link>
              <form action={deleteCategoryAction.bind(null, category.id)}>
                <Button variant="destructive" size="sm">
                  <Trash2 size={14} />
                </Button>
              </form>
            </div>
          </div>
        </Card>
      )
    }

    // List View
    return (
      <div
        className={`border-border bg-card hover:border-primary flex items-center gap-4 rounded-lg border p-3 transition-colors ${
          isDragging ? 'bg-accent/10 shadow-lg' : ''
        }`}
      >
        {/* Drag Handle placeholder for alignment */}
        <div className="w-6" />

        {/* Thumbnail */}
        <div className="bg-muted relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={category.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full items-center justify-center opacity-20">
              <span className="text-2xl">📁</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-foreground truncate font-semibold">{category.name}</h3>
            <Badge variant="outline" className="text-xs">
              #{category.sortOrder ?? 0}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-xs">/{category.slug}</p>
          <div className="text-muted-foreground mt-1 text-xs">
            {category._count.projects} proyectos
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href={`/proyectos/${category.slug}`} target="_blank">
            <Button variant="ghost" size="sm">
              <ExternalLink size={16} />
            </Button>
          </Link>
          <Link href={`${ROUTES.admin.categories}/${category.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Pencil size={16} />
            </Button>
          </Link>
          <form action={deleteCategoryAction.bind(null, category.id)}>
            <Button variant="ghost" size="sm" className="text-destructive">
              <Trash2 size={16} />
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <ViewToggle defaultView="grid" onViewChange={setView} storageKey="admin-categories-view" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {categories.length > 0 ? (
            <SortableGrid
              items={categories}
              getItemId={(c) => c.id}
              onReorder={handleReorder}
              renderItem={renderCategoryItem}
              strategy={view === 'grid' ? 'grid' : 'vertical'}
              columns={3}
            />
          ) : (
            <Card className="flex flex-col items-center justify-center py-24 text-center">
              <span className="mb-4 text-6xl">📁</span>
              <h3 className="text-foreground mb-2 text-2xl font-bold">No hay categorías</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera categoría para organizar tus proyectos
              </p>
              <Link href={`${ROUTES.admin.categories}/new`}>
                <Button className="gap-2">
                  <Plus size={16} />
                  Nueva Categoría
                </Button>
              </Link>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
