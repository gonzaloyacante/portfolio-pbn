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

  // Prisma devuelve Decimal/Date que Next.js 16 no puede serializar al
  // cruzar el Server/Client Component boundary. JSON roundtrip los aplana
  // a strings/numbers planos que sí cruzan.
  const initialServices = JSON.parse(JSON.stringify(services)) as typeof services

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Gestión de Servicios"
        description="Cabecera de la página pública /servicios y listado de servicios."
      />
      <ServicesPageHeroEditor settings={servicesHero} />
      <ServiceManager initialServices={initialServices} />
    </div>
  )
}
