import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
    return { title: 'Categoría no encontrada' }
  }

  return {
    title: `${category.name} | Portfolio PBN`,
    description: category.description || `Explora nuestros proyectos de ${category.name}`,
  }
}

/**
 * Página de Galería de Categoría
 * Muestra TODAS las imágenes de TODOS los proyectos mezcladas
 */
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
        where: {
          isDeleted: false,
          isActive: true,
        },
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

  // Recopilar TODAS las imágenes de todos los proyectos
  const allImages: Array<{
    id: string
    url: string
    projectTitle: string
    projectSlug: string
  }> = []

  for (const project of category.projects) {
    // Agregar thumbnail primero
    allImages.push({
      id: `${project.id}-thumb`,
      url: project.thumbnailUrl,
      projectTitle: project.title,
      projectSlug: project.slug,
    })

    // Agregar resto de imágenes
    for (const image of project.images) {
      if (image.url !== project.thumbnailUrl) {
        allImages.push({
          id: image.id,
          url: image.url,
          projectTitle: project.title,
          projectSlug: project.slug,
        })
      }
    }
  }

  return (
    <section
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <AnalyticsTracker eventType="CATEGORY_VIEW" entityId={category.id} entityType="Category" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Header con botón volver */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:mb-10 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/proyectos"
            className="group flex cursor-pointer items-center gap-2 transition-all duration-200 hover:opacity-70"
            style={{ color: 'var(--color-primary)' }}
          >
            <span className="text-xl transition-transform group-hover:-translate-x-1">◀</span>
            <span className="font-heading text-sm font-bold tracking-wide uppercase">
              Volver a proyectos
            </span>
          </Link>

          <h1
            className="font-heading text-2xl font-bold sm:text-3xl"
            style={{ color: 'var(--color-text)' }}
          >
            {category.name}
          </h1>
        </div>

        {/* Galería grid con aspect-ratio fijo para evitar saltos */}
        {allImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {allImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-3/4 cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Image
                  src={image.url}
                  alt={image.projectTitle}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />

                {/* Overlay con título */}
                <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="p-3 text-sm font-medium text-white sm:p-4">{image.projectTitle}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p
              className="font-script mb-4"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                color: 'var(--color-accent)',
              }}
            >
              Próximamente...
            </p>
            <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>
              No hay proyectos en esta categoría todavía.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
