import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { FadeIn, StaggerChildren } from '@/components/ui'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>
}): Promise<Metadata> {
  const { projectSlug } = await params
  const project = await prisma.project.findUnique({ where: { slug: projectSlug } })

  if (!project) {
    return { title: 'Proyecto no encontrado' }
  }

  return {
    title: `${project.title} | Portfolio PBN`,
    description: project.description.substring(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 160),
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
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>
}) {
  const { slug, projectSlug } = await params

  // Fetch project with all images
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      category: { slug }, // Ensure it belongs to this category
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

  if (!project) {
    notFound()
  }

  // Combine thumbnail and additional images for the gallery
  // If thumbnail is not in images list (usually it is separate), render it first
  // But standard practice: show all images. Let's assume images relation contains all gallery images.
  // If thumbnail is just a string URL and not in images table, we might want to include it.
  // Usually `images` are the gallery. `thumbnailUrl` is for the card.
  // Let's check if we want to show thumbnail as the "Hero" image.

  const formattedDate = new Date(project.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <section className="min-h-screen w-full bg-[var(--background)] transition-colors duration-500">
      <AnalyticsTracker eventType="PROJECT_VIEW" entityId={project.id} entityType="Project" />
      <JsonLd
        type="CreativeWork"
        data={{
          name: project.title,
          description: project.description,
          image: project.thumbnailUrl,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/proyectos/${slug}/${projectSlug}`,
          datePublished: project.date.toISOString(),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href={`/proyectos/${slug}`}
            className="group inline-flex items-center gap-2 text-[var(--primary)] transition-colors hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--primary)] transition-all group-hover:-translate-x-1 group-hover:bg-[var(--primary)] group-hover:text-white">
              <ArrowLeft size={16} />
            </div>
            <span className="font-medium">Volver a {project.category.name}</span>
          </Link>
        </div>

        {/* Header Content */}
        <FadeIn className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Title & Date */}
          <div className="lg:col-span-1">
            <h1 className="mb-4 font-[family-name:var(--font-heading)] text-4xl leading-tight font-bold text-[var(--foreground)] uppercase sm:text-5xl">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 text-[var(--text-body)] opacity-70">
              <Calendar size={18} />
              <span className="text-sm font-medium capitalize">{formattedDate}</span>
            </div>
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg dark:prose-invert max-w-none font-[family-name:var(--font-body)] text-[var(--text-body)]">
              <p>{project.description}</p>
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
    </section>
  )
}
