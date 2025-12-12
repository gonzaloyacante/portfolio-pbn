import Link from 'next/link'

interface CategoryCardProps {
  category: {
    name: string
    slug: string
    description?: string | null
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/proyectos/${category.slug}`}
      className="group bg-btn-back-bg flex aspect-square flex-col items-center justify-center rounded-4xl p-8 text-center shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
    >
      <h3 className="font-primary text-category-title text-2xl font-bold">{category.name}</h3>
      {category.description && (
        <p className="text-btn-back-text/80 mt-3 line-clamp-3 text-sm">{category.description}</p>
      )}

      {/* Decorative element */}
      <div className="mt-4 text-3xl opacity-50 transition-opacity group-hover:opacity-100">✨</div>
    </Link>
  )
}
