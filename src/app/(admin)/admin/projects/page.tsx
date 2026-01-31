import { prisma } from '@/lib/db'
import { deleteProject } from '@/actions/content.actions'
import { Button, Card, Badge, PageHeader } from '@/components/ui'
import { Section } from '@/components/admin'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProjectsManagementPage() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      where: { isDeleted: false },
      include: { category: true, images: { take: 1, orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <PageHeader
        title="🎨 Gestión de Proyectos"
        description="Crea, edita y organiza tus proyectos de portfolio"
      />

      {/* Crear nuevo proyecto */}
      <div className="flex justify-end">
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
            <div className="text-wine/60 dark:text-pink-light/60 flex flex-col items-center justify-center py-12 text-center">
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
                className="group border-wine/5 hover:border-pink-hot/30 dark:border-pink-light/5 dark:hover:border-pink-hot/30 overflow-hidden border-2 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Thumbnail */}
                <div className="bg-pink-light/20 dark:bg-purple-dark/40 relative aspect-video w-full overflow-hidden">
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="text-wine/20 dark:text-pink-light/20 flex h-full items-center justify-center">
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
                    <h3 className="text-wine dark:text-pink-light truncate font-bold">
                      {project.title}
                    </h3>
                    <p className="text-pink-hot text-xs font-medium tracking-wider uppercase">
                      {project.category.name}
                    </p>
                  </div>

                  <p className="text-wine/50 dark:text-pink-light/50 flex items-center gap-1 text-xs">
                    <span>🖼️ {project.images.length} fotos</span>
                    <span>•</span>
                    <span>📅 {new Date(project.date).toLocaleDateString('es-ES')}</span>
                  </p>

                  {/* Actions */}
                  <div className="border-wine/5 dark:border-pink-light/5 mt-4 flex gap-2 border-t pt-2">
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
                        className="bg-wine hover:bg-wine/90 dark:bg-pink-hot w-full justify-center text-white dark:text-white"
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

      {/* Gestión de Categorías */}
      <Section title="📁 Categorías">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              className="bg-wine/5 text-wine hover:bg-wine/10 dark:bg-pink-light/10 dark:text-pink-light"
            >
              {cat.name}
            </Badge>
          ))}
          {categories.length === 0 && (
            <p className="text-wine/60 dark:text-pink-light/60">No hay categorías creadas.</p>
          )}
        </div>
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <span>💡</span>
            Para gestionar categorías, contacta al desarrollador o usa la base de datos
            directamente.
          </p>
        </div>
      </Section>
    </div>
  )
}
