import { getAnalyticsDashboardData } from '@/actions/analytics'
import VisitsChart from '@/components/features/dashboard/VisitsChart'
import DeviceUsage from '@/components/features/dashboard/DeviceUsage'
import TopProjects from '@/components/features/dashboard/TopProjects'
import TopLocations from '@/components/features/dashboard/TopLocations'

export default async function DashboardAnalyticsSection() {
  const analyticsData = await getAnalyticsDashboardData()

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {analyticsData && (
          <VisitsChart
            totalVisits={analyticsData.totalVisits}
            detailVisits={analyticsData.detailVisits}
            contactLeads={analyticsData.contactLeads}
            trendData={analyticsData.trendData}
          />
        )}
        <div className="space-y-6">
          <DeviceUsage
            deviceUsage={analyticsData?.deviceUsage ?? { mobile: 0, tablet: 0, desktop: 0 }}
          />
          <TopProjects projects={analyticsData?.topProjects ?? []} />
        </div>
      </div>
      <TopLocations locations={analyticsData?.topLocations ?? []} />
    </>
  )
}
