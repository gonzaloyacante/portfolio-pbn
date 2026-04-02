import { prisma } from '@/lib/db'
import Link from 'next/link'
import { FadeIn, StaggerChildren, OptimizedImage } from '@/components/ui'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { FontLoader } from './FontLoader'

interface FeaturedCategoriesProps {
  title?: string | null
  count?: number
  titleFont?: string | null
  titleFontUrl?: string | null
  titleFontSize?: number | null
  titleColor?: string | null
  titleColorDark?: string | null
}

export default async function FeaturedCategories({
  title,
  count = 6,
  titleFont,
  titleFontUrl,
  titleFontSize,
  titleColor,
  titleColorDark,
}: FeaturedCategoriesProps) {
  const categories = await prisma.category.findMany({
    where: { isActive: true, deletedAt: null },
    include: {
      images: { take: 1, orderBy: { order: 'asc' }, select: { url: true } },
    },
    orderBy: { sortOrder: 'asc' },
    take: count,
  })

  if (categories.length === 0) return null

  const fontsToLoad = titleFont ? [titleFont] : []

  return (
    <section className="bg-(--background) py-16 transition-colors duration-500 lg:py-24">
      {fontsToLoad.length > 0 && <FontLoader fonts={fontsToLoad} />}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xl">
            <h2
              className="font-heading text-3xl font-bold text-(--foreground) sm:text-4xl lg:text-5xl"
              style={{
                fontFamily: titleFontUrl ? titleFont! : undefined,
                fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
              }}
            >
              <span className="dark:hidden" style={{ color: titleColor || 'inherit' }}>
                {title || 'Galerías Destacadas'}
              </span>
              <span
                className="hidden dark:inline"
                style={{ color: titleColorDark || titleColor || 'inherit' }}
              >
                {title || 'Galerías Destacadas'}
              </span>
            </h2>
          </div>
          <Link
            href={ROUTES.public.portfolio}
            className="group flex items-center gap-2 text-(--primary) transition-colors hover:text-(--accent)"
          >
            <span className="font-medium">Ver todo el portfolio</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <StaggerChildren className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <FadeIn key={category.id}>
              <Link
                href={`${ROUTES.public.portfolio}/${category.slug}`}
                className="group relative block aspect-4/5 overflow-hidden rounded-[2.5rem] bg-(--card-bg) shadow-lg transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Image */}
                {category.images[0]?.url ? (
                  <OptimizedImage
                    src={category.images[0].url}
                    alt={category.name}
                    fill
                    variant="card"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-(--card-bg)">
                    <span className="text-4xl text-(--foreground) opacity-20">📷</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 lg:p-8">
                  <h3 className="font-heading text-sm leading-tight font-bold text-white sm:text-xl lg:text-2xl">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-[10px] text-white/80 sm:text-xs">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            </FadeIn>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
