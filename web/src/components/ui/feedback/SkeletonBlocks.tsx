import { Skeleton } from './Skeleton'

/** Fila genérica de tabla / lista (privada) */
function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 rounded-xl px-4 py-3">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <div className="flex flex-1 items-center gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 rounded"
            style={{ width: `${[40, 25, 20, 15][i % 4]}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function SkeletonPageHeader() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-56 rounded-xl" />
      <Skeleton className="h-4 w-80 rounded" />
    </div>
  )
}

export function SkeletonStatCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-[2.5rem] border p-6 shadow-sm">
          <Skeleton className="mb-3 h-8 w-8 rounded-lg" />
          <Skeleton className="mb-2 h-7 w-16 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonAnalyticsChart() {
  return (
    <div className="bg-card rounded-[2.5rem] border p-6 shadow-sm">
      <Skeleton className="mb-4 h-5 w-32 rounded" />
      <Skeleton className="h-56 w-full rounded-xl" />
      <div className="mt-4 flex gap-3">
        {[80, 60, 45].map((w, i) => (
          <Skeleton key={i} className="h-3 rounded" style={{ width: `${w}px` }} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonSmallCard() {
  return (
    <div className="bg-card rounded-[2.5rem] border p-6 shadow-sm">
      <Skeleton className="mb-3 h-5 w-28 rounded" />
      <div className="space-y-2">
        {[100, 85, 70, 55, 40].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-3 rounded" style={{ width: `${w}%` }} />
            <Skeleton className="h-3 w-8 shrink-0 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-card rounded-[2.5rem] border shadow-sm">
      <div className="flex items-center gap-4 border-b px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-3 rounded"
            style={{ width: `${[35, 20, 15, 15][i % 4]}%` }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </div>
  )
}
