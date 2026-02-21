import { getAnalyticsDashboardData, getExtendedAnalyticsData } from '@/actions/analytics'
import { StatCard } from '@/components/ui'
import { Section, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/ui'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import WorldMapClient from '@/components/analytics/WorldMapClient'

export default async function AnalyticsPage() {
  const [data, extended] = await Promise.all([
    getAnalyticsDashboardData(),
    getExtendedAnalyticsData(30),
  ])

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

  const totalDevices = deviceUsage.mobile + deviceUsage.tablet + deviceUsage.desktop || 1
  const mobilePercent = Math.round((deviceUsage.mobile / totalDevices) * 100)
  const tabletPercent = Math.round((deviceUsage.tablet / totalDevices) * 100)
  const desktopPercent = 100 - mobilePercent - tabletPercent

  // Prepare WorldMap data
  const topCountries = extended
    ? Object.entries(extended.countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50)
    : []

  return (
    <div className="space-y-8">
      <PageHeader
        title="📊 Analítica del Portfolio"
        description="Estadísticas de visitas y engagement de los últimos 7 días"
      />

      {/* Aviso sobre Google Analytics */}
      <Section className="from-muted/50 to-background dark:from-muted/20 dark:to-background bg-linear-to-r">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📈</span>
          <div className="flex-1">
            <h3 className="text-foreground text-lg font-semibold">
              Métricas avanzadas con Google Analytics
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Para métricas detalladas como fuentes de tráfico, comportamiento de usuarios,
              conversiones y mucho más, accede a tu panel de Google Analytics.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted/50 dark:bg-muted/20 flex items-center justify-between rounded-lg px-4 py-3"
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
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-normal">
            Última semana
          </span>
        </h3>
        <div className="flex h-48 items-end justify-between gap-2">
          {trendData.map((day) => {
            const max = Math.max(...trendData.map((d) => d.count), 1)
            const height = (day.count / max) * 100
            return (
              <div key={day.date} className="group flex flex-1 flex-col items-center">
                <div className="bg-muted dark:bg-muted/20 relative flex h-full w-full items-end justify-center overflow-hidden rounded-t-lg">
                  <div
                    style={{ height: `${Math.max(height, 5)}%` }}
                    className="bg-primary/80 group-hover:bg-primary w-full rounded-t-lg transition-all duration-500"
                  />
                  <div className="bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 rounded-lg px-2 py-1 text-xs font-medium opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {day.count} visitas
                    <div className="border-t-popover absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" />
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 text-xs font-medium">
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
                  className="bg-muted/30 hover:bg-muted/50 dark:bg-muted/10 dark:hover:bg-muted/20 flex items-center justify-between rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-lg">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📸'}
                    </span>
                    <span className="text-foreground font-medium">{project!.title}</span>
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
            <div className="grid grid-cols-3 gap-2 py-4">
              <div className="text-center">
                <div className="text-foreground text-3xl font-bold">{deviceUsage.mobile}</div>
                <div className="text-muted-foreground text-sm">📱 Móvil</div>
                <div className="text-muted-foreground mt-1 text-xs font-medium">
                  {mobilePercent}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-foreground text-3xl font-bold">{deviceUsage.tablet}</div>
                <div className="text-muted-foreground text-sm">🖥 Tablet</div>
                <div className="text-muted-foreground mt-1 text-xs font-medium">
                  {tabletPercent}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-foreground text-3xl font-bold">{deviceUsage.desktop}</div>
                <div className="text-muted-foreground text-sm">💻 Escritorio</div>
                <div className="text-muted-foreground mt-1 text-xs font-medium">
                  {desktopPercent}%
                </div>
              </div>
            </div>
            <div className="bg-muted dark:bg-muted/20 flex h-3 overflow-hidden rounded-full">
              <div
                style={{ width: `${mobilePercent}%` }}
                className="bg-primary h-full transition-all"
              />
              <div
                style={{ width: `${tabletPercent}%` }}
                className="bg-primary/50 h-full transition-all"
              />
              <div
                style={{ width: `${desktopPercent}%` }}
                className="bg-secondary h-full transition-all"
              />
            </div>
          </Section>

          {/* Ubicaciones */}
          <Section>
            <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
              🌍 Top Ciudades
            </h3>
            {topLocations.length > 0 ? (
              <ul className="space-y-2">
                {topLocations.map((loc, idx) => (
                  <li
                    key={idx}
                    className="bg-muted/30 dark:bg-muted/10 flex items-center justify-between rounded-lg px-4 py-3"
                  >
                    <span className="text-foreground text-sm font-medium">{loc.location}</span>
                    <span className="text-muted-foreground text-sm">{loc.count} visitas</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Sin datos de ubicación aún
              </p>
            )}
          </Section>
        </div>
      </div>

      {/* World Map */}
      {extended && topCountries.length > 0 && (
        <Section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
            🗺 Mapa de Visitantes
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-normal">
              Últimos 30 días
            </span>
          </h3>
          <WorldMapClient
            geoPoints={extended.geoPoints}
            topCountries={topCountries}
            className="w-full"
          />
        </Section>
      )}

      {/* Extended Metrics — Web Vitals + Engagement */}
      {extended && (
        <Section>
          <h3 className="text-foreground mb-6 flex items-center gap-2 text-lg font-semibold">
            ⚡ Métricas de Rendimiento y Engagement
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-normal">
              Promedio 30 días
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard
              label="LCP"
              value={extended.avgVitalsLCP ? `${Math.round(extended.avgVitalsLCP)}ms` : '—'}
              description="Largest Contentful Paint"
              ok={!extended.avgVitalsLCP || extended.avgVitalsLCP < 2500}
            />
            <MetricCard
              label="FCP"
              value={extended.avgVitalsFCP ? `${Math.round(extended.avgVitalsFCP)}ms` : '—'}
              description="First Contentful Paint"
              ok={!extended.avgVitalsFCP || extended.avgVitalsFCP < 1800}
            />
            <MetricCard
              label="INP"
              value={extended.avgVitalsINP ? `${Math.round(extended.avgVitalsINP)}ms` : '—'}
              description="Interaction to Next Paint"
              ok={!extended.avgVitalsINP || extended.avgVitalsINP < 200}
            />
            <MetricCard
              label="CLS"
              value={extended.avgVitalsCLS ? extended.avgVitalsCLS.toFixed(3) : '—'}
              description="Cumulative Layout Shift"
              ok={!extended.avgVitalsCLS || extended.avgVitalsCLS < 0.1}
            />
            <MetricCard
              label="Scroll"
              value={extended.avgScrollDepth ? `${Math.round(extended.avgScrollDepth)}%` : '—'}
              description="Profundidad de scroll"
              ok
            />
            <MetricCard
              label="Tiempo"
              value={extended.avgTimeOnPage ? `${Math.round(extended.avgTimeOnPage)}s` : '—'}
              description="Tiempo en página"
              ok
            />
          </div>
        </Section>
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
  description,
  ok,
}: {
  label: string
  value: string
  description: string
  ok: boolean
}) {
  return (
    <div className="bg-card border-border rounded-2xl border p-4 text-center">
      <div className={`text-2xl font-bold ${ok ? 'text-primary' : 'text-destructive'}`}>
        {value}
      </div>
      <div className="text-foreground mt-1 text-sm font-semibold">{label}</div>
      <div className="text-muted-foreground mt-0.5 text-xs">{description}</div>
    </div>
  )
}
