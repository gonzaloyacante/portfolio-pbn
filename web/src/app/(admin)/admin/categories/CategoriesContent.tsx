'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCategoryAction, reorderCategories } from '@/actions/cms/category'
import { Button, Card, Badge, useConfirmDialog } from '@/components/ui'
import ViewToggle, { type ViewMode } from '@/components/layout/ViewToggle'
import SortableGrid from '@/components/layout/SortableGrid'
import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/config/routes'
import { Plus, ExternalLink, Pencil, Trash2, Images, Search } from 'lucide-react'
import type { Category } from '@/generated/prisma/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useOptimisticReorder } from '@/hooks/useOptimisticReorder'
import { TOAST_MESSAGES } from '@/lib/toast-messages'
import { showToast } from '@/lib/toast'

type CategoryWithCount = Category & {
  _count: { images: number }
  images: { url: string }[]
}

interface CategoriesContentProps {
  categories: CategoryWithCount[]
}

export default function CategoriesContent({
  categories: initialCategories,
}: CategoriesContentProps) {
  // State
  const [view, setView] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Confirmation Dialog
  const { confirm, Dialog } = useConfirmDialog()

  // Delete handler with confirmation
  const handleDelete = async (categoryId: string, categoryName: string) => {
    const isConfirmed = await confirm({
      title: '¿Eliminar categoría?',
      message: `"${categoryName}" será movida a la papelera. Sus imágenes no se eliminarán.`,
      confirmText: 'Eliminar',
      variant: 'danger',
    })
    if (!isConfirmed) return
    try {
      await deleteCategoryAction(categoryId)
      showToast.success(TOAST_MESSAGES.categories.delete.success)
      router.refresh()
    } catch {
      showToast.error(TOAST_MESSAGES.categories.delete.error)
    }
  }

  // Optimistic reordering using custom hook
  const { items: categories, handleReorder } = useOptimisticReorder<CategoryWithCount>({
    initialItems: initialCategories,
    reorderAction: reorderCategories,
    getId: (c) => c.id,
    successMessage: TOAST_MESSAGES.categories.reorder.success,
    errorMessage: TOAST_MESSAGES.categories.reorder.error,
  })

  const filteredCategories = searchQuery
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
    : categories
  const renderCategoryItem = (category: CategoryWithCount, isDragging: boolean) => {
    // Priority: explicit category cover → first gallery image → empty
    const thumbnailUrl = category.coverImageUrl || category.images[0]?.url

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
            </div>

            {category.description && (
              <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm">
                {category.description}
              </p>
            )}

            <div className="text-muted-foreground flex gap-3 text-xs">
              <span>🖼️ {category._count.images} imágenes</span>
            </div>

            {/* Actions */}
            <div className="border-border mt-auto flex gap-2 border-t pt-4">
              <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
                <Link
                  href={`${ROUTES.public.portfolio}/${category.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} />
                  Ver
                </Link>
              </Button>
              <Button asChild size="sm" className="flex-1 gap-2">
                <Link href={ROUTES.admin.editCategory(category.id)}>
                  <Pencil size={14} />
                  Editar
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
                <Link href={ROUTES.admin.categoryGallery(category.id)}>
                  <Images size={14} />
                  Galería
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                aria-label={`Eliminar categoría ${category.name}`}
                onClick={() => handleDelete(category.id, category.name)}
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
        className={`border-border bg-card hover:border-primary flex items-center gap-4 rounded-lg border p-3 transition-colors ${
          isDragging ? 'bg-accent/10 shadow-lg' : ''
        }`}
      >
        {/* Drag Handle placeholder for alignment */}
        <div className="w-6" />

        {/* Thumbnail */}
        <div className="bg-muted relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
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

          <div className="text-muted-foreground mt-1 text-xs">
            {category._count.images} imágenes
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            aria-label={`Ver categoría ${category.name} en público`}
          >
            <Link
              href={`${ROUTES.public.portfolio}/${category.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            aria-label={`Editar categoría ${category.name}`}
          >
            <Link href={ROUTES.admin.editCategory(category.id)}>
              <Pencil size={16} />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" aria-label={`Ver galería de ${category.name}`}>
            <Link href={ROUTES.admin.categoryGallery(category.id)}>
              <Images size={16} />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            aria-label={`Eliminar categoría ${category.name}`}
            onClick={() => handleDelete(category.id, category.name)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="search"
            placeholder="Buscar categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring w-full rounded-xl border py-2 pr-4 pl-9 text-sm focus:outline-none"
          />
        </div>
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
          {filteredCategories.length > 0 ? (
            <SortableGrid
              items={filteredCategories}
              getItemId={(c) => c.id}
              onReorder={handleReorder}
              renderItem={renderCategoryItem}
              strategy={view === 'grid' ? 'grid' : 'vertical'}
              columns={3}
            />
          ) : (
            <Card className="flex flex-col items-center justify-center py-24 text-center">
              <span className="mb-4 text-6xl">{searchQuery ? '🔍' : '📁'}</span>
              <h3 className="text-foreground mb-2 text-2xl font-bold">
                {searchQuery ? 'Sin resultados' : 'No hay categorías'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `No se encontraron categorías para "${searchQuery}"`
                  : 'Crea tu primera categoría para organizar tu portfolio'}
              </p>
              {!searchQuery && (
                <Button asChild className="gap-2">
                  <Link href={ROUTES.admin.newCategory}>
                    <Plus size={16} />
                    Nueva Categoría
                  </Link>
                </Button>
              )}
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
      <Dialog />
    </>
  )
}
