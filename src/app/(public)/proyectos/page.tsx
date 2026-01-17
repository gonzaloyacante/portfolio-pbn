import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn, StaggerChildren } from '@/components/ui/Animations'

export const metadata = {
  title: 'Proyectos | Portfolio Paola Bolívar Nievas',
  description: 'Explora mis trabajos de maquillaje social, caracterización, FX y más.',
}

/**
 * Projects Page - Category Grid
 * Design: 3x2 Grid, extreme rounded corners, pink/card background.
 */
export default async function ProjectsPage() {
  const categories = await prisma.category.findMany({
    where: {
      projects: {
        some: { isActive: true, isDeleted: false }
      }
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
  })

  return (
    <section className="min-h-screen w-full bg-[var(--background)] transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-16 lg:py-20">

        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <h1 className="mb-4 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Portfolio
          </h1>
          <p className="max-w-xl font-[family-name:var(--font-body)] text-lg text-[var(--text-body)] lg:mx-0">
            Una selección de mis mejores trabajos organizados por categoría.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {categories.map((category) => {
              const thumbnailUrl = category.projects[0]?.thumbnailUrl

              return (
                <FadeIn key={category.id}>
                  <Link
                    href={`/proyectos/${category.slug}`}
                    className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[2.5rem] bg-[var(--card-bg)] shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    {/* Background Image */}
                    {thumbnailUrl ? (
                      <>
                        <Image
                          src={thumbnailUrl}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={category.sortOrder <= 3}
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
                      <div className="mt-2 flex items-center justify-between border-t border-white/30 pt-3 text-sm text-white/90 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <span>{category._count.projects} proyectos</span>
                        <span className="font-medium">Ver galería &rarr;</span>
                      </div>
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
