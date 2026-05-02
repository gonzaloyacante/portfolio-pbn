import { prisma } from '@/lib/db'
import ServiceManager from '@/components/features/services/ServiceManager'
import { ServicesPageHeroEditor } from '@/components/features/services/ServicesPageHeroEditor'
import { PageHeader } from '@/components/layout'
import { requireAdmin } from '@/lib/security-server'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  await requireAdmin()
  const [services, servicesHero] = await Promise.all([
    prisma.service.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      include: { pricingTiers: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.servicesPageSettings.findFirst({ where: { isActive: true } }),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Gestión de Servicios"
        description="Cabecera de la página pública /servicios y listado de servicios."
      />
      <ServicesPageHeroEditor settings={servicesHero} />
      <ServiceManager initialServices={services} />
    </div>
  )
}
