import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { FadeIn, StaggerChildren, ScrollProgress } from '@/components/ui'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; project: string }>
}): Promise<Metadata> {
  const { project: projectSlug } = await params
  const project = await prisma.project.findUnique({ where: { slug: projectSlug } })

  if (!project) {
    return { title: 'Proyecto no encontrado' }
  }

  return {
    title: project.metaTitle || `${project.title} | Portfolio PBN`,
    description: project.metaDescription || project.description.substring(0, 160),
    keywords: project.metaKeywords,
    alternates: {
      canonical: project.canonicalUrl || undefined,
    },
    openGraph: {
      title: project.metaTitle || project.title,
      description: project.metaDescription || project.description.substring(0, 160),
      images: project.thumbnailUrl ? [project.thumbnailUrl] : [],
      type: 'article',
      publishedTime: project.date.toISOString(),
      authors: ['Paola Bolívar Nievas'],
    },
  }
}

/**
 * Project Detail Page
 * Layout: Title/Description on top, Masonry Grid of images below
 */
import { getAdjacentProjects } from '@/actions/cms/projects'
import ProjectNavigation from '@/components/features/projects/ProjectNavigation'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ category: string; project: string }>
}) {
  const { category: categorySlug, project: projectSlug } = await params

  // 1. Fetch project with all images
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      category: { slug: categorySlug }, // Ensure it belongs to this category
      isActive: true,
      isDeleted: false,
    },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  // 2. Fetch adjacent projects for navigation
  // We need project.id to find adjacents and category.id
  let adjacentProjects: {
    previous: { title: string; slug: string; thumbnailUrl: string | null } | null
    next: { title: string; slug: string; thumbnailUrl: string | null } | null
  } = { previous: null, next: null }

  if (project) {
    adjacentProjects = await getAdjacentProjects(project.id, project.category.id)
  }

  if (!project) {
    notFound()
  }

  const formattedDate = new Date(project.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <section className="w-full bg-[var(--background)] transition-colors duration-500">
      <ScrollProgress />
      <AnalyticsTracker eventType="PROJECT_VIEW" entityId={project.id} entityType="Project" />
      <JsonLd
        type="CreativeWork"
        data={{
          name: project.title,
          description: project.description,
          image: project.thumbnailUrl,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/proyectos/${categorySlug}/${projectSlug}`,
          datePublished: project.date.toISOString(),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href={`/proyectos/${categorySlug}`}
            className="group inline-flex items-center gap-2 text-[var(--primary)] transition-colors hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--primary)] transition-all group-hover:-translate-x-1 group-hover:bg-[var(--primary)] group-hover:text-white">
              <ArrowLeft size={16} />
            </div>
            <span className="font-medium">Volver a {project.category.name}</span>
          </Link>
        </div>

        {/* Video Embed (if exists) */}
        {project.videoUrl && (
          <FadeIn className="relative mb-8 aspect-video overflow-hidden rounded-2xl bg-black">
            <iframe
              width="100%"
              height="100%"
              src={project.videoUrl.replace('watch?v=', 'embed/')}
              title={project.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          </FadeIn>
        )}

        {/* Header Content */}
        <FadeIn className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Title & Date */}
          <div className="border-border border-b pb-6 lg:col-span-1 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
            <h1 className="mb-4 font-[family-name:var(--font-heading)] text-4xl leading-tight font-bold text-[var(--foreground)] uppercase sm:text-5xl">
              {project.title}
            </h1>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[var(--text-body)] opacity-70">
                <Calendar size={18} />
                <span className="text-sm font-medium capitalize">{formattedDate}</span>
              </div>
              {project.client && (
                <div className="flex items-start gap-2 text-[var(--text-body)] opacity-80">
                  <span className="text-sm font-bold">Cliente:</span>
                  <span className="text-sm">{project.client}</span>
                </div>
              )}
              {project.location && (
                <div className="flex items-start gap-2 text-[var(--text-body)] opacity-80">
                  <span className="text-sm font-bold">Ubicación:</span>
                  <span className="text-sm">{project.location}</span>
                </div>
              )}
              {project.duration && (
                <div className="flex items-start gap-2 text-[var(--text-body)] opacity-80">
                  <span className="text-sm font-bold">Duración:</span>
                  <span className="text-sm">{project.duration}</span>
                </div>
              )}
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-muted/50 text-muted-foreground rounded px-2 py-1 text-xs tracking-wide uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            {project.excerpt && (
              <p className="text-foreground mb-6 text-xl leading-relaxed font-medium">
                {project.excerpt}
              </p>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none font-[family-name:var(--font-body)] text-[var(--text-body)]">
              <p>{project.description?.replace(project.excerpt || '', '')}</p>
            </div>
          </div>
        </FadeIn>

        {/* Gallery Grid */}
        <StaggerChildren className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-3">
          {/* Show specific images only - excluding thumbnail if needed, or just all images */}
          {project.images.map((image) => (
            <FadeIn key={image.id} className="break-inside-avoid">
              <div className="relative mb-4 overflow-hidden rounded-2xl bg-[var(--card-bg)] shadow-md transition-all hover:shadow-xl">
                <Image
                  src={image.url}
                  alt={`${project.title} - ${image.order}`}
                  width={800}
                  height={1000} // Approximate aspect ratio, standard styling handles it
                  className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={image.order === 0}
                />
              </div>
            </FadeIn>
          ))}

          {/* If no images, show placeholder or thumbnail larger */}
          {project.images.length === 0 && (
            <FadeIn className="break-inside-avoid">
              <div className="relative mb-4 overflow-hidden rounded-2xl bg-[var(--card-bg)] shadow-md">
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </FadeIn>
          )}
        </StaggerChildren>
      </div>

      {/* Circular Navigation */}
      <ProjectNavigation
        previous={adjacentProjects.previous}
        next={adjacentProjects.next}
        categorySlug={categorySlug}
        currentSlug={projectSlug}
      />
    </section>
  )
}
