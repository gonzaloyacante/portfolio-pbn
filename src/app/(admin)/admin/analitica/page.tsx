import { getAnalyticsDashboardData } from '@/actions/analytics.actions'

export default async function AnalyticsPage() {
  const data = await getAnalyticsDashboardData()

  if (!data) {
    return <div className="p-6 text-red-500">Error cargando datos de analítica.</div>
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

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard de Rendimiento</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Visitas Totales (7 días)</h3>
          <p className="text-primary mt-2 text-3xl font-bold">{totalVisits}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Interés en Proyectos</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{detailVisits}</p>
          <p className="mt-1 text-xs text-gray-400">Clics en detalles</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Leads Generados</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{contactLeads}</p>
          <p className="mt-1 text-xs text-gray-400">Formularios enviados</p>
        </div>
      </div>

      {/* Trend Chart (Simple CSS Bar Chart) */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-800">
          Tendencia de Visitas (Última Semana)
        </h3>
        <div className="flex h-48 items-end justify-between gap-2">
          {trendData.map((day) => {
            const max = Math.max(...trendData.map((d) => d.count), 1)
            const height = (day.count / max) * 100
            return (
              <div key={day.date} className="group flex flex-1 flex-col items-center">
                <div className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-t-md bg-gray-50">
                  <div
                    style={{ height: `${height}%` }}
                    className="bg-primary/80 group-hover:bg-primary min-h-1 w-full rounded-t-md transition-all duration-500"
                  ></div>
                  <div className="pointer-events-none absolute -top-8 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {day.count}
                  </div>
                </div>
                <p className="mt-2 w-full rotate-0 truncate text-center text-xs text-gray-500 md:rotate-0">
                  {day.date.slice(5)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top Projects */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Proyectos Estrella</h3>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Proyecto
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Vistas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topProjects && topProjects.length > 0 ? (
                  // Ensure we map only non-null entries to satisfy TypeScript
                  topProjects.filter(Boolean).map((project, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-700">{project!.title}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {project!.count}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-sm text-gray-500">
                      Sin datos suficientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device & Location */}
        <div className="space-y-6">
          {/* Device Usage */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Dispositivos</h3>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{deviceUsage.mobile}</div>
                <div className="text-sm text-gray-500">Móvil</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{deviceUsage.desktop}</div>
                <div className="text-sm text-gray-500">Escritorio</div>
              </div>
            </div>
            <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                style={{
                  width: `${(deviceUsage.mobile / (deviceUsage.mobile + deviceUsage.desktop || 1)) * 100}%`,
                }}
                className="bg-accent h-full"
              ></div>
              <div
                style={{
                  width: `${(deviceUsage.desktop / (deviceUsage.mobile + deviceUsage.desktop || 1)) * 100}%`,
                }}
                className="bg-primary h-full"
              ></div>
            </div>
          </div>

          {/* Top Locations */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Ubicaciones (Top IPs)</h3>
            <ul className="space-y-3">
              {topLocations.map((loc, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="rounded bg-gray-50 px-2 py-1 font-mono text-gray-600">
                    {loc.ip}
                  </span>
                  <span className="font-medium text-gray-900">{loc.count} visitas</span>
                </li>
              ))}
              {topLocations.length === 0 && (
                <li className="text-center text-sm text-gray-500">Sin datos de ubicación</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
