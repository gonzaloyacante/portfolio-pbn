import Image from 'next/image'
import Link from 'next/link'

interface ProjectCardProps {
  title: string
  slug: string
  thumbnailUrl: string
  categoryName?: string
}

export default function ProjectCard({ title, slug, thumbnailUrl, categoryName }: ProjectCardProps) {
  return (
    <Link
      href={`/proyectos/${slug}`}
      className="group bg-btn-back-bg relative block aspect-square overflow-hidden rounded-3xl transition-all hover:scale-105"
    >
      {/* Image */}
      <div className="relative h-full w-full opacity-90 transition-opacity group-hover:opacity-100">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2ZmYWFkZCIvPjwvc3ZnPg=="
        />

        {/* Subtle gradient for text readability if needed, but keeping it clean */}
        <div className="from-btn-back-bg/80 absolute inset-0 bg-linear-to-t via-transparent to-transparent opacity-60" />
      </div>

      {/* Title & Category */}
      <div className="absolute bottom-3 left-3 z-10 pr-2">
        {categoryName && (
          <p className="font-primary text-btn-back-text mb-0.5 text-[10px] font-bold tracking-wider uppercase opacity-80">
            {categoryName}
          </p>
        )}
        <h3 className="font-primary text-btn-back-text text-sm leading-tight font-bold md:text-lg">
          {title}
        </h3>
      </div>
    </Link>
  )
}
