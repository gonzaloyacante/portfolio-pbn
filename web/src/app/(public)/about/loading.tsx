import { Skeleton } from '@/components/ui'

/**
 * About Page Skeleton — matches real layout:
 * Two-column (bio + profile image), skills chips, certifications, testimonials strip
 */
export default function AboutLoading() {
  return (
    <section className="w-full bg-(--background) transition-colors duration-500">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-6 py-8 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        {/* Left: Bio Column */}
        <div className="flex flex-col gap-6">
          {/* Illustration */}
          <Skeleton className="h-40 w-40 rounded-full" variant="circular" />
          {/* Title */}
          <Skeleton className="h-10 w-64 rounded-xl" />
          {/* Intro paragraph */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
          {/* Skills chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
          {/* Certifications */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-5 w-40 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-52 rounded" />
            ))}
          </div>
        </div>

        {/* Right: Profile Image */}
        <div className="flex items-center justify-center">
          <Skeleton className="h-[500px] w-full max-w-sm rounded-[3rem]" />
        </div>
      </div>

      {/* Testimonials Strip */}
      <div className="border-border border-t px-6 py-12 lg:px-16">
        <Skeleton className="mx-auto mb-8 h-8 w-56 rounded-xl" />
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border p-6">
              <div className="mb-3 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" variant="circular" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="mt-1.5 h-3 w-4/5 rounded" />
              <Skeleton className="mt-1.5 h-3 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
