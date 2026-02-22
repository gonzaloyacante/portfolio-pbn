import { Section } from '@/components/layout'

interface WebVitalsData {
  avgVitalsLCP: number | null
  avgVitalsFCP: number | null
  avgVitalsINP: number | null
  avgVitalsCLS: number | null
  avgScrollDepth: number | null
  avgTimeOnPage: number | null
}

interface WebVitalsProps {
  data: WebVitalsData
}

interface MetricCardProps {
  label: string
  value: string
  description: string
  ok: boolean
}

function MetricCard({ label, value, description, ok }: MetricCardProps) {
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

export default function WebVitals({ data }: WebVitalsProps) {
  const metrics: MetricCardProps[] = [
    {
      label: 'LCP',
      value: data.avgVitalsLCP ? `${Math.round(data.avgVitalsLCP)}ms` : '—',
      description: 'Largest Contentful Paint',
      ok: !data.avgVitalsLCP || data.avgVitalsLCP < 2500,
    },
    {
      label: 'FCP',
      value: data.avgVitalsFCP ? `${Math.round(data.avgVitalsFCP)}ms` : '—',
      description: 'First Contentful Paint',
      ok: !data.avgVitalsFCP || data.avgVitalsFCP < 1800,
    },
    {
      label: 'INP',
      value: data.avgVitalsINP ? `${Math.round(data.avgVitalsINP)}ms` : '—',
      description: 'Interaction to Next Paint',
      ok: !data.avgVitalsINP || data.avgVitalsINP < 200,
    },
    {
      label: 'CLS',
      value: data.avgVitalsCLS ? data.avgVitalsCLS.toFixed(3) : '—',
      description: 'Cumulative Layout Shift',
      ok: !data.avgVitalsCLS || data.avgVitalsCLS < 0.1,
    },
    {
      label: 'Scroll',
      value: data.avgScrollDepth ? `${Math.round(data.avgScrollDepth)}%` : '—',
      description: 'Profundidad de scroll',
      ok: true,
    },
    {
      label: 'Tiempo',
      value: data.avgTimeOnPage ? `${Math.round(data.avgTimeOnPage)}s` : '—',
      description: 'Tiempo en página',
      ok: true,
    },
  ]

  return (
    <Section title="⚡ Rendimiento y Engagement (30 días)">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>
    </Section>
  )
}
