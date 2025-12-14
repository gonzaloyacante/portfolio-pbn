import Link from 'next/link'

interface StatCardProps {
  label: string
  value: number | string
  icon: string
  href: string
}

/**
 * Tarjeta de estadística para el dashboard
 */
export default function StatCard({ label, value, icon, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-4xl">{icon}</span>
        <span className="text-primary text-3xl font-bold">{value}</span>
      </div>
      <h3 className="font-medium text-gray-600 dark:text-gray-300">{label}</h3>
    </Link>
  )
}
