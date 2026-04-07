import { prisma } from '@/lib/db'
import { Button } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { Plus } from 'lucide-react'
import CategoriesContent from './CategoriesContent'
import CategorySettingsCard from '@/components/features/categories/CategorySettingsCard'
import { getCategorySettings } from '@/actions/settings/categories'

export default async function CategoriesPage() {
  const [categories, categorySettings] = await Promise.all([
    prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        images: { take: 1, orderBy: { order: 'asc' }, select: { url: true } },
        _count: { select: { images: true } },
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
          description="Administra las categorías y galerías del portfolio"
        />
        <Button asChild className="gap-2">
          <Link href={ROUTES.admin.newCategory}>
            <Plus size={16} />
            Nueva Categoría
          </Link>
        </Button>
      </div>

      {/* Gallery display settings */}
      <CategorySettingsCard settings={categorySettings} />

      {/* Client Component with the list */}
      <CategoriesContent categories={categories} />
    </div>
  )
}
