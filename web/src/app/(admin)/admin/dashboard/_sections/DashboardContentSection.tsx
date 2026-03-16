import { getDashboardContentStats } from '@/actions/analytics'
import { auth } from '@/lib/auth'
import { ROUTES } from '@/config/routes'
import { PageHeader } from '@/components/layout'
import ContentStats from '@/components/features/dashboard/ContentStats'
import AlertsSection from '@/components/features/dashboard/AlertsSection'

export default async function DashboardContentSection() {
  const [session, stats] = await Promise.all([auth(), getDashboardContentStats()])

  const {
    projectsCount,
    categoriesCount,
    testimonialsCount,
    deletedCount,
    contactsCount,
    pendingTestimonials,
  } = stats

  const userName = session?.user?.name || 'Administrador'

  const contentStats = [
    { label: 'Proyectos', value: projectsCount, icon: '🎨', href: ROUTES.admin.projects },
    { label: 'Categorías', value: categoriesCount, icon: '📁', href: ROUTES.admin.projects },
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
    </>
  )
}
