'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCategoryAction, reorderCategories } from '@/actions/cms/category'
import { Button, Card, useConfirmDialog } from '@/components/ui'
import ViewToggle, { type ViewMode } from '@/components/layout/ViewToggle'
import SortableGrid from '@/components/layout/SortableGrid'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { Plus, Search } from 'lucide-react'
import type { Category } from '@/generated/prisma/client'
import { motion, AnimatePresence } from '@/components/ui'
import { useOptimisticReorder } from '@/hooks/useOptimisticReorder'
import { TOAST_MESSAGES } from '@/lib/toast-messages'
import { showToast } from '@/lib/toast'
import { CategoryGridCard } from './CategoryGridCard'
import { CategoryListItem } from './CategoryListItem'

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
  const [view, setView] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { confirm, Dialog } = useConfirmDialog()

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

  const renderItem = (category: CategoryWithCount, isDragging: boolean) =>
    view === 'grid' ? (
      <CategoryGridCard category={category} isDragging={isDragging} onDelete={handleDelete} />
    ) : (
      <CategoryListItem category={category} isDragging={isDragging} onDelete={handleDelete} />
    )

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
              renderItem={renderItem}
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
