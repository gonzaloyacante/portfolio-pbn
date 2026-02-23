import { Skeleton } from '@/components/ui'

export default function PublicLoading() {
  return (
    <div className="w-full bg-(--background) px-6 py-12 lg:px-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left Column Skeleton */}
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <Skeleton className="h-16 w-3/4 rounded-xl" /> {/* Title */}
          <Skeleton className="h-12 w-1/2 rounded-xl" /> {/* Subtitle */}
          <div className="mt-8 flex flex-col items-center gap-4 lg:items-start">
            <Skeleton className="h-64 w-64 rounded-full" variant="circular" /> {/* Illustration */}
            <Skeleton className="h-8 w-48 rounded-lg" /> {/* Name */}
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="hidden lg:block">
          <Skeleton className="h-[600px] w-full max-w-md rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  )
}
