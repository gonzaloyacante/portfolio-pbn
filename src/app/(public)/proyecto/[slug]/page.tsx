import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { generateProjectMetadata, generateProjectJsonLd } from '@/lib/seo'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug, isDeleted: false },
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      category: true,
    },
  })

  if (!project) {
    return { title: 'Proyecto no encontrado' }
  }

  return generateProjectMetadata({ project })
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { isDeleted: false },
    orderBy: { date: 'desc' },
    take: 20,
    select: { slug: true },
  })

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug, isDeleted: false },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      category: true,
    },
  })

  if (!project) {
    notFound()
  }

  // Generate Structured Data (JSON-LD)
  const jsonLd = generateProjectJsonLd(project)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto min-h-screen px-4 py-12">
        <AnalyticsTracker eventType="PROJECT_VIEW" entityId={project.id} entityType="Project" />

        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-primary mb-2 text-4xl font-bold">{project.title}</h1>
            <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
              <span>{project.category.name}</span>
              <span>•</span>
              <span>{new Date(project.date).toLocaleDateString()}</span>
            </div>
            {project.description && (
              <p className="leading-relaxed text-gray-700">{project.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {project.images.map((img) => (
              <div
                key={img.id}
                className="relative overflow-hidden rounded-xl bg-gray-100 shadow-lg"
              >
                <Image
                  src={img.url}
                  alt={`${project.title} - ${img.order}`}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-contain"
                  priority={img.order === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
