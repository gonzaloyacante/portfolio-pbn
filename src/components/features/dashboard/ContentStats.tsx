import { StatCard } from '@/components/ui'

interface ContentStat {
  label: string
  value: number
  icon: string
  href: string
  highlight?: boolean
}

interface ContentStatsProps {
  stats: ContentStat[]
}

export default function ContentStats({ stats }: ContentStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
