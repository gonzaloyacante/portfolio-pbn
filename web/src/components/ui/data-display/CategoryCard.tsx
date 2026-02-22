'use client'

import Link from 'next/link'

interface CategoryCardProps {
  name: string
  slug: string
  count?: number
}

/**
 * CategoryCard - Canva Spec
 * - Fondo: var(--card-bg) (#ffaadd)
 * - Bordes: rounded-[2.5rem]
 * - Hover: Scale suave
 */
export default function CategoryCard({ name, slug, count = 0 }: CategoryCardProps) {
  return (
    <Link
      href={`/proyectos/${slug}`}
      className="group relative flex aspect-square flex-col items-center justify-center rounded-[2.5rem] bg-(--card-bg) p-8 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <h3 className="font-heading text-lg font-bold text-(--foreground) sm:text-xl md:text-2xl">
        {name}
      </h3>

      {count > 0 && (
        <p className="font-body mt-2 text-sm text-(--foreground)/70">
          {count} {count === 1 ? 'proyecto' : 'proyectos'}
        </p>
      )}
    </Link>
  )
}
