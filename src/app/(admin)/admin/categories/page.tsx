import { prisma } from '@/lib/db'
import { getCategorySettings, updateCategorySettings } from '@/actions/category-settings.actions'
import { Button } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import VisualConfigModal from '@/components/features/projects/VisualConfigModal'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { Plus } from 'lucide-react'
import CategoriesContent from './CategoriesContent'

export default async function CategoriesPage() {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      include: {
        projects: {
          where: { isActive: true, isDeleted: false },
          take: 1,
          orderBy: { date: 'desc' },
          select: { thumbnailUrl: true },
        },
        _count: {
          select: {
            projects: { where: { isActive: true, isDeleted: false } },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    }),
    getCategorySettings(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="📁 Gestión de Categorías"
          description="Administra las categorías de tus proyectos"
        />
        <div className="flex gap-3">
          <VisualConfigModal
            initialSettings={settings}
            onSave={updateCategorySettings}
            title="Configurar Tarjetas de Categoría"
            description="Personaliza cómo se ven las categorías en /proyectos."
            previewVariant="category"
            triggerLabel="Config. Visual"
            fields={[
              {
                key: 'showProjectCount',
                label: 'Mostrar Cantidad',
                description: 'Ej: 8 Proyectos',
                type: 'boolean',
              },
              {
                key: 'showDescription',
                label: 'Mostrar Descripción',
                description: 'Descripción de la categoría',
                type: 'boolean',
              },
              {
                key: 'gridColumns',
                label: 'Columnas',
                description: 'Número de columnas (1-4)',
                type: 'number',
                min: 1,
                max: 4,
              },
            ]}
          />
          <Link href={`${ROUTES.admin.categories}/new`}>
            <Button className="gap-2">
              <Plus size={16} />
              Nueva Categoría
            </Button>
          </Link>
        </div>
      </div>

      {/* Client Component with the list */}
      <CategoriesContent categories={categories} />
    </div>
  )
}
