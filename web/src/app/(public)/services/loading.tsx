import { Skeleton } from '@/components/ui'

/**
 * Services Page Skeleton — matches real layout:
 * Header title + subtitle, then 3-column service card grid (image + content + CTA)
 */
export default function ServicesLoading() {
  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-12 w-52 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-2xl rounded" />
          <Skeleton className="h-4 w-3/4 max-w-xl rounded" />
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card flex flex-col overflow-hidden rounded-3xl border">
              {/* Image placeholder */}
              <Skeleton className="h-48 w-full rounded-none rounded-t-3xl" />
              {/* Card content */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <Skeleton className="h-6 w-3/4 rounded" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-5/6 rounded" />
                  <Skeleton className="h-3.5 w-4/6 rounded" />
                </div>
                {/* Price + duration */}
                <div className="border-border flex gap-6 border-t pt-4">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12 rounded" />
                    <Skeleton className="h-7 w-16 rounded" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-14 rounded" />
                    <Skeleton className="h-5 w-20 rounded" />
                  </div>
                </div>
                {/* CTA buttons */}
                <div className="mt-auto flex flex-col gap-3">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA block */}
        <div className="bg-card border-border mx-auto mt-16 max-w-2xl rounded-3xl border p-8 text-center">
          <Skeleton className="mx-auto mb-3 h-7 w-64 rounded" />
          <Skeleton className="mx-auto mb-6 h-4 w-80 rounded" />
          <Skeleton className="mx-auto h-11 w-56 rounded-xl" />
        </div>
      </div>
    </main>
  )
}
