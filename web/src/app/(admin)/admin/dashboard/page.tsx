import { Suspense } from 'react'
import { SkeletonStatCards, SkeletonPageHeader } from '@/components/ui'
import DashboardContentSection from './_sections/DashboardContentSection'

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
    </div>
  )
}
