import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { FadeIn, StaggerChildren } from '@/components/ui/Animations'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      projects: {
        where: { isDeleted: false, isActive: true },
        take: 1,
        orderBy: { date: 'desc' },
        select: { thumbnailUrl: true },
      },
    },
  })

  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  return {
    title: `${category.name} | Portfolio PBN`,
    description: category.description || `Explora nuestros proyectos de ${category.name}`,
    openGraph: {
      title: category.name,
      description: category.description || `Galería de ${category.name}`,
      images: category.projects[0]?.thumbnailUrl ? [category.projects[0].thumbnailUrl] : [],
    },
  }
}

/**
 * Category Detail Page
 * Design: 4-column masonry-style grid (consistent aspect ratios)
 * Interaction: Click to open Project Detail
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
        where: { isDeleted: false, isActive: true },
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <section className="min-h-screen w-full bg-[var(--background)] transition-colors duration-500">
      <AnalyticsTracker eventType="CATEGORY_VIEW" entityId={category.id} entityType="Category" />
      <JsonLd
        type="CollectionPage"
        data={{
          name: category.name,
          description: category.description || `Galería de ${category.name}`,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/proyectos/${category.slug}`,
          mainEntity: category.projects.map((p) => ({
            name: p.title,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/proyectos/${category.slug}/${p.slug}`,
            image: p.thumbnailUrl,
          })),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start gap-6 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/proyectos"
              className="group flex items-center gap-2 text-[var(--primary)] transition-colors hover:opacity-70"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--primary)] transition-all group-hover:-translate-x-1 group-hover:bg-[var(--primary)] group-hover:text-white">
                <ArrowLeft size={20} />
              </div>
            </Link>

            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              {category.name}
            </h1>
          </div>

          <p className="max-w-md text-sm text-[var(--text-body)] opacity-80 sm:text-right">
            {category.description || `Explora la galería de ${category.name}`}
          </p>
        </div>

        {/* Project Grid - 4 Columns */}
        {category.projects.length > 0 ? (
          <StaggerChildren className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {category.projects.map((project, index) => (
              <FadeIn key={project.id}>
                <Link
                  href={`/proyectos/${category.slug}/${project.slug}`}
                  className="group relative block aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-[var(--card-bg)] shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 4}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Hover Content */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="line-clamp-2 font-[family-name:var(--font-heading)] text-lg leading-tight font-bold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/80">Ver proyecto &rarr;</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </StaggerChildren>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <span className="mb-4 text-4xl">📁</span>
            <p className="text-lg text-[var(--text-body)]">
              No hay proyectos disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
