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
    <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-4xl">{icon}</span>
        <span className="text-primary text-3xl font-bold">{value}</span>
      </div>
      <h3 className="font-medium text-gray-700 dark:text-gray-300">{label}</h3>
      {subtitle && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
