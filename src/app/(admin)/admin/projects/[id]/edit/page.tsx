import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageHeader, Section } from '@/components/layout'
import ProjectEditForm from '@/components/features/projects/ProjectEditForm'

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params

  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <PageHeader
        title="✏️ Editar Proyecto"
        description={`Editando: ${project.title}`}
        backUrl="/admin/projects"
      />

      <Section title="Detalles del Proyecto">
        <ProjectEditForm project={project} categories={categories} />
      </Section>
    </div>
  )
}
