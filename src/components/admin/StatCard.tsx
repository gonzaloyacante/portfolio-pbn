import Link from 'next/link'

interface StatCardProps {
  label: string
  value: number | string
  icon: string
  href?: string
  subtitle?: string
}

/**
 * Tarjeta de estadística para el dashboard
 */
export default function StatCard({ label, value, icon, href, subtitle }: StatCardProps) {
  const content = (
    <div className="group border-wine/10 ring-wine/5 dark:border-pink-light/10 dark:bg-purple-dark/20 dark:ring-pink-light/5 relative overflow-hidden rounded-2xl border bg-white/50 p-6 shadow-sm ring-1 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-4xl transition-transform group-hover:scale-110">{icon}</span>
        <span className="text-pink-hot text-3xl font-bold">{value}</span>
      </div>
      <h3 className="text-wine dark:text-pink-light font-bold">{label}</h3>
      {subtitle && <p className="text-wine/60 dark:text-pink-light/60 mt-1 text-xs">{subtitle}</p>}

      {/* Decorative gradient blob */}
      <div className="bg-pink-hot/5 dark:bg-pink-hot/10 pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-xl transition-opacity group-hover:opacity-100"></div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}
