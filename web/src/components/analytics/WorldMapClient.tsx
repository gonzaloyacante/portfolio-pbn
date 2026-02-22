'use client'

import dynamic from 'next/dynamic'

const WorldMapInner = dynamic(() => import('./WorldMap'), { ssr: false })

interface WorldMapClientProps {
  geoPoints: { lat: number; lon: number; city: string; country: string }[]
  topCountries: { country: string; count: number }[]
  className?: string
}

export default function WorldMapClient(props: WorldMapClientProps) {
  return <WorldMapInner {...props} />
}
