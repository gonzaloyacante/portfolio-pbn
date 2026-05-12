'use client'

import type { FeatureCollection, Point } from 'geojson'
import { useMemo, useState } from 'react'
import { Map, MapClusterLayer, MapControls } from '@/components/ui'
import { BRAND } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface GeoPoint {
  lat: number
  lon: number
  country: string | null
  city: string | null
}

interface CountryStat {
  country: string
  count: number
}

interface WorldMapProps {
  geoPoints?: GeoPoint[]
  topCountries?: CountryStat[]
  className?: string
}

/** Centro inicial (Europa / Atlántico) alineado con el mapa anterior. */
const DEFAULT_CENTER: [number, number] = [10, 22]
const DEFAULT_ZOOM = 1.35

/**
 * Mapa de visitantes (admin): MapLibre + estilos CARTO (componente mapcn / shadcn registry).
 * Agrupa visitas por proximidad; la leyenda resume el máximo por país.
 */
export default function WorldMap({
  geoPoints = [],
  topCountries = [],
  className = '',
}: WorldMapProps) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null)

  const clusterData = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: geoPoints.map((p, i) => ({
          type: 'Feature',
          id: `visit-${i}`,
          properties: {
            id: `visit-${i}`,
            city: p.city ?? '',
            country: p.country ?? '',
          },
          geometry: {
            type: 'Point',
            coordinates: [p.lon, p.lat],
          },
        })),
      }) as FeatureCollection<Point>,
    [geoPoints]
  )

  const maxCount = useMemo(() => Math.max(...topCountries.map((c) => c.count), 1), [topCountries])

  if (geoPoints.length === 0) {
    return (
      <div
        className={cn(
          'border-border bg-muted/15 text-muted-foreground relative flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed text-sm',
          className
        )}
      >
        No hay visitas con ubicación en este período.
      </div>
    )
  }

  return (
    <div className={cn('border-border relative overflow-hidden rounded-2xl border', className)}>
      {hoverLabel ? (
        <div className="bg-card border-border pointer-events-none absolute top-3 left-3 z-20 max-w-[min(100%,18rem)] rounded-xl border px-3 py-2 shadow-md">
          <p className="text-foreground text-sm font-semibold">{hoverLabel}</p>
        </div>
      ) : null}

      <div className="h-[min(420px,55vh)] min-h-[280px] w-full">
        <Map
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          pitch={0}
          bearing={0}
          minZoom={0.8}
          maxZoom={12}
          scrollZoom
          dragRotate={false}
          touchPitch={false}
          className="min-h-[280px]"
        >
          <MapControls position="bottom-right" showZoom showCompass={false} />
          <MapClusterLayer
            data={clusterData}
            clusterMaxZoom={14}
            clusterRadius={52}
            clusterColors={[BRAND.secondary, BRAND.mapClusterMid, BRAND.primary]}
            clusterThresholds={[8, 32]}
            pointColor={BRAND.primary}
            onPointClick={(feature) => {
              const props = feature.properties as { city?: string; country?: string }
              const label = [props.city, props.country].filter(Boolean).join(', ')
              setHoverLabel(label || 'Visita')
            }}
          />
        </Map>
      </div>

      {topCountries.length > 0 ? (
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          <div
            className="h-3 w-20 rounded-sm"
            style={{
              background: `linear-gradient(to right, ${BRAND.secondary}, ${BRAND.primary})`,
            }}
          />
          <span className="text-foreground text-[10px] font-medium opacity-90">
            Países: 1 — {maxCount} visitas
          </span>
        </div>
      ) : null}
    </div>
  )
}
