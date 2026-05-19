import { getDashboardContentStats } from '@/actions/analytics'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ROUTES } from '@/config/routes'
import { PageHeader } from '@/components/layout'
import ContentStats from '@/components/features/dashboard/ContentStats'
import RecentBookingsWidget from '@/components/features/dashboard/RecentBookingsWidget'
import DashboardPrioritySection from './DashboardPrioritySection'
import DashboardQuickActions from './DashboardQuickActions'
import DashboardSiteHealth from './DashboardSiteHealth'
import DashboardTrafficSection from './DashboardTrafficSection'

export default async function DashboardContentSection() {
  const [session, stats, recentBookings] = await Promise.all([
    auth(),
    getDashboardContentStats(),
    prisma.booking.findMany({
      where: {
        deletedAt: null,
        status: { in: ['PENDING', 'CONFIRMED'] },
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 5,
      select: {
        id: true,
        clientName: true,
        date: true,
        status: true,
        service: { select: { name: true } },
      },
    }),
  ])

  const {
    imagesCount,
    categoriesCount,
    servicesCount,
    testimonialsCount,
    deletedCount,
    contactsCount,
    pendingTestimonials,
    pendingBookings,
    categoriesWithoutImages,
    servicesWithoutImage,
  } = stats

  const userName = session?.user?.name || 'Administrador'

  const contentStats = [
    {
      label: 'Imágenes',
      value: imagesCount,
      icon: '🎨',
      href: ROUTES.admin.categories,
      subtitle: 'En galerías del portfolio',
    },
    {
      label: 'Categorías',
      value: categoriesCount,
      icon: '📁',
      href: ROUTES.admin.categories,
      subtitle: 'Secciones del portfolio',
    },
    {
      label: 'Servicios',
      value: servicesCount,
      icon: '💄',
      href: ROUTES.admin.services,
      subtitle: 'Ofertas publicadas',
    },
    {
      label: 'Testimonios',
      value: testimonialsCount,
      icon: '💬',
      href: ROUTES.admin.testimonials,
      subtitle: 'Opiniones visibles',
    },
  ]

  return (
    <>
      <PageHeader
        title={`¡Hola, ${userName}! 👋`}
        description="Qué revisar ahora y accesos rápidos para gestionar la web."
      />
      <DashboardPrioritySection
        contactsCount={contactsCount}
        pendingBookings={pendingBookings}
        pendingTestimonials={pendingTestimonials}
        deletedCount={deletedCount}
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <RecentBookingsWidget bookings={recentBookings} />
        <DashboardQuickActions />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardSiteHealth
          imagesCount={imagesCount}
          categoriesCount={categoriesCount}
          servicesCount={servicesCount}
          categoriesWithoutImages={categoriesWithoutImages}
          servicesWithoutImage={servicesWithoutImage}
        />
        <DashboardTrafficSection />
      </div>
      <section className="space-y-3">
        <h2 className="text-foreground text-xl font-bold">Contenido publicado</h2>
        <ContentStats stats={contentStats} />
      </section>
    </>
  )
}
