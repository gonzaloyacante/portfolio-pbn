import { getExtendedAnalyticsData } from '@/actions/analytics'
import VisitorMap from '@/components/features/dashboard/VisitorMap'
import WebVitals from '@/components/features/dashboard/WebVitals'

export default async function DashboardExtendedSection() {
  const extended = await getExtendedAnalyticsData(30)

  const topCountries = extended
    ? Object.entries(extended.countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50)
    : []

  return (
    <>
      <VisitorMap geoPoints={extended?.geoPoints ?? []} topCountries={topCountries} />
      {extended && <WebVitals data={extended} />}
    </>
  )
}
