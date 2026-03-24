import { prisma } from '@/lib/db'
import { Button, EmptyState } from '@/components/ui'
import { Section, PageHeader } from '@/components/layout'
import Image from 'next/image'
import { restoreProject, permanentlyDeleteProject } from '@/actions/cms/content'
import { requireAdmin } from '@/lib/security-server'

export const dynamic = 'force-dynamic'

export default async function PapeleraPage() {
  await requireAdmin()
  const deletedProjects = await prisma.project.findMany({
    where: { deletedAt: { not: null } },
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projectsWithDays.map((project) => (
              <div
                key={project.id}
                className="border-border bg-card hover:bg-muted/50 flex flex-col items-start gap-4 rounded-xl border p-6 transition-colors md:flex-row"
              >
                {/* Thumbnail */}
                <div className="bg-muted relative h-28 w-full flex-shrink-0 overflow-hidden rounded-lg md:w-32">
                  {project.images[0]?.url ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">
                      🎨
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="w-full flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-foreground truncate text-lg font-semibold">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mt-1 truncate text-sm">
                        {project.category?.name || 'Sin categoría'} • {project.images?.length ?? 0}{' '}
                        imagen(es)
                      </p>
                      <p className="text-foreground/80 mt-3 line-clamp-3 text-sm">
                        {project.excerpt || project.description || '— Sin descripción —'}
                      </p>
                    </div>

                    <div className="hidden flex-col items-end gap-2 md:flex">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        ⏰ Se eliminará en {project.daysRemaining} días
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {project.deletedAt ? new Date(project.deletedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions (mobile stacked) */}
                  <div className="mt-4 flex gap-2 md:gap-3">
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
                    <div className="ml-auto text-xs text-red-600 md:hidden dark:text-red-400">
                      ⏰ {project.daysRemaining} días
                    </div>
                  </div>
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
