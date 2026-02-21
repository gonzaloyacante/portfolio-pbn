import { Section } from '@/components/layout'

interface Project {
  title: string
  count: number
}

interface TopProjectsProps {
  projects: Project[]
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function TopProjects({ projects }: TopProjectsProps) {
  return (
    <Section title="⭐ Top Proyectos">
      {projects.length > 0 ? (
        <div className="space-y-2">
          {projects.slice(0, 5).map((project, idx) => (
            <div
              key={idx}
              className="bg-card border-border flex items-center justify-between rounded-xl border p-3 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{MEDALS[idx] ?? `${idx + 1}.`}</span>
                <span className="text-foreground text-sm font-bold">
                  {project.title.length > 20 ? project.title.slice(0, 20) + '…' : project.title}
                </span>
              </div>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-bold">
                {project.count}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <span className="text-4xl">⭐</span>
          <p className="text-muted-foreground mt-2 text-sm">Sin proyectos vistos aún</p>
        </div>
      )}
    </Section>
  )
}
