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

  // Prisma devuelve Decimal/Date que Next.js 16 no puede serializar al
  // cruzar el Server/Client Component boundary. JSON roundtrip los aplana
  // a strings/numbers planos. Aplicar a todo lo que se pasa como prop a
  // Client Components (service.price es Decimal).
  const safeCategories = JSON.parse(JSON.stringify(deletedCategories))
  const safeServices = JSON.parse(JSON.stringify(deletedServices))
  const safeTestimonials = JSON.parse(JSON.stringify(deletedTestimonials))

  return (
    <div className="space-y-8">
      <PageHeader
        title="🗑️ Papelera"
        description="Elementos eliminados. Se borran permanentemente después de 30 días."
      />

      <div className="border-warning bg-warning/10 mb-8 rounded-2xl border-l-4 p-6">
        <p className="text-warning flex items-center gap-2 text-sm">
          <span className="text-xl">⚠️</span>
          <span>
            <strong>Importante:</strong> Una vez eliminado permanentemente, el elemento y sus
            imágenes no podrán recuperarse jamás.
          </span>
        </p>
      </div>

      <TrashTabs
        categories={safeCategories}
        services={safeServices}
        testimonials={safeTestimonials}
      />
    </div>
  )
}
