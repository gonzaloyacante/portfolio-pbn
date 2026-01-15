import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'

/**
 * Página de Proyectos - Solo muestra CATEGORÍAS
 * El usuario hace click en una categoría para ver su galería
 */
export default async function ProjectsPage() {
  const categories = await prisma.category.findMany({
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
    orderBy: { name: 'asc' },
  })

  return (
    <section
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-12 lg:px-16 lg:py-16">
        {/* Grid de Categorías - mínimo 2 columnas */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {categories.map((category) => {
            const thumbnailUrl = category.projects[0]?.thumbnailUrl

            return (
              <Link
                key={category.id}
                href={`/proyectos/${category.slug}`}
                className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* Fondo */}
                {thumbnailUrl ? (
                  <>
                    <Image
                      src={thumbnailUrl}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  </>
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                )}

                {/* Nombre de categoría */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                  <h2
                    className="font-heading text-lg font-bold sm:text-xl lg:text-2xl"
                    style={{
                      color: thumbnailUrl ? '#ffffff' : 'var(--color-text)',
                    }}
                  >
                    {category.name}
                  </h2>
                  {category._count.projects > 0 && (
                    <p className="mt-1 text-xs opacity-80 sm:text-sm" style={{ color: '#ffffff' }}>
                      {category._count.projects} proyecto{category._count.projects > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mensaje si no hay categorías */}
        {categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-4 text-6xl">🎨</span>
            <p
              className="font-script mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--color-accent)' }}
            >
              Próximamente...
            </p>
            <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>
              Estamos preparando proyectos increíbles para ti
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
