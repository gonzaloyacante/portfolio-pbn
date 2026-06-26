import { Section } from '@/components/layout'

export default function DashboardTrafficSection() {
  return (
    <Section title="Estadísticas de visitas">
      <div className="border-border bg-muted/20 rounded-2xl border border-dashed p-5">
        <div className="space-y-2">
          <p className="text-foreground font-semibold">
            Las visitas se consultan en Google Analytics.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ahí podés ver cuánta gente entra, desde dónde llega y qué páginas mira. Este panel se
            queda solo con tareas y estado de la web para no gastar base de datos en estadísticas.
          </p>
          <a
            href="https://analytics.google.com/analytics/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex min-h-11 items-center font-semibold hover:underline"
          >
            Abrir Google Analytics
          </a>
        </div>
      </div>
    </Section>
  )
}
