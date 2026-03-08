import { prisma } from '@/lib/db'
import ServiceManager from '@/components/features/services/ServiceManager'
import { PageHeader } from '@/components/layout'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="💅 Gestión de Servicios"
        description="Administra los servicios que ofreces"
      />
      <ServiceManager initialServices={services} />
    </div>
  )
}
