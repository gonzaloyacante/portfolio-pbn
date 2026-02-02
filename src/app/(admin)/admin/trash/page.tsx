import { prisma } from '@/lib/db'
import { Button, PageHeader, EmptyState } from '@/components/ui'
import { Section } from '@/components/admin'
import Image from 'next/image'
import { restoreProject, permanentlyDeleteProject } from '@/actions/projects.actions'

export default async function PapeleraPage() {
  const deletedProjects = await prisma.project.findMany({
    where: { isDeleted: true },
    include: { category: true, images: { take: 1 } },
    orderBy: { deletedAt: 'desc' },
  })

  // Usar una fecha de referencia estable para el renderizado
  const now = new Date()

  // Calcular días restantes para cada proyecto
  const projectsWithDays = deletedProjects.map((project) => {
    const deletedAt = project.deletedAt || now
    const daysElapsed = Math.floor((now.getTime() - deletedAt.getTime()) / (1000 * 60 * 60 * 24))
    const daysRemaining = Math.max(0, 30 - daysElapsed)
    return { ...project, daysRemaining }
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="🗑️ Papelera"
        description="Proyectos eliminados. Se borran permanentemente después de 30 días."
      />

      {projectsWithDays.length === 0 ? (
        <EmptyState
          icon="🗑️"
          title="Papelera vacía"
          description="No hay proyectos eliminados. Los proyectos que elimines aparecerán aquí durante 30 días antes de borrarse permanentemente."
        />
      ) : (
        <Section>
          <div className="space-y-4">
            {projectsWithDays.map((project) => (
              <div
                key={project.id}
                className="border-border bg-card hover:bg-muted/50 flex items-center gap-4 rounded-xl border p-4 transition-colors"
              >
                {/* Thumbnail */}
                <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  {project.images[0]?.url ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">
                      🎨
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-foreground font-semibold">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {project.category?.name || 'Sin categoría'}
                  </p>
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    ⏰ Se eliminará en {project.daysRemaining} días
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <form
                    action={async () => {
                      'use server'
                      await restoreProject(project.id)
                    }}
                  >
                    <Button type="submit" variant="secondary" size="sm">
                      ♻️ Restaurar
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      'use server'
                      await permanentlyDeleteProject(project.id)
                    }}
                  >
                    <Button type="submit" variant="destructive" size="sm">
                      🗑️ Eliminar
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="rounded-2xl border-l-4 border-yellow-400 bg-yellow-50 p-6 dark:bg-yellow-900/10">
        <p className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
          <span className="text-xl">⚠️</span>
          <span>
            <strong>Importante:</strong> Una vez eliminado permanentemente, el proyecto y sus
            imágenes no podrán recuperarse.
          </span>
        </p>
      </div>
    </div>
  )
}
