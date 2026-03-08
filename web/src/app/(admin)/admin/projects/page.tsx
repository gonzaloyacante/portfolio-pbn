import { prisma } from '@/lib/db'
import { getProjectSettings, updateProjectSettings } from '@/actions/settings/projects'
import { Button } from '@/components/ui'
import { PageHeader, Section } from '@/components/layout'
import LazyVisualConfigModal from '@/components/features/projects/LazyVisualConfigModal'
import Link from 'next/link'
import ProjectsContent from './ProjectsContent'
import { ROUTES } from '@/config/routes'

export default async function ProjectsManagementPage() {
  const [projects, categories, settings] = await Promise.all([
    prisma.project.findMany({
      where: { isDeleted: false },
      include: {
        category: true,
        images: { take: 1, orderBy: { order: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' }, // Prioritize manual order
    }),
    prisma.category.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    getProjectSettings(),
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="🎨 Gestión de Proyectos"
        description="Crea, edita y organiza tus proyectos de portfolio"
      />

      {/* Acciones: Crear y Configura */}
      <div className="flex flex-wrap justify-end gap-4">
        <LazyVisualConfigModal
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

        <Link href={ROUTES.admin.newProject}>
          <Button size="lg" className="shadow-lg transition-transform hover:scale-105">
            ✨ Crear Nuevo Proyecto
          </Button>
        </Link>
      </div>

      <Section title={`Proyectos (${projects.length})`}>
        <ProjectsContent projects={projects} categories={categories} />
      </Section>
    </div>
  )
}
