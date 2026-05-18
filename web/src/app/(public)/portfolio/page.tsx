import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Heart, ImageOff, Palette } from 'lucide-react'
import { FadeIn, StaggerChildren } from '@/components/ui'
import { getCategorySettings } from '@/actions/settings/categories'
import { getContactSettings } from '@/actions/settings/contact'
import { ROUTES } from '@/config/routes'
import type { Metadata } from 'next'
import PortfolioCardImage from './PortfolioCardImage'
import { unstable_cache } from 'next/cache'
import { CACHE_DURATIONS, CACHE_TAGS } from '@/lib/cache-tags'

/** ISR — alineado con `web/src/config/public-isr.ts` */
export const revalidate = 3600

const getPublicPortfolioCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        images: { orderBy: { order: 'asc' }, select: { url: true } },
        _count: { select: { images: true } },
      },
      orderBy: { sortOrder: 'asc' },
    }),
  ['public-portfolio-categories'],
  {
    revalidate: CACHE_DURATIONS.VERY_LONG,
    tags: [CACHE_TAGS.categories, CACHE_TAGS.categoryImages],
  }
)

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactSettings()
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const title = `Portfolio | ${ownerName}`
  const description = 'Explora trabajos de maquillaje social, caracterización, FX y más.'
  return {
    title,
    description,
    alternates: {
      canonical: ROUTES.public.portfolio,
    },
    openGraph: {
      title,
      description,
      url: ROUTES.public.portfolio,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/**
 * Portfolio Page - Category Grid
 * Design: Grid 1x 2x 4x for 4 items balance.
 */
export default async function PortfolioPage() {
  const [categories, categorySettings] = await Promise.all([
    getPublicPortfolioCategories(),
    getCategorySettings(),
  ])

  const gridCols = categorySettings?.gridColumns ?? 3
  const showCount = false
  const showDesc = categorySettings?.showDescription ?? false

  return (
    <section className="public-portfolio-page w-full transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8 lg:mb-10 lg:text-left">
          <h1 className="public-portfolio-title font-heading mb-4 text-4xl font-bold tracking-tight uppercase sm:text-5xl lg:text-6xl">
            Portfolio
          </h1>
          <p className="public-portfolio-muted font-body max-w-xl text-lg lg:mx-0">
            Una selección de mis mejores trabajos organizados por categoría.
          </p>
        </div>

        {/* Category Filter Chips - REMOVED: each category card is its own navigation */}

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <StaggerChildren
            className={`grid gap-2 sm:gap-3 lg:gap-4 ${gridCols === 1 ? 'grid-cols-1' : ''} ${gridCols === 2 ? 'grid-cols-2' : ''} ${gridCols === 3 ? 'grid-cols-2 lg:grid-cols-3' : ''} ${gridCols === 4 ? 'grid-cols-2 lg:grid-cols-4' : ''} `}
          >
            {categories.map((category) => {
              const cardImageUrl = category.coverImageUrl ?? category.images[0]?.url ?? null
              const fallbackCardImageUrls = category.images
                .map((image) => image.url)
                .filter((url) => url && url !== category.coverImageUrl)
              const hasImage = Boolean(cardImageUrl)

              return (
                <FadeIn key={category.id}>
                  <Link
                    href={`${ROUTES.public.portfolio}/${category.slug}`}
                    className="public-portfolio-card group relative block aspect-4/5 w-full cursor-pointer overflow-hidden rounded-3xl border border-t-0 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    {/* Background Image */}
                    {hasImage ? (
                      <>
                        <PortfolioCardImage
                          primarySrc={cardImageUrl}
                          fallbackSrcs={fallbackCardImageUrls}
                          alt={category.name}
                          priority={category.sortOrder <= 4}
                        />
                        {/* TODO: Persist the first valid category card image URL so we don't have to retry broken sources on future requests. */}
                        {/* Overlay Gradient */}
                        <div className="public-portfolio-card-overlay absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                      </>
                    ) : (
                      <div className="public-portfolio-image-fallback absolute inset-0 flex h-full w-full items-center justify-center">
                        <ImageOff className="size-14 shrink-0 sm:size-16" aria-hidden />
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 lg:p-6">
                      <h2
                        className={
                          hasImage
                            ? 'public-portfolio-card-title-on-image font-heading line-clamp-2 translate-y-2 text-base leading-tight font-bold transition-transform duration-300 group-hover:translate-y-0 sm:text-xl lg:text-2xl'
                            : 'public-portfolio-category-title font-heading line-clamp-2 translate-y-2 text-base leading-tight font-bold transition-transform duration-300 group-hover:translate-y-0 sm:text-xl lg:text-2xl'
                        }
                      >
                        {category.name}
                      </h2>

                      {/* Description - Conditional */}
                      {showDesc && category.description && (
                        <p
                          className={
                            hasImage
                              ? 'public-portfolio-card-title-on-image mt-2 line-clamp-2 text-sm opacity-80'
                              : 'public-portfolio-muted mt-2 line-clamp-2 text-sm'
                          }
                        >
                          {category.description}
                        </p>
                      )}

                      {/* Count - Conditional */}
                      {showCount && (
                        <p
                          className={
                            hasImage
                              ? 'public-portfolio-card-title-on-image mt-2 text-xs opacity-60'
                              : 'public-portfolio-muted mt-2 text-xs'
                          }
                        >
                          {category._count.images} fotograf
                          {category._count.images !== 1 ? 'ías' : 'ía'}
                        </p>
                      )}

                      <div className="public-portfolio-card-rule mt-2 h-1 w-12 rounded-full transition-all group-hover:w-20" />
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </StaggerChildren>
        ) : (
          <div className="public-portfolio-card rounded-jumbo flex flex-col items-center justify-center py-24 text-center">
            <Palette
              className="public-portfolio-muted mb-4 size-14 shrink-0 sm:size-16"
              aria-hidden
            />
            <h2 className="public-portfolio-title font-heading mb-2 text-2xl font-bold">
              Próximamente
            </h2>
            <p className="public-portfolio-muted">
              Estamos preparando galerías increíbles para mostrarte.
            </p>
          </div>
        )}

        {/* Inline testimonials CTA */}
        <FadeIn className="public-portfolio-divider mt-14 flex flex-col items-center justify-center gap-3 border-t pt-12 sm:mt-16 sm:flex-row sm:pt-14">
          <span className="public-portfolio-muted text-sm">¿Ya fui tu maquilladora?</span>
          <Link
            href={ROUTES.public.testimonialForm}
            className="public-portfolio-link inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
          >
            <Heart size={14} />
            Deja tu opinión
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
