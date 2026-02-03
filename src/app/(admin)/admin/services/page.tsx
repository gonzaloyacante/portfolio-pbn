import { prisma } from '@/lib/db'
import ServiceManager from '@/components/features/services/ServiceManager'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="mx-auto max-w-5xl p-6">
      <ServiceManager initialServices={services} />
    </div>
  )
}
