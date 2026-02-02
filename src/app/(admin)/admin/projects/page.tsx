import { prisma } from '@/lib/db'
import { deleteProject } from '@/actions/content.actions'
import { getProjectSettings, updateProjectSettings } from '@/actions/project-settings.actions'
import { Button, Card, Badge, PageHeader } from '@/components/ui'
import VisualConfigModal from '@/components/admin/shared/VisualConfigModal'
import { Section } from '@/components/admin'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProjectsManagementPage() {
  const [projects, settings] = await Promise.all([
    prisma.project.findMany({
      where: { isDeleted: false },
      include: { category: true, images: { take: 1, orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    }),
    getProjectSettings(),
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <PageHeader
        title="🎨 Gestión de Proyectos"
        description="Crea, edita y organiza tus proyectos de portfolio"
      />

      {/* Acciones: Crear y Configuar */}
      <div className="flex flex-wrap justify-end gap-4">
        <VisualConfigModal
          initialSettings={settings}
          onSave={updateProjectSettings}
          title="Configurar Tarjetas de Proyecto"
          description="Personaliza cómo se ven los proyectos en las galerías."
          previewVariant="project"
          triggerLabel="Config. Visual"
          fields={[
            {
              key: 'showCardTitles',
              label: 'Mostrar Títulos',
              description: 'Ocultar para ver solo la imagen.',
            },
            {
              key: 'showCardCategory',
              label: 'Mostrar Categoría',
              description: 'Etiqueta sobre la imagen.',
            },
          ]}
        />

        <Link href="/admin/proyectos/new">
          <Button size="lg" className="shadow-lg transition-transform hover:scale-105">
            ✨ Crear Nuevo Proyecto
          </Button>
        </Link>
      </div>

      {/* Lista de proyectos */}
      <Section title={`Proyectos (${projects.length})`}>
        {projects.length === 0 ? (
          <Card>
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <span className="mb-4 text-4xl">✨</span>
              <p className="font-medium">No hay proyectos.</p>
              <p className="text-sm">¡Crea el primero arriba!</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group border-border bg-card hover:border-primary overflow-hidden border-2 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Thumbnail */}
                <div className="bg-muted relative aspect-video w-full overflow-hidden">
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  {/* Overlay con estado */}
                  <div className="absolute top-2 right-2">
                    <Badge variant={project.isActive ? 'success' : 'default'} className="shadow-sm">
                      {project.isActive ? 'Activo' : 'Oculto'}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="text-foreground truncate font-bold">{project.title}</h3>
                    <p className="text-primary text-xs font-medium tracking-wider uppercase">
                      {project.category.name}
                    </p>
                  </div>

                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <span>🖼️ {project.images.length} fotos</span>
                    <span>•</span>
                    <span>📅 {new Date(project.date).toLocaleDateString('es-ES')}</span>
                  </p>

                  {/* Actions */}
                  <div className="border-border mt-4 flex gap-2 border-t pt-2">
                    <Link
                      href={`/projects/${project.category.slug}/${project.slug}`}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button variant="secondary" size="sm" className="w-full justify-center">
                        👀 Ver
                      </Button>
                    </Link>
                    <Link href={`/admin/proyectos/${project.id}/editar`} className="flex-1">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground w-full justify-center"
                      >
                        ✏️ Editar
                      </Button>
                    </Link>
                    <form
                      action={async () => {
                        'use server'
                        await deleteProject(project.id)
                      }}
                    >
                      <Button type="submit" variant="destructive" size="sm" className="px-3">
                        🗑️
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
