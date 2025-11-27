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
      className="group bg-pink-hot dark:bg-pink-hot/90 relative block aspect-4/3 overflow-hidden rounded-4xl shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative h-full w-full">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Title & Category */}
      <div className="absolute bottom-4 left-4 z-10">
        {categoryName && (
          <p className="font-primary text-pink-light mb-1 text-xs font-medium tracking-wide uppercase opacity-90">
            {categoryName}
          </p>
        )}
        <h3 className="font-primary text-wine dark:text-pink-light text-xl font-bold drop-shadow-lg md:text-2xl">
          {title}
        </h3>
      </div>
    </Link>
  )
}
