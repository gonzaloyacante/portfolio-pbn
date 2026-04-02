import { Section } from '@/components/layout'

interface TrendDay {
  date: string
  count: number
}

interface VisitsChartProps {
  totalVisits: number
  detailVisits: number
  contactLeads: number
  trendData: TrendDay[]
}

const DAYS_ES = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

export default function VisitsChart({
  totalVisits,
  detailVisits,
  contactLeads,
  trendData,
}: VisitsChartProps) {
  const maxCount = Math.max(...trendData.map((d) => d.count), 1)

  return (
    <Section title="📊 Visitas (últimos 7 días)" className="xl:col-span-2">
      {trendData.length > 0 ? (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border-border rounded-2xl border p-4 text-center">
              <p className="text-primary text-3xl font-bold">{totalVisits}</p>
              <p className="text-muted-foreground text-sm font-medium">Total visitas</p>
            </div>
            <div className="bg-card border-border rounded-2xl border p-4 text-center">
              <p className="text-primary text-3xl font-bold">{detailVisits}</p>
              <p className="text-muted-foreground text-sm font-medium">Imágenes vistas</p>
            </div>
            <div className="bg-card border-border rounded-2xl border p-4 text-center">
              <p className="text-primary text-3xl font-bold">{contactLeads}</p>
              <p className="text-muted-foreground text-sm font-medium">Leads/Contactos</p>
            </div>
          </div>

          {/* Gráfico de barras */}
          <div className="flex items-end justify-around gap-2">
            {trendData.map((day) => {
              const barHeight = day.count === 0 ? 4 : Math.max((day.count / maxCount) * 160, 8)
              const date = new Date(day.date)
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-primary text-sm font-bold">{day.count}</span>
                  <div
                    className="bg-primary w-full max-w-[50px] rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${barHeight}px` }}
                  />
                  <span className="text-foreground text-xs font-bold">
                    {DAYS_ES[date.getDay()]}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    {date.getDate()}/{date.getMonth() + 1}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="border-border bg-muted/20 flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-center">
          <span className="text-5xl">📊</span>
          <p className="text-foreground font-medium">Sin datos de visitas aún</p>
          <p className="text-muted-foreground text-sm">
            Las estadísticas aparecerán cuando el sitio reciba tráfico
          </p>
        </div>
      )}
    </Section>
  )
}
