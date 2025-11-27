import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ProjectEditForm from '@/components/admin/ProjectEditForm'
import Link from 'next/link'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
    },
  })

  if (!project) {
    notFound()
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/gestion/projects"
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Editar Proyecto</h1>
        </div>
        <div className="text-sm text-gray-500">ID: {project.id}</div>
      </div>

      <ProjectEditForm project={project} categories={categories} />
    </div>
  )
}
