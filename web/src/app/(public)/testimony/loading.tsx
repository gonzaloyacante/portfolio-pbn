import { Skeleton } from '@/components/ui'

/**
 * Testimony Page Skeleton — matches real layout:
 * Centered narrow container: form card + optional testimonials slider
 */
export default function TestimonyLoading() {
  return (
    <section className="bg-background min-h-[70vh] py-16 transition-colors duration-500">
      <div className="mx-auto max-w-lg px-6">
        {/* Form section */}
        <div className="mb-16">
          <div className="mb-10 flex flex-col items-center gap-3">
            <Skeleton className="h-9 w-56 rounded-xl" />
            <Skeleton className="h-4 w-80 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>

          {/* Form card */}
          <div className="bg-card border-border/50 flex flex-col gap-5 rounded-2xl border p-8 shadow-md">
            {/* Name */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            {/* Position */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            {/* Rating */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-16 rounded" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full" variant="circular" />
                ))}
              </div>
            </div>
            {/* Text */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            {/* Submit */}
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>

        {/* Testimonials section */}
        <div className="border-t border-(--border) pt-16">
          <Skeleton className="mx-auto mb-8 h-8 w-56 rounded-xl" />
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border-border/50 flex flex-col rounded-2xl border p-5"
              >
                <Skeleton className="mb-2 h-4 w-20 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="mt-1 h-3 w-4/5 rounded" />
                <Skeleton className="mt-3 h-3 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
