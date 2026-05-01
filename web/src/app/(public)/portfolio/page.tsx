import { prisma } from '@/lib/db'
import { clsx } from 'clsx'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { OptimizedImage, FadeIn, StaggerChildren } from '@/components/ui'
import { getCategorySettings } from '@/actions/settings/categories'
import { ROUTES } from '@/config/routes'
import type { Metadata } from 'next'

// ISR: revalidar cada 60s + on-demand via revalidatePath()
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Portfolio | Portfolio Paola Bolívar Nievas',
  description: 'Explora mis trabajos de maquillaje social, caracterización, FX y más.',
  alternates: {
    canonical: ROUTES.public.portfolio,
  },
  openGraph: {
    title: 'Portfolio | Portfolio Paola Bolívar Nievas',
    description: 'Explora mis trabajos de maquillaje social, caracterización, FX y más.',
    url: ROUTES.public.portfolio,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Portfolio Paola Bolívar Nievas',
    description: 'Explora mis trabajos de maquillaje social, caracterización, FX y más.',
  },
}

/**
 * Portfolio Page - Category Grid
 * Design: Grid 1x 2x 4x for 4 items balance.
 */
export default async function PortfolioPage() {
  const [categories, categorySettings] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        images: { take: 1, orderBy: { order: 'asc' }, select: { url: true } },
        _count: { select: { images: true } },
      },
      orderBy: { sortOrder: 'asc' },
    }),
    getCategorySettings(),
  ])

  const gridCols = categorySettings?.gridColumns ?? 4
  const showCount = false
  const showDesc = categorySettings?.showDescription ?? false

  return (
    <section className="w-full bg-(--background) transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8 lg:mb-10 lg:text-left">
          <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight text-(--foreground) uppercase sm:text-5xl lg:text-6xl">
            Portfolio
          </h1>
          <p className="font-body text-muted-foreground max-w-xl text-lg lg:mx-0">
            Una selección de mis mejores trabajos organizados por categoría.
          </p>
        </div>

        {/* Category Filter Chips - REMOVED: each category card is its own navigation */}

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <StaggerChildren
            className={`grid gap-3 sm:gap-6 lg:gap-8 ${gridCols === 1 ? 'grid-cols-1' : ''} ${gridCols === 2 ? 'grid-cols-2' : ''} ${gridCols === 3 ? 'grid-cols-2 lg:grid-cols-3' : ''} ${gridCols === 4 ? 'grid-cols-2 lg:grid-cols-4' : ''} `}
          >
            {categories.map((category) => {
              const cardImageUrl = category.coverImageUrl ?? category.images[0]?.url ?? null
              const hasImage = Boolean(cardImageUrl)

              return (
                <FadeIn key={category.id}>
                  <Link
                    href={`${ROUTES.public.portfolio}/${category.slug}`}
                    className="group relative block aspect-4/5 w-full cursor-pointer overflow-hidden rounded-[2.5rem] bg-(--card-bg) shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    {/* Background Image */}
                    {hasImage ? (
                      <>
                        <OptimizedImage
                          src={cardImageUrl}
                          alt={category.name}
                          fill
                          className="transition-transform duration-700 ease-out group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                          priority={category.sortOrder <= 4}
                          transparentBackground={false}
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                      </>
                    ) : (
                      <div className="bg-muted absolute inset-0 flex h-full w-full items-center justify-center">
                        <span className="text-muted-foreground text-6xl">📷</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 lg:p-8">
                      <h2
                        className={clsx(
                          'font-heading line-clamp-2 translate-y-2 text-base leading-tight font-bold transition-transform duration-300 group-hover:translate-y-0 sm:text-2xl lg:text-3xl',
                          hasImage ? 'text-white' : 'text-(--foreground)'
                        )}
                      >
                        {category.name}
                      </h2>

                      {/* Description - Conditional */}
                      {showDesc && category.description && (
                        <p
                          className={clsx(
                            'mt-2 line-clamp-2 text-sm',
                            hasImage ? 'text-white/80' : 'text-muted-foreground'
                          )}
                        >
                          {category.description}
                        </p>
                      )}

                      {/* Count - Conditional */}
                      {showCount && (
                        <p
                          className={clsx(
                            'mt-2 text-xs',
                            hasImage ? 'text-white/60' : 'text-muted-foreground'
                          )}
                        >
                          {category._count.images} fotograf
                          {category._count.images !== 1 ? 'ías' : 'ía'}
                        </p>
                      )}

                      <div
                        className={clsx(
                          'mt-2 h-1 w-12 rounded-full transition-all group-hover:w-20',
                          hasImage
                            ? 'bg-white/50 group-hover:bg-white'
                            : 'bg-primary/30 group-hover:bg-primary/50'
                        )}
                      />
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </StaggerChildren>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[3rem] bg-(--card-bg) py-24 text-center">
            <span className="mb-4 text-6xl">🎨</span>
            <h2 className="font-heading mb-2 text-2xl font-bold text-(--foreground)">
              Próximamente
            </h2>
            <p className="text-muted-foreground">
              Estamos preparando galerías increíbles para mostrarte.
            </p>
          </div>
        )}

        {/* Inline testimonials CTA */}
        <FadeIn className="mt-12 flex items-center justify-center gap-3 border-t border-(--border) pt-10">
          <span className="text-muted-foreground text-sm">¿Ya fui tu maquilladora?</span>
          <Link
            href={ROUTES.public.testimonialForm}
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          >
            <Heart size={14} />
            Deja tu opinión
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
