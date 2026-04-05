import { getDashboardContentStats } from '@/actions/analytics'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ROUTES } from '@/config/routes'
import { PageHeader } from '@/components/layout'
import ContentStats from '@/components/features/dashboard/ContentStats'
import AlertsSection from '@/components/features/dashboard/AlertsSection'
import RecentBookingsWidget from '@/components/features/dashboard/RecentBookingsWidget'

export default async function DashboardContentSection() {
  const [session, stats, recentBookings] = await Promise.all([
    auth(),
    getDashboardContentStats(),
    prisma.booking.findMany({
      where: { deletedAt: null, status: { in: ['PENDING', 'CONFIRMED'] } },
      orderBy: { createdAt: 'desc' },
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
    testimonialsCount,
    deletedCount,
    contactsCount,
    pendingTestimonials,
  } = stats

  const userName = session?.user?.name || 'Administrador'

  const contentStats = [
    { label: 'Imágenes', value: imagesCount, icon: '🎨', href: ROUTES.admin.categories },
    { label: 'Categorías', value: categoriesCount, icon: '📁', href: ROUTES.admin.categories },
    { label: 'Testimonios', value: testimonialsCount, icon: '💬', href: ROUTES.admin.testimonials },
    {
      label: 'Mensajes',
      value: contactsCount,
      icon: '📬',
      href: ROUTES.admin.contacts,
      highlight: contactsCount > 0,
    },
  ]

  return (
    <>
      <PageHeader
        title={`¡Hola, ${userName}! 👋`}
        description="Resumen de tu portfolio y estadísticas"
      />
      <ContentStats stats={contentStats} />
      <AlertsSection
        contactsCount={contactsCount}
        pendingTestimonials={pendingTestimonials}
        deletedCount={deletedCount}
      />
      <RecentBookingsWidget bookings={recentBookings} />
    </>
  )
}
