import { Section } from '@/components/layout'

interface Location {
  location: string
  count: number
}

interface TopLocationsProps {
  locations: Location[]
}

export default function TopLocations({ locations }: TopLocationsProps) {
  if (locations.length === 0) return null

  return (
    <Section title="🌍 Top Ciudades / Países (7 días)">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {locations.map((loc, idx) => (
          <div
            key={idx}
            className="bg-card border-border flex items-center justify-between rounded-xl border px-4 py-3"
          >
            <span className="text-foreground text-sm font-medium">{loc.location}</span>
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-bold">
              {loc.count}
            </span>
          </div>
        ))}
      </div>
    </Section>
  )
}
