import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ProjectGallery from '@/components/public/ProjectGallery'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    }
  }

  return {
    title: `${category.name} | Portfolio PBN`,
    description: category.description || `Explora nuestros proyectos de ${category.name}`,
    openGraph: {
      title: category.name,
      description: category.description || `Proyectos de ${category.name}`,
      type: 'website',
    },
  }
}

export default async function CategoryProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      projects: {
        where: { isDeleted: false },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-12">
      <AnalyticsTracker eventType="CATEGORY_VIEW" entityId={category.id} entityType="Category" />

      <div className="mb-12 text-center">
        <h1 className="font-script text-primary mb-4 text-4xl md:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="font-primary mx-auto max-w-2xl text-gray-600">{category.description}</p>
        )}
      </div>

      {category.projects.length > 0 ? (
        <ProjectGallery projects={category.projects} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-500">No hay proyectos en esta categoría aún.</p>
        </div>
      )}
    </div>
  )
}
