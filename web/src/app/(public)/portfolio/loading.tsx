import { Skeleton } from '@/components/ui'

/**
 * Portfolio Page Skeleton — matches real layout:
 * Header (title + subtitle) + responsive category card grid
 */
export default function PortfolioLoading() {
  return (
    <section className="w-full bg-(--background) transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8 lg:mb-10 lg:text-left">
          <Skeleton className="mx-auto mb-4 h-14 w-56 rounded-xl lg:mx-0" />
          <Skeleton className="mx-auto h-5 w-80 rounded lg:mx-0" />
        </div>

        {/* Category Grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full rounded-[2.5rem]" />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 flex items-center justify-center gap-3 border-t border-(--border) pt-10">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      </div>
    </section>
  )
}
