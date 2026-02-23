import { Section } from '@/components/layout'
import WorldMapClient from '@/components/analytics/WorldMapClient'

interface GeoPoint {
  lat: number
  lon: number
  city: string
  country: string
}

interface CountryStat {
  country: string
  count: number
}

interface VisitorMapProps {
  geoPoints: GeoPoint[]
  topCountries: CountryStat[]
}

export default function VisitorMap({ geoPoints, topCountries }: VisitorMapProps) {
  return (
    <Section title="🗺️ Mapa de Visitantes (30 días)">
      <WorldMapClient
        geoPoints={geoPoints}
        topCountries={topCountries}
        className="min-h-[300px] w-full"
      />
    </Section>
  )
}
