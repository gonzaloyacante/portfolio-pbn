import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('relative bg-zinc-200/60 dark:bg-zinc-800/60 rounded-md overflow-hidden', className)}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
    </div>
  )
}

// Skeleton específico para ProjectCard
function ProjectCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${featured ? "col-span-1 md:col-span-2 row-span-2" : ""}`}>
      <Skeleton className={`w-full ${featured ? "h-96" : "h-64"}`} />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

// Skeleton para formulario
function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-12 w-40" />
    </div>
  )
}

// Skeleton para lista
function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { Skeleton, ProjectCardSkeleton, FormSkeleton, ListSkeleton }
