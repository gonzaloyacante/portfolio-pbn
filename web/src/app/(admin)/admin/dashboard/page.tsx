import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/layout'
import { auth } from '@/lib/auth'
import { getAnalyticsDashboardData, getExtendedAnalyticsData } from '@/actions/analytics'
import { ROUTES } from '@/config/routes'
import ContentStats from '@/components/features/dashboard/ContentStats'
import AlertsSection from '@/components/features/dashboard/AlertsSection'
import VisitsChart from '@/components/features/dashboard/VisitsChart'
import DeviceUsage from '@/components/features/dashboard/DeviceUsage'
import TopProjects from '@/components/features/dashboard/TopProjects'
import TopLocations from '@/components/features/dashboard/TopLocations'
import VisitorMap from '@/components/features/dashboard/VisitorMap'
import WebVitals from '@/components/features/dashboard/WebVitals'

export default async function DashboardPage() {
  const [
    session,
    analyticsData,
    extended,
    projectsCount,
    categoriesCount,
    testimonialsCount,
    deletedCount,
    contactsCount,
    pendingTestimonials,
  ] = await Promise.all([
    auth(),
    getAnalyticsDashboardData(),
    getExtendedAnalyticsData(30),
    prisma.project.count({ where: { isDeleted: false } }),
    prisma.category.count(),
    prisma.testimonial.count({ where: { isActive: true } }),
    prisma.project.count({ where: { isDeleted: true } }),
    prisma.contact.count({ where: { isRead: false } }),
    prisma.testimonial.count({ where: { isActive: false } }),
  ])

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

  const topCountries = extended
    ? Object.entries(extended.countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50)
    : []

  return (
    <div className="page-transition space-y-8">
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {analyticsData && (
          <VisitsChart
            totalVisits={analyticsData.totalVisits}
            detailVisits={analyticsData.detailVisits}
            contactLeads={analyticsData.contactLeads}
            trendData={analyticsData.trendData}
          />
        )}
        <div className="space-y-6">
          <DeviceUsage
            deviceUsage={analyticsData?.deviceUsage ?? { mobile: 0, tablet: 0, desktop: 0 }}
          />
          <TopProjects projects={analyticsData?.topProjects ?? []} />
        </div>
      </div>

      <TopLocations locations={analyticsData?.topLocations ?? []} />

      <VisitorMap geoPoints={extended?.geoPoints ?? []} topCountries={topCountries} />

      {extended && <WebVitals data={extended} />}
    </div>
  )
}
