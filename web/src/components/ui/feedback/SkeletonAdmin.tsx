import { Skeleton } from './Skeleton'

// ── Primitivos reutilizables ──────────────────────────────────────────────────

/** Fila genérica de tabla / lista */
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

// ── Page header ───────────────────────────────────────────────────────────────

export function SkeletonPageHeader() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-56 rounded-xl" />
      <Skeleton className="h-4 w-80 rounded" />
    </div>
  )
}

// ── Stat cards grid ───────────────────────────────────────────────────────────

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

// ── Analytics section (gráfico grande) ───────────────────────────────────────

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

// ── Table / list con N filas ──────────────────────────────────────────────────

export function SkeletonTable({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-card rounded-[2.5rem] border shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 border-b px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-3 rounded"
            style={{ width: `${[35, 20, 15, 15][i % 4]}%` }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </div>
  )
}

// ── Card grid (portfolio / categorías) ─────────────────────────────────────

export function SkeletonImageGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card overflow-hidden rounded-[2.5rem] border shadow-sm">
          <Skeleton className="aspect-4/3 w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="mt-2 h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonCategoryGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card flex items-center gap-4 rounded-[2.5rem] border p-4 shadow-sm"
        >
          <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Services list ─────────────────────────────────────────────────────────────

export function SkeletonServiceList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card flex items-center gap-4 rounded-[2.5rem] border p-4 shadow-sm"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0 rounded-xl" />
        </div>
      ))}
    </div>
  )
}

// ── Testimonials list ─────────────────────────────────────────────────────────

export function SkeletonTestimonialList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card space-y-3 rounded-[2.5rem] border p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Skeleton key={s} className="h-4 w-4 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Trash list ────────────────────────────────────────────────────────────────

export function SkeletonTrashGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card overflow-hidden rounded-[2.5rem] border shadow-sm">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-8 w-24 rounded-xl" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Contacts list ─────────────────────────────────────────────────────────────

export function SkeletonContactList({ count = 6 }: { count?: number }) {
  return (
    <div className="bg-card overflow-hidden rounded-[2.5rem] border shadow-sm">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 border-b p-4 last:border-b-0">
          <Skeleton className="mt-1 h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-48 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
          <Skeleton className="h-3 w-16 shrink-0 rounded" />
        </div>
      ))}
    </div>
  )
}

// ── Full page skeletons (usados en loading.tsx por ruta) ─────────────────────

export function SkeletonDashboardPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      {/* Stat cards */}
      <SkeletonStatCards count={4} />
      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SkeletonAnalyticsChart />
        </div>
        <div className="space-y-6">
          <SkeletonSmallCard />
          <SkeletonSmallCard />
        </div>
      </div>
      {/* More stat cards */}
      <SkeletonSmallCard />
    </div>
  )
}

export function SkeletonContactsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <SkeletonPageHeader />
        <Skeleton className="h-20 w-28 rounded-2xl" />
      </div>
      <SkeletonContactList count={6} />
    </div>
  )
}

export function SkeletonCategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonPageHeader />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>
      <SkeletonCategoryGrid count={6} />
    </div>
  )
}

export function SkeletonServicesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <SkeletonPageHeader />
      <SkeletonServiceList count={4} />
    </div>
  )
}

export function SkeletonTestimonialsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <SkeletonPageHeader />
      <div className="bg-card space-y-4 rounded-[2.5rem] border p-6 shadow-sm">
        <Skeleton className="h-5 w-40 rounded" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
      <SkeletonTestimonialList count={3} />
    </div>
  )
}

export function SkeletonTrashPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <SkeletonTrashGrid count={4} />
    </div>
  )
}

// ── Settings / form pages ─────────────────────────────────────────────────────

/** Para páginas tipo ajustes: about, home, profile, theme, account, settings, help */
export function SkeletonSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <SkeletonPageHeader />
      {[1, 2].map((i) => (
        <div key={i} className="bg-card space-y-4 rounded-[2.5rem] border p-6 shadow-sm">
          <Skeleton className="h-5 w-40 rounded" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Para formularios de creación/edición: new, [id]/edit */
export function SkeletonFormPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <SkeletonPageHeader />
      <div className="bg-card space-y-5 rounded-[2.5rem] border p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ── Analytics page ────────────────────────────────────────────────────────────

export function SkeletonAnalyticsPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <SkeletonStatCards count={4} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkeletonAnalyticsChart />
        <SkeletonAnalyticsChart />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SkeletonSmallCard />
        <SkeletonSmallCard />
        <SkeletonSmallCard />
      </div>
    </div>
  )
}

// ── Calendar page ─────────────────────────────────────────────────────────────

export function SkeletonCalendarPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-[2.5rem] border p-6 shadow-sm">
            <Skeleton className="mb-4 h-5 w-32 rounded" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card space-y-2 rounded-[2.5rem] border p-4 shadow-sm">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Gallery page ──────────────────────────────────────────────────────────────

export function SkeletonGalleryPage() {
  return (
    <div className="space-y-8">
      <SkeletonPageHeader />
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
