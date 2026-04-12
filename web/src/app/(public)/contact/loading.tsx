import { Skeleton } from '@/components/ui'

/**
 * Contact Page Skeleton — matches real layout:
 * Desktop: two-column (illustration + info | contact form)
 * Mobile: compact header + form stacked
 */
export default function ContactLoading() {
  return (
    <section className="bg-background w-full transition-colors duration-500">
      {/* Mobile Header */}
      <div className="flex flex-col items-center px-6 pt-8 pb-0 text-center lg:hidden">
        <Skeleton className="mb-4 h-10 w-48 rounded-xl" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-6 py-6 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        {/* Left: Illustration + Info (desktop only) */}
        <div className="hidden flex-col items-start gap-6 pt-10 lg:flex">
          <Skeleton className="h-80 w-80 rounded-full" variant="circular" />
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" variant="circular" />
              <Skeleton className="h-5 w-56 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" variant="circular" />
              <Skeleton className="h-5 w-44 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" variant="circular" />
              <Skeleton className="h-5 w-36 rounded" />
            </div>
          </div>
          {/* Social Links */}
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border-border flex items-center gap-3 rounded-2xl border p-4">
                <Skeleton className="h-8 w-8 rounded-full" variant="circular" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="w-full">
          <Skeleton className="h-[520px] w-full rounded-[2.5rem]" />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-primary/20 border-t py-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="mx-auto mb-2 h-4 w-48 rounded" />
        <Skeleton className="mx-auto h-3 w-32 rounded" />
      </div>
    </section>
  )
}
