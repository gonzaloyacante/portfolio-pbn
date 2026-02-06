import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn, StaggerChildren } from '@/components/ui'
import { getCategorySettings } from '@/actions/settings/categories'

export const metadata = {
  title: 'Proyectos | Portfolio Paola Bolívar Nievas',
  description: 'Explora mis trabajos de maquillaje social, caracterización, FX y más.',
}

/**
 * Projects Page - Category Grid
 * Design: Grid 1x 2x 4x for 4 items balance.
 */
export default async function ProjectsPage() {
  const [categories, categorySettings] = await Promise.all([
    prisma.category.findMany({
      where: {
        projects: {
          some: { isActive: true, isDeleted: false },
        },
      },
      include: {
        projects: {
          where: { isActive: true, isDeleted: false },
          take: 1,
          orderBy: { date: 'desc' },
          select: { thumbnailUrl: true },
        },
        _count: {
          select: {
            projects: { where: { isActive: true, isDeleted: false } },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    }),
    getCategorySettings(),
  ])

  const gridCols = categorySettings?.gridColumns ?? 4
  const showCount = categorySettings?.showProjectCount ?? false
  const showDesc = categorySettings?.showDescription ?? false

  // Default to showing everything if settings not yet created
  // const showTitles = settings?.showCardTitles ?? true
  // const showCategory = settings?.showCardCategory ?? true // Not used in Category list, but good context

  return (
    <section className="w-full bg-[var(--background)] transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-16 lg:py-20">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <h1 className="mb-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[var(--foreground)] uppercase sm:text-5xl lg:text-6xl">
            Portfolio
          </h1>
          <p className="max-w-xl font-[family-name:var(--font-body)] text-lg text-[var(--text-body)] lg:mx-0">
            Una selección de mis mejores trabajos organizados por categoría.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <StaggerChildren
            className={`grid gap-6 lg:gap-8 ${gridCols === 1 ? 'grid-cols-1' : ''} ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : ''} ${gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''} ${gridCols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : ''} `}
          >
            {categories.map((category) => {
              // Priority: Custom Cover > First Project Thumbnail
              const thumbnailUrl = category.coverImageUrl || category.projects[0]?.thumbnailUrl

              return (
                <FadeIn key={category.id}>
                  <Link
                    href={`/proyectos/${category.slug}`}
                    className="group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[2.5rem] bg-[var(--card-bg)] shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    {/* Background Image */}
                    {thumbnailUrl ? (
                      <>
                        <Image
                          src={thumbnailUrl}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          priority={category.sortOrder <= 4}
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--card-bg)]">
                        <span className="text-6xl opacity-20">📷</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <h2 className="translate-y-2 font-[family-name:var(--font-heading)] text-2xl font-bold text-white transition-transform duration-300 group-hover:translate-y-0 sm:text-3xl">
                        {category.name}
                      </h2>

                      {/* Description - Conditional */}
                      {showDesc && category.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-white/80">
                          {category.description}
                        </p>
                      )}

                      {/* Count - Conditional */}
                      {showCount && (
                        <p className="mt-2 text-xs text-white/60">
                          {category._count.projects} proyecto
                          {category._count.projects !== 1 ? 's' : ''}
                        </p>
                      )}

                      <div className="mt-2 h-1 w-12 rounded-full bg-white/50 transition-all group-hover:w-20 group-hover:bg-white" />
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </StaggerChildren>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[3rem] bg-[var(--card-bg)] py-24 text-center">
            <span className="mb-4 text-6xl">🎨</span>
            <h3 className="mb-2 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
              Próximamente
            </h3>
            <p className="text-[var(--text-body)]">
              Estamos preparando proyectos increíbles para mostrarte.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
