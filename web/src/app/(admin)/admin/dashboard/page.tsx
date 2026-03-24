import { Suspense } from 'react'
import {
  SkeletonStatCards,
  SkeletonAnalyticsChart,
  SkeletonSmallCard,
  SkeletonPageHeader,
} from '@/components/ui'
import DashboardContentSection from './_sections/DashboardContentSection'
import DashboardAnalyticsSection from './_sections/DashboardAnalyticsSection'
import DashboardExtendedSection from './_sections/DashboardExtendedSection'

export default function DashboardPage() {
  return (
    <div className="page-transition space-y-8">
      <Suspense
        fallback={
          <>
            <SkeletonPageHeader />
            <SkeletonStatCards count={4} />
          </>
        }
      >
        <DashboardContentSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <SkeletonAnalyticsChart />
            <div className="space-y-6">
              <SkeletonSmallCard />
              <SkeletonSmallCard />
            </div>
          </div>
        }
      >
        <DashboardAnalyticsSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="space-y-6">
            <SkeletonSmallCard />
            <SkeletonSmallCard />
          </div>
        }
      >
        <DashboardExtendedSection />
      </Suspense>
    </div>
  )
}
