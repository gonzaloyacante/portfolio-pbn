import { prisma } from '@/lib/db'
import { StatCard, Section } from '@/components/admin'
import { PageHeader } from '@/components/ui'
import { auth } from '@/lib/auth'
import { getAnalyticsDashboardData } from '@/actions/analytics.actions'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

const DAYS_ES = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

export default async function DashboardPage() {
  const [
    session,
    analyticsData,
    projectsCount,
    categoriesCount,
    testimonialsCount,
    deletedCount,
    contactsCount,
    pendingTestimonials,
  ] = await Promise.all([
    auth(),
    getAnalyticsDashboardData(),
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

  const totalDevices =
    (analyticsData?.deviceUsage?.mobile || 0) + (analyticsData?.deviceUsage?.desktop || 0)
  const mobilePercent =
    totalDevices > 0 ? Math.round((analyticsData!.deviceUsage.mobile / totalDevices) * 100) : 0
  const desktopPercent = 100 - mobilePercent

  return (
    <div className="page-transition space-y-8">
      <PageHeader
        title={`¡Hola, ${userName}! 👋`}
        description="Resumen de tu portfolio y estadísticas"
      />

      {/* Stats de Contenido */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {contentStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Alertas importantes */}
      {(contactsCount > 0 || pendingTestimonials > 0 || deletedCount > 0) && (
        <Section title="⚡ Requiere tu atención">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contactsCount > 0 && (
              <Link
                href={ROUTES.admin.contacts}
                className="group dark:bg-purple-dark/20 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-yellow-400/50 bg-white/50 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-yellow-400 hover:shadow-md active:scale-[0.98] dark:border-yellow-400/30"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">📬</span>
                <div>
                  <p className="text-wine dark:text-pink-light font-bold">
                    {contactsCount} mensaje{contactsCount > 1 ? 's' : ''} nuevo
                    {contactsCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-wine/60 dark:text-pink-light/60 text-sm">
                    Responder para mejor conversión
                  </p>
                </div>
              </Link>
            )}
            {pendingTestimonials > 0 && (
              <Link
                href={ROUTES.admin.testimonials}
                className="group dark:bg-purple-dark/20 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-blue-400/50 bg-white/50 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-blue-400 hover:shadow-md active:scale-[0.98] dark:border-blue-400/30"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">⭐</span>
                <div>
                  <p className="text-wine dark:text-pink-light font-bold">
                    {pendingTestimonials} testimonio{pendingTestimonials > 1 ? 's' : ''} pendiente
                    {pendingTestimonials > 1 ? 's' : ''}
                  </p>
                  <p className="text-wine/60 dark:text-pink-light/60 text-sm">
                    Esperando aprobación
                  </p>
                </div>
              </Link>
            )}
            {deletedCount > 0 && (
              <Link
                href={ROUTES.admin.trash}
                className="group dark:bg-purple-dark/20 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-red-400/50 bg-white/50 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-red-400 hover:shadow-md active:scale-[0.98] dark:border-red-400/30"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">🗑️</span>
                <div>
                  <p className="text-wine dark:text-pink-light font-bold">
                    {deletedCount} en papelera
                  </p>
                  <p className="text-wine/60 dark:text-pink-light/60 text-sm">
                    Se borrarán en 30 días
                  </p>
                </div>
              </Link>
            )}
          </div>
        </Section>
      )}

      {/* Analíticas Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Gráfica de visitas - más ancha */}
        <Section title="📊 Visitas (últimos 7 días)" className="xl:col-span-2">
          {analyticsData && analyticsData.trendData.length > 0 ? (
            <div className="space-y-4">
              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-pink-hot/10 dark:bg-pink-hot/5 rounded-2xl p-4 text-center">
                  <p className="text-wine dark:text-pink-light text-3xl font-bold">
                    {analyticsData.totalVisits}
                  </p>
                  <p className="text-wine/80 dark:text-pink-light/80 text-sm font-medium">
                    Total visitas
                  </p>
                </div>
                <div className="bg-pink-hot/10 dark:bg-pink-hot/5 rounded-2xl p-4 text-center">
                  <p className="text-wine dark:text-pink-light text-3xl font-bold">
                    {analyticsData.detailVisits}
                  </p>
                  <p className="text-wine/80 dark:text-pink-light/80 text-sm font-medium">
                    Proyectos vistos
                  </p>
                </div>
                <div className="bg-pink-hot/10 dark:bg-pink-hot/5 rounded-2xl p-4 text-center">
                  <p className="text-wine dark:text-pink-light text-3xl font-bold">
                    {analyticsData.contactLeads}
                  </p>
                  <p className="text-wine/80 dark:text-pink-light/80 text-sm font-medium">
                    Leads/Contactos
                  </p>
                </div>
              </div>

              {/* Gráfico de barras mejorado */}
              <div className="mt-6">
                <div className="flex h-40 items-end justify-around gap-2">
                  {analyticsData.trendData.map((day) => {
                    const max = Math.max(...analyticsData.trendData.map((d) => d.count), 1)
                    const height = Math.max((day.count / max) * 100, 10)
                    const date = new Date(day.date)
                    return (
                      <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                        {/* Número de visitas */}
                        <span className="text-wine dark:text-pink-light text-sm font-bold">
                          {day.count}
                        </span>
                        {/* Barra */}
                        <div
                          className="bg-pink-hot dark:bg-pink-hot/80 w-full max-w-[50px] rounded-t-lg transition-all duration-300 hover:opacity-80"
                          style={{
                            height: `${height}%`,
                            minHeight: '20px',
                          }}
                        />
                        {/* Día */}
                        <span className="text-wine/80 dark:text-pink-light/80 text-xs font-bold">
                          {DAYS_ES[date.getDay()]}
                        </span>
                        <span className="text-wine/50 dark:text-pink-light/50 text-[10px]">
                          {date.getDate()}/{date.getMonth() + 1}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="border-pink-hot/20 bg-pink-light/10 dark:bg-purple-dark/20 flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-center">
              <span className="text-5xl">📊</span>
              <p className="text-wine dark:text-pink-light font-medium">Sin datos de visitas aún</p>
              <p className="text-wine/60 dark:text-pink-light/60 text-sm">
                Las estadísticas aparecerán cuando el sitio reciba tráfico
              </p>
            </div>
          )}
        </Section>

        {/* Dispositivos y Top Projects */}
        <div className="space-y-6">
          {/* Dispositivos */}
          <Section title="📱 Dispositivos">
            {totalDevices > 0 ? (
              <div className="space-y-4">
                {/* Barra de progreso visual */}
                <div className="bg-wine/10 dark:bg-pink-light/10 h-6 overflow-hidden rounded-full">
                  <div className="bg-pink-hot flex h-full">
                    <div
                      className="bg-purple-dark flex h-full items-center justify-center text-xs font-bold text-white transition-all"
                      style={{
                        width: `${mobilePercent}%`,
                      }}
                    >
                      {mobilePercent > 15 && `${mobilePercent}%`}
                    </div>
                    <div
                      className="bg-pink-hot flex h-full items-center justify-center text-xs font-bold text-white transition-all"
                      style={{
                        width: `${desktopPercent}%`,
                      }}
                    >
                      {desktopPercent > 15 && `${desktopPercent}%`}
                    </div>
                  </div>
                </div>

                {/* Leyenda */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-dark h-4 w-4 rounded" />
                    <div>
                      <p className="text-wine dark:text-pink-light text-lg font-bold">
                        {analyticsData?.deviceUsage.mobile || 0}
                      </p>
                      <p className="text-wine/60 dark:text-pink-light/60 text-xs">📱 Móvil</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-hot h-4 w-4 rounded" />
                    <div>
                      <p className="text-wine dark:text-pink-light text-lg font-bold">
                        {analyticsData?.deviceUsage.desktop || 0}
                      </p>
                      <p className="text-wine/60 dark:text-pink-light/60 text-xs">💻 Escritorio</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <span className="text-4xl">📱</span>
                <p className="text-wine/60 dark:text-pink-light/60 mt-2 text-sm">
                  Sin datos de dispositivos
                </p>
              </div>
            )}
          </Section>

          {/* Top Proyectos */}
          <Section title="⭐ Top Proyectos">
            {analyticsData?.topProjects && analyticsData.topProjects.length > 0 ? (
              <div className="space-y-2">
                {analyticsData.topProjects
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((project, idx) => (
                    <div
                      key={idx}
                      className="dark:bg-purple-dark/20 flex items-center justify-between rounded-xl bg-white/50 p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                        </span>
                        <span className="text-wine dark:text-pink-light text-sm font-bold">
                          {project!.title.length > 20
                            ? project!.title.slice(0, 20) + '...'
                            : project!.title}
                        </span>
                      </div>
                      <span className="bg-pink-hot/20 text-pink-hot rounded-full px-2 py-1 text-xs font-bold">
                        {project!.count}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <span className="text-4xl">⭐</span>
                <p className="text-wine/60 dark:text-pink-light/60 mt-2 text-sm">
                  Sin proyectos vistos aún
                </p>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}
