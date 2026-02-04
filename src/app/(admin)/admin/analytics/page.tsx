import { getAnalyticsDashboardData } from '@/actions/analytics'
import { StatCard } from '@/components/ui'
import { Section, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/ui'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

export default async function AnalyticsPage() {
  const data = await getAnalyticsDashboardData()

  if (!data) {
    return (
      <div className="p-6">
        <EmptyState
          icon="📊"
          title="Error cargando analítica"
          description="No se pudieron cargar los datos de analítica. Intenta de nuevo más tarde."
        />
      </div>
    )
  }

  const {
    totalVisits,
    detailVisits,
    contactLeads,
    trendData,
    topProjects,
    deviceUsage,
    topLocations,
  } = data

  const totalDevices = deviceUsage.mobile + deviceUsage.desktop || 1
  const mobilePercent = Math.round((deviceUsage.mobile / totalDevices) * 100)
  const desktopPercent = 100 - mobilePercent

  return (
    <div className="space-y-8">
      <PageHeader
        title="📊 Analítica del Portfolio"
        description="Estadísticas de visitas y engagement de los últimos 7 días"
      />

      {/* Aviso sobre Google Analytics */}
      <Section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📈</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Métricas avanzadas con Google Analytics
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Para métricas detalladas como fuentes de tráfico, comportamiento de usuarios,
              conversiones y mucho más, accede a tu panel de Google Analytics.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                Abrir Google Analytics
              </a>
              <Link
                href={ROUTES.admin.settings}
                className="bg-card text-foreground hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              >
                ⚙️ Configurar GA
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon="👀" label="Visitas Totales" value={totalVisits} subtitle="Últimos 7 días" />
        <StatCard
          icon="🎨"
          label="Interés en Proyectos"
          value={detailVisits}
          subtitle="Clics en detalles"
        />
        <StatCard
          icon="💌"
          label="Leads Generados"
          value={contactLeads}
          subtitle="Formularios enviados"
        />
      </div>

      {/* Gráfico de tendencia */}
      <Section>
        <h3 className="text-foreground mb-6 flex items-center gap-2 text-lg font-semibold">
          📈 Tendencia de Visitas
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-normal text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            Última semana
          </span>
        </h3>
        <div className="flex h-48 items-end justify-between gap-2">
          {trendData.map((day) => {
            const max = Math.max(...trendData.map((d) => d.count), 1)
            const height = (day.count / max) * 100
            return (
              <div key={day.date} className="group flex flex-1 flex-col items-center">
                <div className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
                  <div
                    style={{ height: `${Math.max(height, 5)}%` }}
                    className="bg-primary/80 group-hover:bg-primary w-full rounded-t-lg transition-all duration-500"
                  />
                  <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {day.count} visitas
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
                <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString('es', { weekday: 'short' })}
                </p>
              </div>
            )
          })}
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Proyectos Estrella */}
        <Section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
            ⭐ Proyectos Más Vistos
          </h3>
          {topProjects && topProjects.length > 0 ? (
            <div className="space-y-3">
              {topProjects.filter(Boolean).map((project, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-lg">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📸'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {project!.title}
                    </span>
                  </div>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold">
                    {project!.count} vistas
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📊"
              title="Sin datos suficientes"
              description="Los proyectos más vistos aparecerán aquí"
            />
          )}
        </Section>

        {/* Dispositivos y Ubicaciones */}
        <div className="space-y-6">
          {/* Dispositivos */}
          <Section>
            <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
              📱 Dispositivos
            </h3>
            <div className="flex items-center justify-around py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {deviceUsage.mobile}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">📱 Móvil</div>
                <div className="mt-1 text-xs font-medium text-gray-400">{mobilePercent}%</div>
              </div>
              <div className="h-16 w-px bg-gray-200 dark:bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {deviceUsage.desktop}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">💻 Escritorio</div>
                <div className="mt-1 text-xs font-medium text-gray-400">{desktopPercent}%</div>
              </div>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                style={{ width: `${mobilePercent}%` }}
                className="bg-primary h-2 w-2 rounded-full"
              />
              <div
                style={{ width: `${desktopPercent}%` }}
                className="bg-secondary h-2 w-2 rounded-full"
              />
            </div>
          </Section>

          {/* Ubicaciones */}
          <Section>
            <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
              🌍 Top Visitantes
            </h3>
            {topLocations.length > 0 ? (
              <ul className="space-y-2">
                {topLocations.map((loc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700"
                  >
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                      {loc.ip}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {loc.count} visitas
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Sin datos de ubicación aún
              </p>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}
