/**
 * Skeleton Loader para mejorar UX durante carga
 */

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      {/* Imagen skeleton */}
      <div className="rounded-theme aspect-[4/3] w-full bg-gray-200 dark:bg-gray-700" />

      {/* Título skeleton */}
      <div className="mt-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

      {/* Descripción skeleton */}
      <div className="mt-2 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Categoría skeleton */}
      <div className="mt-3 h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonTestimonial() {
  return (
    <div className="rounded-theme animate-pulse bg-white p-6 shadow-lg dark:bg-gray-800">
      {/* Avatar */}
      <div className="mx-auto h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />

      {/* Nombre */}
      <div className="mx-auto mt-4 h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />

      {/* Texto */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Estrellas */}
      <div className="mt-4 flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  )
}
