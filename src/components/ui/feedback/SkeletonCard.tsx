/**
 * Skeleton Loader para mejorar UX durante carga
 */

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      {/* Imagen skeleton */}
      <div className="rounded-theme bg-muted aspect-4/3 w-full animate-pulse" />

      {/* Título skeleton */}
      <div className="bg-muted mt-4 h-6 w-3/4 animate-pulse rounded" />

      {/* Descripción skeleton */}
      <div className="mt-2 space-y-2">
        <div className="bg-muted h-4 w-full animate-pulse rounded" />
        <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
      </div>

      {/* Categoría skeleton */}
      <div className="bg-muted mt-3 h-5 w-24 animate-pulse rounded-full" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonTestimonial() {
  return (
    <div className="rounded-theme bg-card animate-pulse p-6 shadow-lg">
      {/* Avatar */}
      <div className="bg-muted mx-auto h-16 w-16 animate-pulse rounded-full" />

      {/* Nombre */}
      <div className="bg-muted mx-auto mt-4 h-5 w-32 animate-pulse rounded" />

      {/* Texto */}
      <div className="mt-4 space-y-2">
        <div className="bg-muted h-4 w-full animate-pulse rounded" />
        <div className="bg-muted h-4 w-full animate-pulse rounded" />
        <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
      </div>

      {/* Estrellas */}
      <div className="mt-4 flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-muted h-5 w-5 animate-pulse rounded" />
        ))}
      </div>
    </div>
  )
}
