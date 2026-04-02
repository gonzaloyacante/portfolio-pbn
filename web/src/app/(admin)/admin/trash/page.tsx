import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/layout'
import { requireAdmin } from '@/lib/security-server'
import { TrashTabs } from '@/components/admin/TrashTabs'

export const dynamic = 'force-dynamic'

export default async function PapeleraPage() {
  await requireAdmin()

  const [deletedCategories, deletedServices, deletedTestimonials] = await Promise.all([
    prisma.category.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    }),
    prisma.service.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    }),
    prisma.testimonial.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    }),
  ])

  return (
    <div className="space-y-8">
      <PageHeader
        title="🗑️ Papelera"
        description="Elementos eliminados. Se borran permanentemente después de 30 días."
      />

      <div className="mb-8 rounded-2xl border-l-4 border-yellow-400 bg-yellow-50 p-6 dark:bg-yellow-900/10">
        <p className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
          <span className="text-xl">⚠️</span>
          <span>
            <strong>Importante:</strong> Una vez eliminado permanentemente, el elemento y sus
            imágenes no podrán recuperarse jamás.
          </span>
        </p>
      </div>

      <TrashTabs
        categories={deletedCategories}
        services={deletedServices}
        testimonials={deletedTestimonials}
      />
    </div>
  )
}
