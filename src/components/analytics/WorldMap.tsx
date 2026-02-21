'use client'

import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { interpolateRgb } from 'd3-interpolate'
import type { MouseEvent as ReactMouseEvent } from 'react'

// Public domain topology from naturalearth
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

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

export default function WorldMap({
  geoPoints = [],
  topCountries = [],
  className = '',
}: WorldMapProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  // Build country → count map for choropleth coloring
  const countryCountMap = useMemo(() => {
    const map = new Map<string, number>()
    topCountries.forEach((c) => map.set(c.country.toUpperCase(), c.count))
    return map
  }, [topCountries])

  const maxCount = useMemo(() => Math.max(...topCountries.map((c) => c.count), 1), [topCountries])

  // Color scale: light pink → deep primary
  const colorScale = scaleLinear<string>()
    .domain([0, maxCount])
    .range(['#fce7f3', '#6c0a0a'])
    .interpolate(interpolateRgb)

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Tooltip */}
      {tooltip && (
        <div
          className="bg-card border-border pointer-events-none absolute z-10 rounded-xl border px-3 py-2 shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="text-foreground text-sm font-semibold">{tooltip.text}</p>
        </div>
      )}

      <ComposableMap
        projectionConfig={{ scale: 140, center: [10, 20] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({
              geographies,
            }: {
              geographies: Array<{ rsmKey: string; properties: Record<string, string> }>
            }) =>
              geographies.map((geo) => {
                // Match country by ISO alpha-2 or alpha-3
                const countryCode =
                  geo.properties?.ISO_A2?.toUpperCase() || geo.properties?.name?.toUpperCase()
                const count = countryCountMap.get(countryCode) ?? 0
                const fill = count > 0 ? colorScale(count) : 'var(--muted)'

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="var(--border)"
                    strokeWidth={0.4}
                    onMouseEnter={(evt: ReactMouseEvent<SVGPathElement>) => {
                      if (count > 0) {
                        setTooltip({
                          text: `${geo.properties?.name ?? countryCode}: ${count} visit${count !== 1 ? 's' : ''}`,
                          x: evt.nativeEvent.offsetX,
                          y: evt.nativeEvent.offsetY,
                        })
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: 'none' },
                      hover: {
                        fill: count > 0 ? '#881337' : 'var(--muted)',
                        outline: 'none',
                        transition: 'all 0.2s',
                      },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* City dots */}
          {geoPoints.map((point, i) => (
            <Marker key={i} coordinates={[point.lon, point.lat]}>
              <circle
                r={3}
                fill="var(--primary)"
                fillOpacity={0.8}
                stroke="white"
                strokeWidth={1}
                onMouseEnter={(evt: ReactMouseEvent<SVGCircleElement>) =>
                  setTooltip({
                    text: [point.city, point.country].filter(Boolean).join(', ') || 'Unknown',
                    x: evt.nativeEvent.offsetX,
                    y: evt.nativeEvent.offsetY,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
                className="hover:r-5 cursor-pointer transition-all"
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      {topCountries.length > 0 && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          <div
            className="h-3 w-20 rounded-sm"
            style={{
              background: `linear-gradient(to right, #fce7f3, #6c0a0a)`,
            }}
          />
          <span className="text-foreground text-[10px] font-medium opacity-90">
            1 — {maxCount} visitas
          </span>
        </div>
      )}
    </div>
  )
}
