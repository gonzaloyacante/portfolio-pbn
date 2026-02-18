import { getFeaturedProjects } from '@/actions/cms/projects'
import Link from 'next/link'
import { FadeIn, StaggerChildren, OptimizedImage } from '@/components/ui'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/config/routes'

interface FeaturedProjectsProps {
  title?: string | null
  count?: number
}

export default async function FeaturedProjects({ title, count = 6 }: FeaturedProjectsProps) {
  const projects = await getFeaturedProjects(count)

  if (projects.length === 0) return null

  return (
    <section className="bg-(--background) py-16 transition-colors duration-500 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xl">
            <h2 className="font-heading text-3xl font-bold text-(--foreground) sm:text-4xl lg:text-5xl">
              {title || 'Proyectos Destacados'}
            </h2>
          </div>
          <Link
            href={ROUTES.public.projects}
            className="group flex items-center gap-2 text-(--primary) transition-colors hover:text-(--accent)"
          >
            <span className="font-medium">Ver todo el portfolio</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Projects Grid */}
        <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <FadeIn key={project.id}>
              <Link
                href={`/proyectos/${project.category.slug}/${project.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-(--card-bg) shadow-lg transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Image */}
                {project.thumbnailUrl ? (
                  <OptimizedImage
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    variant="card"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-(--card-bg)">
                    <span className="text-4xl text-(--foreground) opacity-20">📷</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="mb-2 block text-xs font-bold tracking-wider text-white/80 uppercase">
                    {project.category.name}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
                    {project.title}
                  </h3>
                </div>
              </Link>
            </FadeIn>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
