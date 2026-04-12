import { Skeleton } from './Skeleton'
import {
  SkeletonPageHeader,
  SkeletonStatCards,
  SkeletonAnalyticsChart,
  SkeletonSmallCard,
} from './SkeletonBlocks'
import {
  SkeletonCategoryGrid,
  SkeletonServiceList,
  SkeletonTestimonialList,
  SkeletonTrashGrid,
  SkeletonContactList,
} from './SkeletonLists'

export function SkeletonDashboardPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <SkeletonStatCards count={4} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SkeletonAnalyticsChart />
        </div>
        <div className="space-y-6">
          <SkeletonSmallCard />
          <SkeletonSmallCard />
        </div>
      </div>
      <SkeletonSmallCard />
    </div>
  )
}

export function SkeletonContactsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <SkeletonPageHeader />
        <Skeleton className="h-20 w-28 rounded-2xl" />
      </div>
      <SkeletonContactList count={6} />
    </div>
  )
}

export function SkeletonCategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonPageHeader />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>
      <SkeletonCategoryGrid count={6} />
    </div>
  )
}

export function SkeletonServicesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <SkeletonPageHeader />
      <SkeletonServiceList count={4} />
    </div>
  )
}

export function SkeletonTestimonialsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <SkeletonPageHeader />
      <div className="bg-card space-y-4 rounded-[2.5rem] border p-6 shadow-sm">
        <Skeleton className="h-5 w-40 rounded" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
      <SkeletonTestimonialList count={3} />
    </div>
  )
}

export function SkeletonTrashPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <SkeletonTrashGrid count={4} />
    </div>
  )
}

export function SkeletonSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <SkeletonPageHeader />
      {[1, 2].map((i) => (
        <div key={i} className="bg-card space-y-4 rounded-[2.5rem] border p-6 shadow-sm">
          <Skeleton className="h-5 w-40 rounded" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonFormPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <SkeletonPageHeader />
      <div className="bg-card space-y-5 rounded-[2.5rem] border p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonAnalyticsPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <SkeletonStatCards count={4} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkeletonAnalyticsChart />
        <SkeletonAnalyticsChart />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SkeletonSmallCard />
        <SkeletonSmallCard />
        <SkeletonSmallCard />
      </div>
    </div>
  )
}

export function SkeletonCalendarPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-[2.5rem] border p-6 shadow-sm">
            <Skeleton className="mb-4 h-5 w-32 rounded" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card space-y-2 rounded-[2.5rem] border p-4 shadow-sm">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonGalleryPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
