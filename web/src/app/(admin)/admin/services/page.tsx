import { prisma } from '@/lib/db'
import ServiceManager from '@/components/features/services/ServiceManager'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="mx-auto max-w-5xl">
      <ServiceManager initialServices={services} />
    </div>
  )
}
